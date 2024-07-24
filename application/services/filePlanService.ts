import { getDistributions } from './distributionGeneratorService';

export function buildProduct(name, labelQuantity) {
    if (!name) throw Error('The product\'s \'name\' must be defined');

    if (!labelQuantity || isNaN(labelQuantity) || labelQuantity <= 0) throw Error(`The 'labelQuantity' attribute must be a positive integer. Received ${labelQuantity}`);

    return {
        name,
        labelQuantity: Number(labelQuantity)
    };
}

export function buildFilePlanRequest(products, labelsAcross, labelsAround) {
    if (!products || !products.length) throw Error(`Products must be a list with at least one object. Received: ${JSON.stringify(products)}`);

    if (labelsAcross <= 0) throw Error(`"labelsAcross" must be a positive integer. Received: ${labelsAcross}`);

    if (labelsAround <= 0) throw Error(`"labelsAround" must be a positive integer. Received: ${labelsAcross}`);

    return {
        products,
        numberOfLanes: labelsAcross,
        labelsPerLane: labelsAround
    };
}

function scaleProducts(products, productToScaleBy) {
    return products.map((product) => {
        const productDeepCopy = JSON.parse(JSON.stringify(product));

        productDeepCopy.scaledLabelQty = productDeepCopy.labelQuantity / productToScaleBy.labelQuantity;

        return productDeepCopy;
    });
}

function removeUsedProducts(products, productsToRemove) {
    return products.filter((product) => {
        return !productsToRemove.some((productToRemove) => {
            return product.name === productToRemove.name;
        });
    });
}

function isMasterGroupValid(masterGroup) {
    return masterGroup.totalFrames < masterGroup.originalFrames;
}

function checkIfDistributionExists(scaledProducts, distributionsToCheck, productToScaleBy, labelsPerLane) {
    let group;
    const masterGroupCandidates = [];
    let acceptableWastedFramesSlidingWindow = 0;
    let maxNumberOfIterations = 500;

    while (acceptableWastedFramesSlidingWindow < maxNumberOfIterations) {
        distributionsToCheck.some((distribution) => {
            let tempMasterGroup = [];

            const minimumNumberOfLanesInDistribution = Math.min(...distribution);

            const groupWasFound = distribution.every((numberOfLanes) => {
                let wastedFrames;

                const matchingProduct = scaledProducts.find((product) => {
                    const productWasAlreadySelected = tempMasterGroup.find((product2) => product2.name === product.name);

                    const extraFramesScalar = Math.abs(product.scaledLabelQty * minimumNumberOfLanesInDistribution - numberOfLanes);
                    wastedFrames = Math.ceil((extraFramesScalar * productToScaleBy.labelQuantity) / (numberOfLanes * labelsPerLane * minimumNumberOfLanesInDistribution));

                    return wastedFrames <= acceptableWastedFramesSlidingWindow && !productWasAlreadySelected;
                });

                if (matchingProduct) {
                    const matchingProductDeepCopy = JSON.parse(JSON.stringify(matchingProduct));
                    matchingProductDeepCopy.numberOfLanes = numberOfLanes;
                    matchingProductDeepCopy.wastedFrames = wastedFrames;
                    tempMasterGroup.push(matchingProductDeepCopy);

                    return true;
                }
                return false;
            });

            if (!groupWasFound) {
                return false;
            }

            group = tempMasterGroup;
            const masterGroup = createMasterGroupFromProducts(group, labelsPerLane);

            if (isMasterGroupValid(masterGroup)) {
                masterGroupCandidates.push(masterGroup);
            }
        });
        acceptableWastedFramesSlidingWindow = acceptableWastedFramesSlidingWindow + 1;
    }

    masterGroupCandidates.sort((a, b) => a.totalFrames - b.totalFrames);

    return masterGroupCandidates.length > 0 ? masterGroupCandidates[0].products : undefined;
}

function createMasterGroupFromProducts(products, labelsPerLane) {
    let mostFramesRequiredByOneProduct = 0;
    let numberOfLanes = 0;

    products.forEach((product) => {
        const framesRequiredForProduct = Math.ceil((product.labelQuantity) / (product.numberOfLanes * labelsPerLane));
        numberOfLanes = numberOfLanes + product.numberOfLanes;

        if (framesRequiredForProduct > mostFramesRequiredByOneProduct) {
            mostFramesRequiredByOneProduct = framesRequiredForProduct;
        }
    });

    const labelsPerFrame = labelsPerLane * numberOfLanes;

    return {
        products,
        totalFrames: mostFramesRequiredByOneProduct,
        labelsAcross: numberOfLanes,
        labelsAround: labelsPerLane,
        originalFrames: computeOriginalFrames(products, labelsPerFrame)
    };
}

function compareProductNames(productA, productB) {
    return productA.name.localeCompare(productB.name);
}

function computeFramesToCompleteFilePlan(masterGroups) {
    const extraFramesPerMasterGroup = 20;
    const extraFramesPerFilePlan = 25;
    const extraFrames = ((masterGroups.length - 1) * extraFramesPerMasterGroup) + extraFramesPerFilePlan;
    const framesRequiredForPrinting = masterGroups.reduce((accumulator, masterGroup) => accumulator + masterGroup.totalFrames, 0);

    return framesRequiredForPrinting + extraFrames;
}

function computeOriginalFrames(products, frameSize) {
    const extraFramesPerMasterGroup = 20;
    const extraFramesPerFilePlan = 25;
    const extraFrames = ((products.length - 1) * extraFramesPerMasterGroup) + extraFramesPerFilePlan;
    const framesRequiredForPrinting = products.reduce((accumulator, product) => accumulator + Math.ceil(product.labelQuantity / frameSize), 0);

    return framesRequiredForPrinting + extraFrames;
}

function computeTotalProducts(masterGroups) {
    return masterGroups.reduce((accumulator, masterGroup) => accumulator + masterGroup.products.length, 0);
}

export function buildFilePlan(filePlanRequest) {
    const { numberOfLanes, labelsPerLane } = filePlanRequest;
    let { products } = filePlanRequest;
    const frameSize = numberOfLanes * labelsPerLane;
    const originalFrames = computeOriginalFrames(products, frameSize);

    products.sort(compareProductNames);

    let groupSize = products.length < numberOfLanes ? products.length : numberOfLanes;
    const distributions = getDistributions(numberOfLanes);
    const masterGroups = [];

    while (products.length !== 0) {
        let groupOfProducts;
        const distributionsToCheck = distributions[groupSize];
        const masterGroupCandidatesForDistribution = [];

        products.forEach((product) => {
            const scaledProducts = scaleProducts(products, product);
            groupOfProducts = checkIfDistributionExists(scaledProducts, distributionsToCheck, product, labelsPerLane);

            if (!groupOfProducts) {
                return false;
            }

            const masterGroup = createMasterGroupFromProducts(groupOfProducts, labelsPerLane);
            masterGroupCandidatesForDistribution.push(masterGroup);
        });

        if (masterGroupCandidatesForDistribution.length > 0) {
            masterGroupCandidatesForDistribution.sort((a, b) => a.totalFrames - b.totalFrames);
            const masterGroup = masterGroupCandidatesForDistribution[0];

            masterGroup.products.forEach((product) => {
                delete product.scaledLabelQty;
                delete product.wastedFrames;
            });

            masterGroups.push(masterGroup);

            products = removeUsedProducts(products, masterGroup.products);
        } else {
            groupSize = groupSize - 1;
        }
    }

    return {
        masterGroups,
        numberOfMasterGroups: masterGroups.length,
        totalFrames: computeFramesToCompleteFilePlan(masterGroups),
        totalProducts: computeTotalProducts(masterGroups),
        originalFrames
    };
}
const distributionGeneratorService = require('./distributionGeneratorService');

module.exports.buildProduct = (name, labelQuantity) => {
    if (!name) throw Error('The product\'s \'name\' must be defined');

    if (!labelQuantity || isNaN(labelQuantity) || labelQuantity <= 0) throw Error(`The 'labelQuantity' attribute must be a positive integer. Received ${labelQuantity}`);

    return {
        name,
        labelQuantity: Number(labelQuantity)
    };
};

module.exports.buildFilePlanRequest = (products, labelsAcross, labelsAround) => {
    if (!products || !products.length) throw Error(`Products must be a list with at least one object. Received: ${JSON.stringify(products)}`);

    if (labelsAcross <= 0) throw Error(`"labelsAcross" must be a positive integer. Received: ${labelsAcross}`);

    if (labelsAround <= 0) throw Error(`"labelsAround" must be a positive integer. Received: ${labelsAcross}`);

    return {
        products,
        numberOfLanes: labelsAcross,
        labelsPerLane: labelsAround
    };
};

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
    const wastedFramesPerExtraMasterGroup = 20;

    return masterGroup.products.every((product) => {
        const labelsPerFrame = masterGroup.labelsAcross * masterGroup.labelsAround;
        const labelsToPrintThisProductByItself = Math.ceil(product.labelQuantity / labelsPerFrame);
    
        const isItEfficientToKeepThisProductInThisMasterGroup = product.wastedFrames <= labelsToPrintThisProductByItself + wastedFramesPerExtraMasterGroup;

        return isItEfficientToKeepThisProductInThisMasterGroup ? true : false;
    });
}

function checkIfDistributionExists(scaledProducts, distributionsToCheck, productToScaleBy, labelsPerLane) {
    let group;
    const masterGroupCandidates = [];
    let acceptableWastedFramesSlidingWindow = 0;
    let maxNumberOfIterations = 500;

    while (acceptableWastedFramesSlidingWindow < maxNumberOfIterations && masterGroupCandidates.length === 0) {
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
                return true;
            }
        });
        acceptableWastedFramesSlidingWindow = acceptableWastedFramesSlidingWindow + 1;
    }

    masterGroupCandidates.sort((a, b) => a.totalFrames - b.totalFrames);
  
    return masterGroupCandidates.length > 0 ? masterGroupCandidates[0].products : undefined;
}

function createMasterGroupFromProducts(products, labelsPerLane) {
    let mostFramesRequiredByOneProduct = 0;
    let labelsAcross = 0;

    products.forEach((product) => {
        const framesRequiredForProduct = Math.ceil((product.labelQuantity) / (product.numberOfLanes * labelsPerLane));
        labelsAcross = labelsAcross + product.numberOfLanes;

        if (framesRequiredForProduct > mostFramesRequiredByOneProduct) {
            mostFramesRequiredByOneProduct = framesRequiredForProduct;
        }
    });

    return {
        products,
        totalFrames: mostFramesRequiredByOneProduct,
        labelsAcross,
        labelsAround: labelsPerLane
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

module.exports.buildFilePlan = (filePlanRequest) => {
    const { numberOfLanes, labelsPerLane } = filePlanRequest;
    let { products } = filePlanRequest;
    const frameSize = numberOfLanes * labelsPerLane;
    const originalFrames = computeOriginalFrames(products, frameSize);

    products.sort(compareProductNames);

    let groupSize = products.length < numberOfLanes ? products.length : numberOfLanes;
    const distributions = distributionGeneratorService.getDistributions(numberOfLanes);
    const masterGroups = [];

    while (products.length !== 0) {
        const distributionsToCheck = distributions[groupSize];
        let groupOfProducts;
    
        products.some((product) => {
            const scaledProducts = scaleProducts(products, product);
            groupOfProducts = checkIfDistributionExists(scaledProducts, distributionsToCheck, product, labelsPerLane);

            if (!groupOfProducts) {
                return false;
            }

            products = removeUsedProducts(products, groupOfProducts);

            return true;
        });
    
        if (groupOfProducts) {
            groupOfProducts.forEach((product) => {
                delete product.scaledLabelQty;
                delete product.wastedFrames;
            });
            const masterGroup = createMasterGroupFromProducts(groupOfProducts, labelsPerLane);
            masterGroups.push(masterGroup);
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
};
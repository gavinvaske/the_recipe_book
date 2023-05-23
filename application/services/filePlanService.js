const distributionGeneratorService = require('./distributionGeneratorService');

module.exports.buildProduct = (name, labelQuantity) => {
    if (!name) throw Error('The product\'s \'name\' must be defined');

    if (!labelQuantity || labelQuantity <= 0) throw Error(`The 'labelQuantity' attribute must be a positive integer. Received ${labelQuantity}`);

    return {
        name,
        labelQuantity
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

function checkIfDistributionExists(scaledProducts, distributionsToCheck, productToScaleBy, labelsPerLane) {
    let group;
    const masterGroupCandidates = [];

    distributionsToCheck.some((distribution) => {
        let tempMasterGroup = [];

        const minimumNumberOfLanesInDistribution = Math.min(...distribution);

        const groupWasFound = distribution.every((numberOfLanes) => {
            const matchingProduct = scaledProducts.find((product) => {
                const productWasAlreadySelected = tempMasterGroup.find((product2) => product2.name === product.name);

                const acceptableNumberOfWastedFrames = 20;
                const extraFramesScalar = Math.abs(product.scaledLabelQty * minimumNumberOfLanesInDistribution - numberOfLanes);
                const wastedFrames = Math.ceil((extraFramesScalar * productToScaleBy.labelQuantity) / (numberOfLanes * labelsPerLane * minimumNumberOfLanesInDistribution));
  
                return wastedFrames <= acceptableNumberOfWastedFrames && !productWasAlreadySelected;
            });

            if (matchingProduct) {
                const matchingProductDeepCopy = JSON.parse(JSON.stringify(matchingProduct));
                matchingProductDeepCopy.numberOfLanes = numberOfLanes;
                tempMasterGroup.push(matchingProductDeepCopy);
             
                return true;
            }
            return false;
        });
  
        if (groupWasFound) {
            group = tempMasterGroup;
            masterGroupCandidates.push(createMasterGroupFromProducts(group, labelsPerLane));
        }
    });

    masterGroupCandidates.sort((a, b) => a.totalFrames - b.totalFrames);
  
    return masterGroupCandidates.length > 0 ? masterGroupCandidates[0].products : undefined;
}

function createMasterGroupFromProducts(products, labelsPerLane) {
    let mostFramesRequiredByOneProduct = 0;

    products.forEach((product) => {
        const framesRequiredForProduct = Math.ceil((product.labelQuantity) / (product.numberOfLanes * labelsPerLane));

        if (framesRequiredForProduct > mostFramesRequiredByOneProduct) {
            mostFramesRequiredByOneProduct = framesRequiredForProduct;
        }
    });

    return {
        products,
        totalFrames: mostFramesRequiredByOneProduct
    };
}

function compareProductNames(productA, productB) {
    return productA.name.localeCompare(productB.name);
}

module.exports.buildFilePlan = (filePlanRequest) => {
    const { numberOfLanes, labelsPerLane } = filePlanRequest;
    let { products } = filePlanRequest;

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
            groupOfProducts.forEach((product) => delete product.scaledLabelQty);
            const masterGroup = createMasterGroupFromProducts(groupOfProducts, labelsPerLane);
            masterGroups.push(masterGroup);
        } else {
            groupSize = groupSize - 1;
        }
    }

    return {
        masterGroups,
        numberOfMasterGroups: masterGroups.length
    };
};
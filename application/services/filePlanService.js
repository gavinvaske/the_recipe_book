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

/* 
  [
    {
      'masterGroups': [
        {
          products: [
            {id: 'product-a', numberOfLanes: 1},
            {id: 'product-b', numberOfLanes: 1},
            {id: 'product-c', numberOfLanes: 2}
          ],
          labelsPerLane: 2,
          totalLanes: 4,
          frames: 625
        },
      ]
    }
  ]

*/

/* Data Modelings for: 'Master Group'
  {
    products: [
      {id: 'product-a', numberOfLanes: 1}
      {id: 'product-b', numberOfLanes: 1}
      {id: 'product-c', numberOfLanes: 2}
    ],
    labelsPerLane: 2,
    totalLanes: 4,
    frames: 625
  }
*/

/* Data Modelings for: 'FilePlanCandidate'
  {
    masterGroups: [MasterGroup1, MasterGroup2],
    totalFrames: 123  # TODO: This attribute can technically be calculated on the fly? TBD?
  }
*/

/* Data Modelings for: 'FilePlanCandidates'
  [
    FilePlanCandidate1,
    FilePlanCandidate2,
    ...
    FilePlanCandidateN
  ]
*/

// https://www.geeksforgeeks.org/ways-to-sum-to-n-using-natural-numbers-up-to-k-with-repetitions-allowed/
function getDistributions(numberOfLanes) {
  if (numberOfLanes !== 4) {
    throw new Error('Code is only setup to handle frames with 4 labels across')
  }

  return {
    4: [[1, 1, 1, 1]],
    3: [[1, 1, 2]],
    2: [[2, 2]],
    1: [[4]]
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

function checkIfDistributionExists(scaledProducts, distributionsToCheck) {
    let group;
    distributionsToCheck.some((distribution) => {
        let tempMasterGroup = [];

        const minimumNumberOfLanesInDistribution = Math.min(...distribution);

        const groupWasFound = distribution.every((numberOfLanes) => {
            const matchingProduct = scaledProducts.find((product) => {
                const productWasAlreadySelected = tempMasterGroup.find((product2) => product2.name === product.name);

                return product.scaledLabelQty * minimumNumberOfLanesInDistribution === numberOfLanes && !productWasAlreadySelected;
            });

            if (matchingProduct) {
                matchingProduct.numberOfLanes = numberOfLanes;
                delete matchingProduct.scaledLabelQty;
                tempMasterGroup.push(matchingProduct);
             
                return true;
            }
            return false;
        });
  
        if (groupWasFound) {
            group = tempMasterGroup;
            return true;
        }
    });
  
    return group;
}

function createMasterGroupFromProducts(products, frameSize) {
  const totalLabelsInMasterGroup = products.reduce((accumulator, product) => {
    return accumulator + product.labelQuantity;
  }, 0);

  return {
    products,
    frames: Math.ceil(totalLabelsInMasterGroup / frameSize)
  }
}

function compareProductNames(productA, productB) {
  return productA.name.localeCompare(productB.name)
}

module.exports.buildFilePlan = (filePlanRequest) => {
    const { numberOfLanes, labelsPerLane } = filePlanRequest;
    let { products } = filePlanRequest;

    products.sort(compareProductNames);

    let groupSize = numberOfLanes;
    const frameSize = numberOfLanes * labelsPerLane;
    const distributions = getDistributions(numberOfLanes);
    const masterGroups = [];

    while (products.length !== 0) {
        const distributionsToCheck = distributions[groupSize];
        let groupOfProducts;
    
        products.some((product) => {
            const scaledProducts = scaleProducts(products, product);
            groupOfProducts = checkIfDistributionExists(scaledProducts, distributionsToCheck, products);

            if (!groupOfProducts) {
              return false;
            }

            products = removeUsedProducts(products, groupOfProducts);

            return true;
        });
    
        if (groupOfProducts) {
            const masterGroup = createMasterGroupFromProducts(groupOfProducts, frameSize);
            masterGroups.push(masterGroup);
        } else {
            groupSize = groupSize - 1;
        }
      }

    return {
      masterGroups
    }
};
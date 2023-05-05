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

function groupProductsByLabelQuantity(products) {
  const labelQuantityToProducts = {};

  products.forEach((product) => {
    const { labelQuantity } = product;
    const isTheFirstTimeSeeingThisLabelQuantity = !labelQuantityToProducts[labelQuantity]
    
    if (isTheFirstTimeSeeingThisLabelQuantity) {
      labelQuantityToProducts[labelQuantity] = [];
    }

    labelQuantityToProducts[labelQuantity].push(product);
  });

  return labelQuantityToProducts;
}

function addProductToMasterGroup(filePlanRequest, masterGroup, product, numberOfLanesPerFrameThisProductUses) {
  masterGroup.products.push(
    {
      id: product.name, 
      numberOfLanes: numberOfLanesPerFrameThisProductUses,
    }
  )

  console.log('master Group Below: ')
  console.log(masterGroup)

  deleteProductFromFilePlan(filePlanRequest, product);
}

function createTemplateFilePlan(numberOfLanes, labelsPerLane) {
  const filePlan = {
    masterGroups: [],
    labelsPerLane: labelsPerLane,
    totalLanes: numberOfLanes
  }

  return filePlan;
}

function createTemplateMasterGroup() {
  return {
    'products': []
  }
}

function addFramesToMasterGroup(masterGroup, framesToPrint) {
  masterGroup.frames = framesToPrint;
}

function addMasterGroupToFilePlan(filePlan, masterGroup) {
  filePlan.masterGroups.push(masterGroup);
}

function generateAllPossibleDistributes(numberOfLanes) {
  console.log(`numberOfLanes => ${numberOfLanes}`); // TODO: Make use of numberOfLanes in this function

  if (numberOfLanes === 1) {
    return [
      {1: 1}
    ]
  } else {
    return [
      {2: 1},
      {1: 2}
    ]
  }
}

function shouldContinueGeneratingMasterGroups(filePlanRequest) {  // TODO: Build this so they come
  return true;
}

function getNextLargestMasterGroupDistribution(allMasterGroupDistributions) {
  const firstItemInList = allMasterGroupDistributions.splice(0, 1)[0];

  return firstItemInList;
}

function selectNextProduct(products) {
  return products[0];
}

function scaleProducts(products, productToScaleBy) {
  return products.map((product) => {
    const scalar = product.labelQuantity / productToScaleBy.labelQuantity;
    return {
      ...product,
      labelQuantity: scalar
    }
  })
}

function computeNumberOfFrames(product, numberOfLabelsPrintedOfThisProductPerFrame) {
  return Math.ceil(product.labelQuantity / numberOfLabelsPrintedOfThisProductPerFrame);
}

function deleteProductFromFilePlan(filePlanRequest, productToRemove) {
  filePlanRequest.products.some((product, index) => {
    if (product.id === productToRemove.id) {
      filePlanRequest.products.splice(index, 1);
      return true;
    }
  })
}

function getGroupOfSizeNHavingSameLabelQuantity(labelQuantityToProducts, numberOfLanes) {
  let groupOfProductsWithSameLabelQuantity;

  Object.values(labelQuantityToProducts).some((productsWithSameLabelQuantity) => {
    if (productsWithSameLabelQuantity.length === numberOfLanes) {
      groupOfProductsWithSameLabelQuantity = productsWithSameLabelQuantity;

      return true;
    }
  })

  return groupOfProductsWithSameLabelQuantity;
}

module.exports.generateFilePlan = (filePlanRequest) => {
  const {products, numberOfLanes, labelsPerLane} = filePlanRequest;
  const labelsPerFrame = numberOfLanes * labelsPerLane;
  const masterGroup = createTemplateMasterGroup();
  const filePlan = createTemplateFilePlan(numberOfLanes, labelsPerLane);

  if (products.length === 1) {
    const onlyProductInList = products[0];

    addProductToMasterGroup(filePlanRequest, masterGroup, onlyProductInList, numberOfLanes);

    masterGroup.frames = computeNumberOfFrames(onlyProductInList.labelQuantity, labelsPerFrame);

    addMasterGroupToFilePlan(filePlan, masterGroup);

    return filePlan;
  }

  const labelQuantityToProducts = groupProductsByLabelQuantity(products);

  const groupOfProductsWithSameLabelQuantity = getGroupOfSizeNHavingSameLabelQuantity(labelQuantityToProducts, numberOfLanes);

  console.log('below: ')
  console.log(groupOfProductsWithSameLabelQuantity)

  if (groupOfProductsWithSameLabelQuantity) {
    const oneLane = 1;

    groupOfProductsWithSameLabelQuantity.forEach((product) => {
      addProductToMasterGroup(filePlanRequest, masterGroup, product, oneLane);
    });

    masterGroup.frames = computeNumberOfFrames(groupOfProductsWithSameLabelQuantity[0], oneLane * labelsPerLane);
  }

  // const allPotentialMasterGroupDistributions = generateAllPossibleDistributes(numberOfLanes);
  // const nextLargestMasterGroupDistribution = getNextLargestMasterGroupDistribution(allPotentialMasterGroupDistributions);
  
  addMasterGroupToFilePlan(filePlan, masterGroup);

  return filePlan;
}
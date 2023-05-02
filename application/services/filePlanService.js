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

function addProductToMasterGroup(masterGroup, product, numberOfLanes) {
  if (!masterGroup.products) {
    masterGroup.products = [];
  }

  masterGroup['products'].push(
    { 
      id: product.name, 
      numberOfLanes: numberOfLanes,
      labelQuantity: product.labelQuantity
    }
  )
}

module.exports.generateFilePlan = (filePlanRequest) => {
  const {products, numberOfLanes, labelsPerLane} = filePlanRequest;
  const labelsPerFrame = numberOfLanes * labelsPerLane;
  let masterGroup = {};
  const filePlan = {
    'masterGroups': []
  }

  filePlan.labelsPerLane = labelsPerLane;
  filePlan.totalLanes = numberOfLanes;

  if (products.length === 1) {
    addProductToMasterGroup(masterGroup, products[0], numberOfLanes);

    masterGroup.frames = products[0].labelQuantity / labelsPerFrame
    filePlan.masterGroups.push(masterGroup);

    return filePlan;
  }

  const labelQuantityToProducts = groupProductsByLabelQuantity(products);

  Object.keys(labelQuantityToProducts).some((labelQuantity) => {
    const productsWithSameLabelQuantity = labelQuantityToProducts[labelQuantity];
    const canDistributeProductsEvenlyAcrossOneFrame = productsWithSameLabelQuantity.length >= numberOfLanes;

    if (!canDistributeProductsEvenlyAcrossOneFrame) {
      return false;
    }

    masterGroup = {};
    const numberOfLanesAllocatedToThisProduct = 1;  // TODO: This will be dynamic eventually

    for (let i = 0; i < numberOfLanes; i++) {
      const product = productsWithSameLabelQuantity[i];
      addProductToMasterGroup(masterGroup, product, numberOfLanesAllocatedToThisProduct)
    }

    const percentOfFrameDedicatedToThisProduct = (numberOfLanesAllocatedToThisProduct / numberOfLanes);
    masterGroup.frames = productsWithSameLabelQuantity[0].labelQuantity / labelsPerFrame / percentOfFrameDedicatedToThisProduct;

    filePlan.masterGroups.push(masterGroup);
  });

  console.log('blahahahaha')
  console.log(JSON.stringify(filePlan))

  return filePlan;
};

  // return {
  //   'masterGroups': [
  //       {
  //           products: [
  //               {id: products[0].name, numberOfLanes: numberOfLanes},
  //           ],
  //           labelsPerLane: labelsPerLane,
  //           totalLanes: numberOfLanes,
  //           frames: products[0].labelQuantity / labelsPerFrame
  //       }
  //   ]
  // };
const chance = require('chance').Chance();
const matchers = require('jest-extended');
const filePlanService = require('../../application/services/filePlanService');

expect.extend(matchers);

function getProductWithRandomAttributes() {
    const productName = chance.string();
    const labelQuantity = chance.integer({min: 1, max: 10000});

    return filePlanService.buildProduct(productName, labelQuantity);
}

describe('filePlanService.js', () => {
    describe('buildProduct', () => {
        it('should return an object with the correct attributes', () => {
            const name = chance.string();
            const labelQuantity = chance.d100();

            const product = filePlanService.buildProduct(name, labelQuantity);

            expect(product.name).toEqual(name);
            expect(product.labelQuantity).toEqual(labelQuantity);
        });

        it('should throw an error if name is not defined', () => {
            const name = '';
            const labelQuantity = chance.d100();

            expect(() => filePlanService.buildProduct(name, labelQuantity)).toThrowError('The product\'s \'name\' must be defined');
        });

        it('should throw an error if labelQuantity is less than or equal to 0', () => {
            const name = chance.string();
            const labelQuantity = chance.integer({max: 0, min: -2});

            expect(() => filePlanService.buildProduct(name, labelQuantity)).toThrowError(`The 'labelQuantity' attribute must be a positive integer. Received ${labelQuantity}`);
        });

        it('should throw an error if labelQuantity is undefined', () => {
            const name = chance.string();
            const labelQuantity = undefined;

            expect(() => filePlanService.buildProduct(name, labelQuantity)).toThrowError(`The 'labelQuantity' attribute must be a positive integer. Received ${labelQuantity}`);
        });
    });

    describe ('buildFilePlanRequest', () => {
        let products,
            labelsAcross,
            labelsAround;

        beforeEach(() => {
            products = chance.n(getProductWithRandomAttributes, chance.d100());
            labelsAcross = chance.d10();
            labelsAround = chance.d10();
        });

        it('should return an object with the correct attributes', () => {
            const filePlanRequest = filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround);

            expect(JSON.stringify(filePlanRequest.products)).toEqual(JSON.stringify(products));
            expect(filePlanRequest.numberOfLanes).toEqual(labelsAcross);
            expect(filePlanRequest.labelsPerLane).toEqual(labelsAround);
        });

        it('should throw an error if products is undefined', () => {
            products = undefined;

            expect(() => 
                filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround)
            ).toThrow(`Products must be a list with at least one object. Received: ${JSON.stringify(products)}`);
        });

        it('should throw an error if products is an empty list', () => {
            products = [];

            expect(() => 
                filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround)
            ).toThrow(`Products must be a list with at least one object. Received: ${JSON.stringify(products)}`);
        });

        it('should throw an error if labelsAcross is less than or equal to 0', () => {
            labelsAcross = chance.integer({max: 0, min: -2});

            expect(() => 
                filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround)
            ).toThrow(`"labelsAcross" must be a positive integer. Received: ${labelsAcross}`);
        });

        it('should throw an error if labelsAround is less than or equal to 0', () => {
            labelsAround = chance.integer({max: 0, min: -2});

            expect(() => 
                filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround)
            ).toThrow(`"labelsAround" must be a positive integer. Received: ${labelsAcross}`);
        });
    });

    describe('buildFilePlan()', () => {
        let filePlanRequest,
            labelsAcross,
            labelsAround,
            products,
            frameSize;

        beforeEach(() => {
            products = chance.n(getProductWithRandomAttributes, chance.d100());
            labelsAcross = 4;
            labelsAround = chance.d100();
            frameSize = labelsAcross * labelsAround;

            filePlanRequest = filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround);
        });
        
        it('should return a single masterGroup when only 1 product exists', () => {
            labelsAcross = 4;
            products = [getProductWithRandomAttributes()];
            filePlanRequest = filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround);
            const expectedFilePlan = {
              masterGroups: [
                {
                  products: [
                      {
                        name: products[0].name,
                        labelQuantity: products[0].labelQuantity,
                        numberOfLanes: labelsAcross
                      }
                  ],
                  frames: Math.ceil(products[0].labelQuantity / frameSize)
                }
              ]
            }

            const actualFilePlan = filePlanService.buildFilePlan(filePlanRequest);

            expect(actualFilePlan.masterGroups).toIncludeAllMembers(expectedFilePlan.masterGroups)
        });

        it('should return one master groups', () => {
          labelsAcross = 4;
          const productA = {name: 'product-A', labelQuantity: 4000}
          const productB = {name: 'product-B', labelQuantity: 2000}
          const productC = {name: 'product-C', labelQuantity: 2000}
          products = [productA, productB, productC];
          filePlanRequest = filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround);
          const expectedFilePlan = {
            masterGroups: [
              {
                products: [
                    {
                      name: productA.name,
                      labelQuantity: productA.labelQuantity,
                      numberOfLanes: 2
                    },
                    {
                      name: productB.name,
                      labelQuantity: productB.labelQuantity,
                      numberOfLanes: 1
                    },
                    {
                      name: productC.name,
                      labelQuantity: productC.labelQuantity,
                      numberOfLanes: 1
                    }
                ],
                frames: Math.ceil((productA.labelQuantity + productB.labelQuantity + productC.labelQuantity) / frameSize)
              }
            ]
          }

          const actualFilePlan = filePlanService.buildFilePlan(filePlanRequest);

          expect(actualFilePlan.masterGroups.length).toEqual(1);
          expect(actualFilePlan.masterGroups[0].frames).toEqual(expectedFilePlan.masterGroups[0].frames)
          expect(actualFilePlan.masterGroups[0].products).toIncludeAllMembers(expectedFilePlan.masterGroups[0].products)
      });

        it('should return two master groups', () => {
          labelsAcross = 4;
          const productA = {name: 'product-A', labelQuantity: 8000}
          const productB = {name: 'product-B', labelQuantity: 8000}
          const productC = {name: 'product-C', labelQuantity: 3000}
          products = [productA, productB, productC];
          filePlanRequest = filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround);
          const expectedFilePlan = {
            masterGroups: [
              {
                products: [
                    {
                      name: productA.name,
                      labelQuantity: productA.labelQuantity,
                      numberOfLanes: 2
                    },
                    {
                      name: productB.name,
                      labelQuantity: productB.labelQuantity,
                      numberOfLanes: 2
                    }
                ],
                frames: Math.ceil((productA.labelQuantity + productB.labelQuantity) / frameSize)
              },
              {
                products: [
                    {
                      name: productC.name,
                      labelQuantity: productC.labelQuantity,
                      numberOfLanes: 4
                    }
                ],
                frames: Math.ceil(productC.labelQuantity / frameSize)
              }
            ]
          }

          const actualFilePlan = filePlanService.buildFilePlan(filePlanRequest);

          expect(actualFilePlan.masterGroups).toIncludeAllMembers(expectedFilePlan.masterGroups)
      });

      it('should return many master groups with one product each', () => {
        labelsAcross = 4;
        const productA = {name: 'product-A', labelQuantity: 1103}
        const productB = {name: 'product-B', labelQuantity: 4451}
        const productC = {name: 'product-C', labelQuantity: 7529}
        products = chance.shuffle([productA, productB, productC]);
        filePlanRequest = filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround);
        const expectedFilePlan = {
          masterGroups: [
            {
              products: [
                  {
                    name: productA.name,
                    labelQuantity: productA.labelQuantity,
                    numberOfLanes: 4
                  }
              ],
              frames: Math.ceil((productA.labelQuantity) / frameSize)
            },
            {
              products: [
                  {
                    name: productB.name,
                    labelQuantity: productB.labelQuantity,
                    numberOfLanes: 4
                  }
              ],
              frames: Math.ceil(productB.labelQuantity / frameSize)
            },
            {
              products: [
                  {
                    name: productC.name,
                    labelQuantity: productC.labelQuantity,
                    numberOfLanes: 4
                  }
              ],
              frames: Math.ceil(productC.labelQuantity / frameSize)
            }
          ]
        }

        const actualFilePlan = filePlanService.buildFilePlan(filePlanRequest);

        expect(actualFilePlan.masterGroups).toIncludeAllMembers(expectedFilePlan.masterGroups)
    });
    });
});
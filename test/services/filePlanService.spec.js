const chance = require('chance').Chance();
const filePlanService = require('../../application/services/filePlanService');

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

    describe('buildFilePlanCandidates()', () => {
        let filePlanRequest,
            labelsAcross,
            labelsAround;

        beforeEach(() => {
            const products = chance.n(getProductWithRandomAttributes, chance.d100());
            labelsAcross = chance.d100();
            labelsAround = chance.d100();

            filePlanRequest = filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround);
        });

        describe('buildFilePlanRequest() using for a single product', () => {
            it('should return a single masterGroup if only one product exists', () => {
                products = [getProductWithRandomAttributes()];
                filePlanRequest = filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround);
    
                const filePlan = filePlanService.generateFilePlan(filePlanRequest);
    
                expect(filePlan.masterGroups.length).toEqual(1);
            });
  
            it('should return a the correct file plan if a single product exists', () => {
                const product = getProductWithRandomAttributes();
                products = [product];
                filePlanRequest = filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround);
                const labelsPerFrame = labelsAcross * labelsAround;
                const expectedFilePlan = {
                  masterGroups: [
                    {
                        products: [{id: product.name, numberOfLanes: labelsAcross, labelQuantity: product.labelQuantity}],
                        frames: product.labelQuantity / labelsPerFrame
                    }
                  ],
                  labelsPerLane: labelsAround,
                  totalLanes: labelsAcross,
                }
                
                const filePlan = filePlanService.generateFilePlan(filePlanRequest);
        
                expect(filePlan).toEqual(expectedFilePlan);
            });
        });

        describe('buildFilePlanRequest() using multiple product', () => {
          it('should return two candidates if two products are defined', () => {
            const firstProduct = filePlanService.buildProduct('PRODUCT-A', 1000);
            const secondProduct = filePlanService.buildProduct('PRODUCT-B', 1000);

            products = [firstProduct, secondProduct];
            labelsAcross = 2;
            labelsAround = 2;
            filePlanRequest = filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround);

            const labelsPerFrame = labelsAcross * labelsAround;
            const expectedFilePlan = 
              {
                'masterGroups': [
                  {
                    products: [
                      { id: firstProduct.name, numberOfLanes: 1, labelQuantity: firstProduct.labelQuantity },
                      { id: secondProduct.name, numberOfLanes: 1, labelQuantity: secondProduct.labelQuantity },
                    ],
                    frames: (firstProduct.labelQuantity + secondProduct.labelQuantity) / labelsPerFrame
                  }
                ],
                labelsPerLane: labelsAround,
                totalLanes: labelsAcross,
              };

            console.log(JSON.stringify(expectedFilePlan))
  
            const filePlan = filePlanService.generateFilePlan(filePlanRequest);

        expect(filePlan).toMatchObject(expectedFilePlan)
      })
    })
    });
});
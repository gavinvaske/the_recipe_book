/* eslint no-magic-numbers: 0 */
const chance = require('chance').Chance();
const matchers = require('jest-extended');
const filePlanService = require('../../application/services/filePlanService');

expect.extend(matchers);

function getProductWithRandomAttributes() {
    const productName = chance.string();
    const labelQuantity = chance.integer({min: 1, max: 10000});

    return filePlanService.buildProduct(productName, labelQuantity);
}

function computeExpectedFrames(masterGroups) {
    const totalFrames = masterGroups.reduce((accumulator, masterGroup) => accumulator + masterGroup.totalFrames, 0);
    const extraFrames = ((masterGroups.length - 1) * 20) + 25;
    
    return totalFrames + extraFrames;
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
                        totalFrames: Math.ceil(products[0].labelQuantity / frameSize)
                    }
                ],
                totalProducts: products.length
            };
            expectedFilePlan.totalFrames = computeExpectedFrames(expectedFilePlan.masterGroups);

            const actualFilePlan = filePlanService.buildFilePlan(filePlanRequest);

            expect(actualFilePlan.masterGroups).toIncludeAllMembers(expectedFilePlan.masterGroups);
            expect(actualFilePlan.totalFrames).toEqual(expectedFilePlan.totalFrames);
        });

        it('should return one master groups', () => {
            labelsAcross = 4;

            const productA = {name: 'product-A', labelQuantity: 4000};
            const productB = {name: 'product-B', labelQuantity: 2000};
            const productC = {name: 'product-C', labelQuantity: 2000};

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
                        totalFrames: Math.ceil(productA.labelQuantity / 2 / labelsAround)
                    }
                ],
                numberOfMasterGroups: 1,
                totalProducts: products.length
            };
            expectedFilePlan.totalFrames = computeExpectedFrames(expectedFilePlan.masterGroups);

            const actualFilePlan = filePlanService.buildFilePlan(filePlanRequest);

            expect(actualFilePlan.masterGroups.length).toEqual(1);
            expect(actualFilePlan.masterGroups[0].totalFrames).toEqual(expectedFilePlan.masterGroups[0].totalFrames);
            expect(actualFilePlan.masterGroups[0].products).toIncludeAllMembers(expectedFilePlan.masterGroups[0].products);
            expect(actualFilePlan.totalFrames).toEqual(expectedFilePlan.totalFrames);
        });

        it('should return two master groups', () => {
            labelsAcross = 4;

            const productA = {name: 'product-A', labelQuantity: 8000};
            const productB = {name: 'product-B', labelQuantity: 8000};
            const productC = {name: 'product-C', labelQuantity: 3000};

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
                        totalFrames: Math.ceil(productA.labelQuantity / 2 / labelsAround)
                    },
                    {
                        products: [
                            {
                                name: productC.name,
                                labelQuantity: productC.labelQuantity,
                                numberOfLanes: 4
                            }
                        ],
                        totalFrames: Math.ceil(productC.labelQuantity / 4 / labelsAround)
                    }
                ],
                numberOfMasterGroups: 2,
                totalProducts: products.length
            };
            expectedFilePlan.totalFrames = computeExpectedFrames(expectedFilePlan.masterGroups);

            const actualFilePlan = filePlanService.buildFilePlan(filePlanRequest);

            expect(actualFilePlan.masterGroups).toIncludeAllMembers(expectedFilePlan.masterGroups);
            expect(actualFilePlan.totalFrames).toEqual(expectedFilePlan.totalFrames);
        });

        it('should return many master groups with one product each', () => {
            labelsAcross = 4;

            const productA = {name: 'product-A', labelQuantity: 11030};
            const productB = {name: 'product-B', labelQuantity: 44510};
            const productC = {name: 'product-C', labelQuantity: 75290};

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
                        totalFrames: Math.ceil(productA.labelQuantity / 4 / labelsAround)
                    },
                    {
                        products: [
                            {
                                name: productB.name,
                                labelQuantity: productB.labelQuantity,
                                numberOfLanes: 4
                            }
                        ],
                        totalFrames: Math.ceil(productB.labelQuantity / 4 / labelsAround)
                    },
                    {
                        products: [
                            {
                                name: productC.name,
                                labelQuantity: productC.labelQuantity,
                                numberOfLanes: 4
                            }
                        ],
                        totalFrames: Math.ceil(productC.labelQuantity / 4 / labelsAround)
                    }
                ],
                numberOfMasterGroups: 3,
                totalProducts: products.length
            };
            expectedFilePlan.totalFrames = computeExpectedFrames(expectedFilePlan.masterGroups);

            const actualFilePlan = filePlanService.buildFilePlan(filePlanRequest);

            expect(actualFilePlan.masterGroups).toIncludeAllMembers(expectedFilePlan.masterGroups);
            expect(actualFilePlan.totalFrames).toEqual(expectedFilePlan.totalFrames);
        });

        it('should group products if it results in an acceptable number of wasted frames', () => {
            labelsAcross = 4;
            const labelQuanity = 1000;
            const maxAcceptableWastedFrames = 20;
            const numberOfLanesTakenByOneProduct = 1;
            const maxAcceptableWastedLabels = maxAcceptableWastedFrames * labelsAround * numberOfLanesTakenByOneProduct - 1;

            const productA = {name: 'product-A', labelQuantity: (labelQuanity + maxAcceptableWastedLabels)};
            const productB = {name: 'product-B', labelQuantity: labelQuanity};
            const productC = {name: 'product-C', labelQuantity: labelQuanity};
            const productD = {name: 'product-D', labelQuantity: labelQuanity};

            products = chance.shuffle([productA, productB, productC, productD]);
            filePlanRequest = filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround);

            const expectedFilePlan = {
                masterGroups: [
                    {
                        products: [
                            {
                                name: productA.name,
                                labelQuantity: productA.labelQuantity,
                                numberOfLanes: 1,
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
                            },
                            {
                                name: productD.name,
                                labelQuantity: productD.labelQuantity,
                                numberOfLanes: 1
                            }
                        ],
                        totalFrames: Math.ceil(productA.labelQuantity / 1 / labelsAround)
                    }
                ],
                numberOfMasterGroups: 1,
                totalProducts: products.length
            };
            expectedFilePlan.totalFrames = computeExpectedFrames(expectedFilePlan.masterGroups);

            const actualFilePlan = filePlanService.buildFilePlan(filePlanRequest);

            expect(actualFilePlan.masterGroups).toIncludeAllMembers(expectedFilePlan.masterGroups);
            expect(actualFilePlan.totalFrames).toEqual(expectedFilePlan.totalFrames);
        });

        it('should create master groups that minimize total number of frames in filePlan even if each master group results in wasted frames', () => {
            labelsAcross = 8;
            labelsAround = 12;

            const product1 = {name: 'product-1', labelQuantity: 600};
            const product2 = {name: 'product-2', labelQuantity: 2400};
            const product3 = {name: 'product-3', labelQuantity: 100};
            const product4 = {name: 'product-4', labelQuantity: 600};
            const product5 = {name: 'product-5', labelQuantity: 2400};
            const product6 = {name: 'product-6', labelQuantity: 200};

            products = chance.shuffle([product1, product2, product3, product4, product5, product6]);
            filePlanRequest = filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround);

            const expectedFilePlan = {
                masterGroups: [
                    {
                        products: [
                            {
                                name: product1.name,
                                labelQuantity: product1.labelQuantity,
                                numberOfLanes: 1
                            },
                            {
                                name: product4.name,
                                labelQuantity: product4.labelQuantity,
                                numberOfLanes: 1
                            },
                            {
                                name: product2.name,
                                labelQuantity: product2.labelQuantity,
                                numberOfLanes: 3,
                            },
                            {
                                name: product5.name,
                                labelQuantity: product5.labelQuantity,
                                numberOfLanes: 3
                            }
                        ],
                        totalFrames: Math.ceil(product2.labelQuantity / 3 / labelsAround)
                    },
                    {
                        products: [
                            {
                                name: product3.name,
                                labelQuantity: product3.labelQuantity,
                                numberOfLanes: 3,
                            },
                            {
                                name: product6.name,
                                labelQuantity: product6.labelQuantity,
                                numberOfLanes: 5
                            }
                        ],
                        totalFrames: Math.ceil(product6.labelQuantity / 5 / labelsAround)
                    },
                ],
                numberOfMasterGroups: 2,
                totalProducts: products.length
            };
            expectedFilePlan.totalFrames = computeExpectedFrames(expectedFilePlan.masterGroups);

            const actualFilePlan = filePlanService.buildFilePlan(filePlanRequest);

            expect(actualFilePlan).toEqual(expectedFilePlan);
        });
    });
});
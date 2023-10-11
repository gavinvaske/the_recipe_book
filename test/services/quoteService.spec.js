const constants = require('../../application/enums/constantsEnum');
const { createQuote } = require('../../application/services/quoteService');
const chance = require('chance').Chance();
const mongoose = require('mongoose');

jest.mock('../../application/models/die');

const DieMock = require('../../application/models/die');

const FEET_PER_ROLL = 5000;

function generateProduct() {
    return {
        productId: mongoose.Types.ObjectId(),
        labelQty: chance.d100()
    };
}

function generateNProducts() {
    const n = chance.d10();
    
    return chance.n(generateProduct, n);
}

function computeFrameLength(die, quoteAttributes) {
    const { sizeAroundOverride, spaceAroundOverride } = quoteAttributes;
    const sizeAround = sizeAroundOverride 
        ? sizeAroundOverride : die.sizeAround;
    const spaceAround = spaceAroundOverride
        ? spaceAroundOverride : die.spaceAround;

    return (sizeAround + spaceAround) * die.numberAround;
}

const INCHES_PER_FOOT = 12;

describe('File: quoteService.js', () => {
    let quoteInputAttributes, die;

    beforeEach(() => {
        die = {
            _id: mongoose.Types.ObjectId(),
            sizeAround: chance.d100(),
            spaceAround: chance.d100(),
            numberAround: chance.integer({ min: 1, max: 3})
        };

        DieMock.findById.mockResolvedValue(die);

        quoteInputAttributes = {
            die: die._id,
            labelQty: chance.integer({ min: 5000, max: 10000000}),
            products: generateNProducts()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Function: createQuote', () => {
        it('should query for the die when provided the dieId', async () => {
            const dieId = chance.string();
            quoteInputAttributes.die = dieId;

            createQuote(quoteInputAttributes);

            expect(DieMock.findById).toHaveBeenCalledTimes(1);
            expect(DieMock.findById).toHaveBeenCalledWith(dieId);
        });

        describe('attribute: initialStockLength', () => {
            it('should compute using sizeAroundOverride and spaceAroundOverride when defined', async () => {
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    sizeAroundOverride: chance.d100(),
                    spaceAroundOverride: chance.d100(),
                    labelQty: chance.d100()
                };
                const {sizeAroundOverride, spaceAroundOverride, labelQty } = quoteInputAttributes;
                const expectedValue = (((sizeAroundOverride + spaceAroundOverride) * labelQty) / die.numberAround) / INCHES_PER_FOOT;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.initialStockLength).toBeDefined();
                expect(quote.initialStockLength).toEqual(expectedValue);
            });

            it('should compute using die.sizeAround and die.spaceAround when sizeAroundOverride and spaceAroundOverride are not defined', async () => {
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    sizeAroundOverride: undefined,
                    spaceAroundOverride: undefined,
                    labelQty: chance.d100()
                };
                const { labelQty } = quoteInputAttributes;
                const { sizeAround, spaceAround } = die;
                const expectedValue = (((sizeAround + spaceAround) * labelQty) / die.numberAround) / INCHES_PER_FOOT;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.initialStockLength).toBeDefined();
                expect(quote.initialStockLength).toEqual(expectedValue);
            });
        });

        describe('attribute: printCleanerFeet', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const {
                    initialStockLength, colorCalibrationFeet, proofRunupFeet, 
                    dieCutterSetupFeet, scalingFeet, newMaterialSetupFeet 
                } = quote;
                const sum = initialStockLength + colorCalibrationFeet + proofRunupFeet + dieCutterSetupFeet + scalingFeet + newMaterialSetupFeet;
                const expectedValue = Math.ceil(sum / FEET_PER_ROLL) * constants.PRINT_CLEANER_FEET;

                expect(quote.printCleanerFeet).toBeDefined();
                expect(quote.printCleanerFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: colorCalibrationFeet', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.COLOR_CALIBRATION_FEET;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.colorCalibrationFeet).toBeDefined();
                expect(quote.colorCalibrationFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: proofRunupFeet', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.PROOF_RUNUP_FEET;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.proofRunupFeet).toBeDefined();
                expect(quote.proofRunupFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: scalingFeet', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.SCALING_FEET;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.scalingFeet).toBeDefined();
                expect(quote.scalingFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: newMaterialSetupFeet', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.NEWLY_LOADED_ROLL_WASTE_FEET;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.newMaterialSetupFeet).toBeDefined();
                expect(quote.newMaterialSetupFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: dieLineSetupFeet', () => {
            it('should compute attribute correctly when sizeAroundOverride and spaceAroundOverride are defined', async () => {
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    sizeAroundOverride: chance.d100(),
                    spaceAroundOverride: chance.d100()
                };
                const expectedFrameLength = computeFrameLength(die, quoteInputAttributes);
                const expectedValue = (expectedFrameLength * 2) / INCHES_PER_FOOT;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.dieLineSetupFeet).toBeDefined();
                expect(quote.dieLineSetupFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: totalStockFeet', () => {
            it('should compute attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const {
                    initialStockLength, colorCalibrationFeet, proofRunupFeet, dieCutterSetupFeet, 
                    printCleanerFeet, scalingFeet, newMaterialSetupFeet, dieLineSetupFeet
                } = quote;
                const expectedTotalStockFeet = 
                    initialStockLength + colorCalibrationFeet + proofRunupFeet + dieCutterSetupFeet 
                    + printCleanerFeet + scalingFeet + newMaterialSetupFeet + dieLineSetupFeet;
                
                expect(quote.totalStockFeet).toBeDefined();
                expect(quote.totalStockFeet).toEqual(expectedTotalStockFeet);
            });
        });

        describe('attribute: totalRollsOfPaper', () => {
            it('should be set to 0 if totalStockFeet is less than or equal to 5000 (FEET_PER_ROLL)', async () => {
                const numberThatShouldForceTotalStockFeetToBeLessThan5000 = chance.d10();
                quoteInputAttributes.labelQty = numberThatShouldForceTotalStockFeetToBeLessThan5000;

                const quote = await createQuote(quoteInputAttributes);

                const sanityCheck = quote.totalStockFeet <= FEET_PER_ROLL;
                
                expect(sanityCheck).toEqual(true);
                expect(quote.totalRollsOfPaper).toBeDefined();
                expect(quote.totalRollsOfPaper).toEqual(0);
            });

            it('should be computed correctly if totalStockFeet is greater than 5000 (FEET_PER_ROLL)', async () => {
                const bigInteger = 5000000;
                const numberThatShouldForceTotalStockFeetToBeGreaterThan5000 = chance.integer({ min: bigInteger });
                quoteInputAttributes.labelQty = numberThatShouldForceTotalStockFeetToBeGreaterThan5000;

                const quote = await createQuote(quoteInputAttributes);

                const expectedNumberOfRolls = Math.floor(quote.totalStockFeet / FEET_PER_ROLL) - 1;
                const sanityCheck = quote.totalStockFeet > FEET_PER_ROLL;
                
                expect(sanityCheck).toEqual(true);
                expect(quote.totalRollsOfPaper).toBeDefined();
                expect(quote.totalRollsOfPaper).toEqual(expectedNumberOfRolls);
            });
        });

        describe('attribute: throwAwayStockPercentage', () => {
            it('should compute attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { initialStockLength, totalStockFeet } = quote;

                const expectedValue = 1 - (initialStockLength / totalStockFeet);

                expect(quote.throwAwayStockPercentage).toBeDefined();
                expect(quote.throwAwayStockPercentage).toEqual(expectedValue);
            });
        });

        describe('attribute: stockSpliceTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.NEW_MATERIAL_STOCK_SPLICE;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.stockSpliceTime).toBeDefined();
                expect(quote.stockSpliceTime).toEqual(expectedValue);
            });
        });

        describe('attribute: colorCalibrationTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.COLOR_CALIBRATION_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.colorCalibrationTime).toBeDefined();
                expect(quote.colorCalibrationTime).toEqual(expectedValue);
            });
        });

        describe('attribute: reinsertionPrintingTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = 0;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.reinsertionPrintingTime).toBeDefined();
                expect(quote.reinsertionPrintingTime).toEqual(expectedValue);
            });
        });

        describe('attribute: printTearDownTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.PRINTING_TEAR_DOWN_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.printTearDownTime).toBeDefined();
                expect(quote.printTearDownTime).toEqual(expectedValue);
            });
        });

        describe('attribute: cuttingStockSpliceCost', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.CUTTING_STOCK_SPLICE;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.cuttingStockSpliceCost).toBeDefined();
                expect(quote.cuttingStockSpliceCost).toEqual(expectedValue);
            });
        });

        describe('attribute: dieSetupTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.DIE_SETUP;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.dieSetupTime).toBeDefined();
                expect(quote.dieSetupTime).toEqual(expectedValue);
            });
        });

        describe('attribute: sheetedSetupTime', () => {
            it('should set attribute to a constant value if "isSheeted" is TRUE', async () => {
                quoteInputAttributes.isSheeted = true;
                const expectedValue = constants.SHEETED_SETUP_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.sheetedSetupTime).toBeDefined();
                expect(quote.sheetedSetupTime).toEqual(expectedValue);
            });

            it('should set attribute to ZERO if "isSheeted" is FALSE', async () => {
                quoteInputAttributes.isSheeted = false;
                const expectedValue = 0;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.sheetedSetupTime).toBeDefined();
                expect(quote.sheetedSetupTime).toEqual(expectedValue);
            });
        });

        describe('attribute: cuttingTearDownTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.CUTTING_TEAR_DOWN_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.cuttingTearDownTime).toBeDefined();
                expect(quote.cuttingTearDownTime).toEqual(expectedValue);
            });
        });

        describe('attribute: sheetedTearDownTime', () => {
            it('should set attribute to a constant value if "isSheeted" is TRUE', async () => {
                quoteInputAttributes.isSheeted = true;
                const expectedValue = constants.SHEETED_TEAR_DOWN_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.sheetedTearDownTime).toBeDefined();
                expect(quote.sheetedTearDownTime).toEqual(expectedValue);
            });

            it('should set attribute to ZERO if "isSheeted" is FALSY', async () => {
                delete quoteInputAttributes.isSheeted;
                const expectedValue = 0;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.sheetedTearDownTime).toBeDefined();
                expect(quote.sheetedTearDownTime).toEqual(expectedValue);
            });
        });

        describe('attribute: coreGatheringTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.CORE_GATHERING_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.coreGatheringTime).toBeDefined();
                expect(quote.coreGatheringTime).toEqual(expectedValue);
            });
        });

        describe('attribute: labelDropoffAtShippingTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.LABEL_DROP_OFF_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.labelDropoffAtShippingTime).toBeDefined();
                expect(quote.labelDropoffAtShippingTime).toEqual(expectedValue);
            });
        });

        describe('attribute: packingSlipsTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.PACKING_SLIP_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.packingSlipsTime).toBeDefined();
                expect(quote.packingSlipsTime).toEqual(expectedValue);
            });
        });

        describe('attribute: dieCutterSetupFeet', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.DIE_CUTTER_SETUP_FEET;

                const quote = await createQuote(quoteInputAttributes);

                expect(quote.dieCutterSetupFeet).toBeDefined();
                expect(quote.dieCutterSetupFeet).toEqual(expectedValue);
            });
        });

        /* * Job Variables * */
        describe('attribute: frameLength', () => {
            it('should compute using sizeAroundOverride and spaceAroundOverride when defined', async () => {
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    sizeAroundOverride: chance.d100(),
                    spaceAroundOverride: chance.d100()
                };
                const expectedValue = computeFrameLength(die, quoteInputAttributes);
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.frameLength).toBeDefined();
                expect(quote.frameLength).toEqual(expectedValue);
            });

            it('should compute using die.sizeAround and die.spaceAround when sizeAroundOverride and spaceAroundOverride are undefined', async () => {
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    sizeAroundOverride: undefined,
                    spaceAroundOverride: undefined
                };
                const expectedValue = computeFrameLength(die, quoteInputAttributes);
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.frameLength).toBeDefined();
                expect(quote.frameLength).toEqual(expectedValue);
            });
        });
    });
});
const constants = require('../../application/enums/constantsEnum');
const { createQuote } = require('../../application/services/quoteService');
const chance = require('chance').Chance();
const mongoose = require('mongoose');

jest.mock('../../application/models/die');
jest.mock('../../application/models/material');
jest.mock('../../application/models/finish');

const DieMock = require('../../application/models/die');
const MaterialMock = require('../../application/models/material');
const FinishMock = require('../../application/models/finish');

const FEET_PER_ROLL = 5000;
const ONE_THOUSAND = 1000;
const FOUR = 4;
const MINUTES_PER_HOUR = 60;

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

function getExpectedPrintingSpeed(numberOfColors, sizeAround, spaceAround) {
    const unroundedPrintingSpeed = 60 / ((numberOfColors * 0.49) * (12 / (sizeAround + spaceAround))); // eslint-disable-line no-magic-numbers

    return Math.round(unroundedPrintingSpeed);
}

const INCHES_PER_FOOT = 12;

describe('File: quoteService.js', () => {
    let quoteInputAttributes, die, material, finish;

    beforeEach(() => {
        die = {
            _id: mongoose.Types.ObjectId(),
            sizeAcross: chance.d100(),
            sizeAround: chance.d100(),
            spaceAround: chance.d100(),
            numberAround: chance.integer({ min: 1, max: 3})
        };
        material = {
            _id: mongoose.Types.ObjectId(),
            quotePrice: chance.d100()
        };
        finish = {
            _id: mongoose.Types.ObjectId(),
            quotePrice: chance.d100()
        };

        DieMock.findById.mockResolvedValue(die);
        MaterialMock.findById.mockResolvedValue(material);
        FinishMock.findById.mockResolvedValue(finish);

        quoteInputAttributes = {
            material: material._id,
            die: die._id,
            finish: finish._id,
            labelQty: chance.integer({ min: 5000, max: 10000000}),
            labelsPerRoll: chance.integer({ min: 1, max: 1000000}),
            products: generateNProducts(),
            numberOfColors: chance.d100(),
            numberOfColors: chance.d10(),
            numberOfDesigns: chance.d10()
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
                
                expect(quote.initialStockLength).not.toBeFalsy();
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
                
                expect(quote.initialStockLength).not.toBeFalsy();
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

                expect(quote.printCleanerFeet).not.toBeFalsy();
                expect(quote.printCleanerFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: colorCalibrationFeet', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.COLOR_CALIBRATION_FEET;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.colorCalibrationFeet).not.toBeFalsy();
                expect(quote.colorCalibrationFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: proofRunupFeet', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.PROOF_RUNUP_FEET;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.proofRunupFeet).not.toBeFalsy();
                expect(quote.proofRunupFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: scalingFeet', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.SCALING_FEET;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.scalingFeet).not.toBeFalsy();
                expect(quote.scalingFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: newMaterialSetupFeet', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.NEWLY_LOADED_ROLL_WASTE_FEET;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.newMaterialSetupFeet).not.toBeFalsy();
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
                
                expect(quote.dieLineSetupFeet).not.toBeFalsy();
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
                
                expect(quote.totalStockFeet).not.toBeFalsy();
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
                const bigInteger = 500000;
                const numberThatShouldForceTotalStockFeetToBeGreaterThan5000 = chance.integer({ min: bigInteger });
                quoteInputAttributes.labelQty = numberThatShouldForceTotalStockFeetToBeGreaterThan5000;

                const quote = await createQuote(quoteInputAttributes);

                const expectedNumberOfRolls = Math.floor(quote.totalStockFeet / FEET_PER_ROLL) - 1;
                const sanityCheck = quote.totalStockFeet > FEET_PER_ROLL;
                
                expect(sanityCheck).toEqual(true);
                expect(quote.totalRollsOfPaper).not.toBeFalsy();
                expect(quote.totalRollsOfPaper).toEqual(expectedNumberOfRolls);
            });
        });

        describe('attribute: throwAwayStockPercentage', () => {
            it('should compute attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { initialStockLength, totalStockFeet } = quote;

                const expectedValue = 1 - (initialStockLength / totalStockFeet);

                expect(quote.throwAwayStockPercentage).not.toBeFalsy();
                expect(quote.throwAwayStockPercentage).toEqual(expectedValue);
            });
        });

        describe('attribute: totalStockMsi', () => {
            it('should compute attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalStockFeet } = quote;

                const expectedValue = (totalStockFeet * constants.MAX_MATERIAL_SIZE_ACROSS * INCHES_PER_FOOT) / ONE_THOUSAND;
            
                expect(quote.totalStockMsi).not.toBeFalsy();
                expect(quote.totalStockMsi).toEqual(expectedValue);
            });
        });

        describe('attribute: totalFinishFeet', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { dieCutterSetupFeet, printCleanerFeet, dieLineSetupFeet } = quote;

                const expectedValue = printCleanerFeet + dieCutterSetupFeet + dieLineSetupFeet;

                expect(quote.totalFinishFeet).not.toBeFalsy();
                expect(quote.totalFinishFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: totalFinishMsi', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalFinishFeet } = quote;
                
                const expectedValue = (totalFinishFeet * constants.MAX_MATERIAL_SIZE_ACROSS * INCHES_PER_FOOT) / ONE_THOUSAND;

                expect(quote.totalFinishMsi).not.toBeFalsy();
                expect(quote.totalFinishMsi).toEqual(expectedValue);
            });
        });

        describe('attribute: totalCoreCost', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalFinishedRolls } = quote;

                const expectedValue = totalFinishedRolls * constants.PER_CORE_COST;

                expect(quote.totalCoreCost).not.toBeFalsy();
                expect(quote.totalCoreCost).toEqual(expectedValue);
            });
        });

        describe('attribute: inlinePrimingCost', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalStockMsi } = quote;

                const expectedValue = totalStockMsi * constants.INLINE_PRIMING_COST;

                expect(quote.inlinePrimingCost).not.toBeFalsy();
                expect(quote.inlinePrimingCost).toEqual(expectedValue);
            });
        });

        describe('attribute: scalingClickCost', () => {
            it('should be computed correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { numberOfColors } = quote;
                const { SCALING_CLICKS, COST_PER_COLOR } = constants;
                
                const expectedValue = SCALING_CLICKS * numberOfColors * 2 * COST_PER_COLOR;

                expect(quote.scalingClickCost).not.toBeFalsy();
                expect(quote.scalingClickCost).toEqual(expectedValue);
            });
        });

        describe('attribute: proofRunupClickCost', () => {
            it('should be computed correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { numberOfColors, numberOfDesigns } = quote;
                
                const expectedValue = constants.COST_PER_COLOR * numberOfColors * 2 * numberOfDesigns;

                expect(quote.proofRunupClickCost).not.toBeFalsy();
                expect(quote.proofRunupClickCost).toEqual(expectedValue);
            });
        });

        describe('attribute: printCleanerClickCost', () => {
            it('should be computed correctly (when totalStockFeet < 5000)', async () => {
                const numberThatShouldForceTotalStockFeetToBeLessThan5000 = 6;
                quoteInputAttributes.labelQty = numberThatShouldForceTotalStockFeetToBeLessThan5000;
            
                const quote = await createQuote(quoteInputAttributes);
                const { PRINT_CLEANER_FRAME, COST_PER_COLOR } = constants;

                const expectedValue = PRINT_CLEANER_FRAME * COST_PER_COLOR * FOUR;
                const sanityCheck = quote.totalStockFeet < FEET_PER_ROLL;

                expect(sanityCheck).toEqual(true);
                expect(quote.printCleanerClickCost).not.toBeFalsy();
                expect(quote.printCleanerClickCost).toEqual(expectedValue);
            });

            it('should be computed correctly (when totalStockFeet >= 5000)', async () => {
                const bigInteger = 500000;
                const numberThatShouldForceTotalStockFeetToBeGreaterThan5000 = chance.integer({ min: bigInteger });

                quoteInputAttributes.labelQty = numberThatShouldForceTotalStockFeetToBeGreaterThan5000;
            
                const quote = await createQuote(quoteInputAttributes);
                const { PRINT_CLEANER_FRAME, COST_PER_COLOR } = constants;

                const scalar = Math.floor(quote.totalStockFeet / FEET_PER_ROLL);
                const expectedValue = scalar * PRINT_CLEANER_FRAME * COST_PER_COLOR * FOUR;
                const sanityCheck = quote.totalStockFeet > FEET_PER_ROLL;

                expect(sanityCheck).toEqual(true);
                expect(quote.printCleanerClickCost).not.toBeFalsy();
                expect(quote.printCleanerClickCost.toFixed(2)).toEqual(expectedValue.toFixed(2));
            });
        });

        describe('attribute: proofPrintingTime', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { numberOfDesigns } = quote;

                const expectedValue = numberOfDesigns * constants.PRINTING_PROOF_TIME;

                expect(quote.proofPrintingTime).not.toBeFalsy();
                expect(quote.proofPrintingTime).toEqual(expectedValue);
            });
        });

        describe('attribute: rollChangeOverTime', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalRollsOfPaper } = quote;

                const expectedValue = totalRollsOfPaper * constants.PRINTING_ROLL_CHANGE_OVER_TIME;

                expect(quote.rollChangeOverTime).not.toBeFalsy();
                expect(quote.rollChangeOverTime).toEqual(expectedValue);
            });
        });

        describe('attribute: finishedRollLength', () => {
            describe('When quote.labelQty >= quote.labelsPerRoll', () => {
                beforeEach(() => {
                    const labelsPerRoll = chance.d100();
                    const labelQty = chance.pickone([labelsPerRoll, labelsPerRoll + 1]);
                    quoteInputAttributes = {
                        ...quoteInputAttributes,
                        labelsPerRoll,
                        labelQty
                    };
                });
                it('should compute the attribute correctly when sizeAcrossOverride and spaceAroundOverride ARE defined', async () => {
                    const sizeAcrossOverride = chance.d100();
                    const spaceAroundOverride = chance.d100();
                    quoteInputAttributes = {
                        ...quoteInputAttributes,
                        sizeAcrossOverride,
                        spaceAroundOverride
                    };
                    const quote = await createQuote(quoteInputAttributes);
                    const { labelsPerRoll } = quote;
    
                    const expectedValue = ((sizeAcrossOverride + spaceAroundOverride) * labelsPerRoll) / INCHES_PER_FOOT;

                    expect(quote.finishedRollLength).not.toBeFalsy();
                    expect(quote.finishedRollLength).toEqual(expectedValue);
                });

                it('should compute the attribute correctly when sizeAcrossOverride and spaceAroundOverride ARE NOT defined', async () => {
                    delete quoteInputAttributes.sizeAcrossOverride;
                    delete quoteInputAttributes.spaceAroundOverride;
                    const quote = await createQuote(quoteInputAttributes);
                    const { labelsPerRoll } = quote;
    
                    const expectedValue = ((die.sizeAcross + die.spaceAround) * labelsPerRoll) / INCHES_PER_FOOT;
                
                    expect(quote.finishedRollLength).not.toBeFalsy();
                    expect(quote.finishedRollLength).toEqual(expectedValue);
                });
            });
            describe('When quote.labelQty < quote.labelsPerRoll', () => {
                beforeEach(() => {
                    const labelsPerRoll = chance.d100();
                    const labelQty = labelsPerRoll - 1;
                    quoteInputAttributes = {
                        ...quoteInputAttributes,
                        labelsPerRoll,
                        labelQty
                    };
                });

                it('should compute the attribute correctly when sizeAcrossOverride and spaceAroundOverride ARE defined', async () => {
                    const sizeAcrossOverride = chance.d100();
                    const spaceAroundOverride = chance.d100();
                    quoteInputAttributes = {
                        ...quoteInputAttributes,
                        sizeAcrossOverride,
                        spaceAroundOverride
                    };
                    const quote = await createQuote(quoteInputAttributes);
                    const { labelQty } = quote;

                    const expectedValue = ((sizeAcrossOverride + spaceAroundOverride) * labelQty) / INCHES_PER_FOOT;

                    expect(quote.finishedRollLength).not.toBeFalsy();
                    expect(quote.finishedRollLength).toEqual(expectedValue);
                });

                it('should compute the attribute correctly when sizeAcrossOverride and spaceAroundOverride ARE NOT defined', async () => {
                    delete quoteInputAttributes.sizeAcrossOverride;
                    delete quoteInputAttributes.spaceAroundOverride;
                    const quote = await createQuote(quoteInputAttributes);
                    const { labelQty } = quote;

                    const expectedValue = ((die.sizeAcross + die.spaceAround) * labelQty) / INCHES_PER_FOOT;

                    expect(quote.finishedRollLength).not.toBeFalsy();
                    expect(quote.finishedRollLength).toEqual(expectedValue);
                });
            });
        });

        describe('attribute: printingStockTime', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalStockFeet, printingSpeed } = quote;

                const expectedValue = Math.ceil(totalStockFeet * printingSpeed);

                expect(quote.printingStockTime).not.toBeFalsy();
                expect(quote.printingStockTime).toEqual(expectedValue);
            });
        });

        describe('attribute: stockSpliceTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.NEW_MATERIAL_STOCK_SPLICE;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.stockSpliceTime).not.toBeFalsy();
                expect(quote.stockSpliceTime).toEqual(expectedValue);
            });
        });

        describe('attribute: totalTimeAtPrinting', () => {
            it('should compute the attribute correctly', async () => {
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    isSheeted: true
                };
                const quote = await createQuote(quoteInputAttributes);
                const { stockSpliceTime, colorCalibrationTime, proofPrintingTime, reinsertionPrintingTime, printTearDownTime } = quote;
            
                const expectedValue = stockSpliceTime + colorCalibrationTime + proofPrintingTime 
                    + reinsertionPrintingTime + printTearDownTime;

                expect(quote.totalTimeAtPrinting).not.toBeFalsy();
                expect(quote.totalTimeAtPrinting).toEqual(expectedValue);
            });
        });

        describe('attribute: throwAwayStockTimePercentage', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalTimeAtPrinting, printingStockTime } = quote;
                const expectedValue = 1 - (printingStockTime / totalTimeAtPrinting);

                expect(quote.throwAwayStockTimePercentage).not.toBeFalsy();
                expect(quote.throwAwayStockTimePercentage).toEqual(expectedValue);
            });
        });

        describe('attribute: totalPrintingCost', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalTimeAtPrinting } = quote;
                
                const expectedValue = (totalTimeAtPrinting / MINUTES_PER_HOUR) * constants.PRINTING_HOURLY_RATE;
            
                expect(quote.totalPrintingCost).not.toBeFalsy();
                expect(quote.totalPrintingCost).toEqual(expectedValue);
            });
        });

        describe('attribute: totalTimeAtCutting', () => {
            it('should be computed correctly', async () => {
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    isSheeted: true
                };
                const quote = await createQuote(quoteInputAttributes);
                const { 
                    cuttingStockSpliceTime, dieSetupTime, sheetedSetupTime,
                    cuttingStockTime, cuttingTearDownTime, sheetedTearDownTime
                } = quote;

                const expectedValue = cuttingStockSpliceTime + dieSetupTime + sheetedSetupTime + cuttingStockTime + cuttingTearDownTime + sheetedTearDownTime;

                expect(quote.totalTimeAtCutting).not.toBeFalsy();
                expect(quote.totalTimeAtCutting).toEqual(expectedValue);
            });
        });

        describe('attribute: totalCuttingCost', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalTimeAtCutting } = quote;

                const expectedValue = (totalTimeAtCutting / MINUTES_PER_HOUR) * constants.CUTTING_HOURLY_RATE;
                
                expect(quote.totalCuttingCost).not.toBeFalsy();
                expect(quote.totalCuttingCost).toEqual(expectedValue);
            });
        });

        describe('attribute: throwAwayCuttingTimePercentage', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { cuttingStockTime, totalTimeAtCutting } = quote;

                const expectedValue = 1 - (cuttingStockTime / totalTimeAtCutting);

                expect(quote.throwAwayCuttingTimePercentage).not.toBeFalsy();
                expect(quote.throwAwayCuttingTimePercentage).toEqual(expectedValue);
            });
        });

        describe('attribute: changeOverTime', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);

                const expectedValue = quote.totalFinishedRolls * constants.REWINDING_CHANGE_OVER_MINUTES;

                expect(quote.changeOverTime).not.toBeFalsy();
                expect(quote.changeOverTime).toEqual(expectedValue);
            });
        });

        describe('attribute: totalWindingRollTime', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalFinishedRolls, finishedRollLength } = quote;
    
                const expectedValue = totalFinishedRolls * (finishedRollLength / constants.REWIND_SPEED);
    
                expect(quote.totalWindingRollTime).not.toBeFalsy();
                expect(quote.totalWindingRollTime).toEqual(expectedValue);
            });
        });

        describe('attribute: totalWindingTime', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { coreGatheringTime, changeOverTime, totalWindingRollTime, labelDropoffAtShippingTime } = quote;

                const expectedValue = coreGatheringTime + changeOverTime + totalWindingRollTime + labelDropoffAtShippingTime;

                expect(quote.totalWindingTime).not.toBeFalsy();
                expect(quote.totalWindingTime).toEqual(expectedValue);
            });
        });

        describe('attribute: throwAwayWindingTimePercentage', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalWindingRollTime, totalWindingTime } = quote;

                const expectedValue = 1 - (totalWindingRollTime / totalWindingTime);

                expect(quote.throwAwayWindingTimePercentage).not.toBeFalsy();
                expect(quote.throwAwayWindingTimePercentage).toEqual(expectedValue);
            });
        });

        describe('attribute: totalWindingCost', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalWindingTime } = quote;

                const expectedValue = (totalWindingTime / MINUTES_PER_HOUR) * constants.WINDING_HOURLY_RATE;

                expect(quote.totalWindingCost).not.toBeFalsy();
                expect(quote.totalWindingCost).toEqual(expectedValue);
            });
        });

        describe('attribute: totalFinishCost', () => {
            it('should compute the attribute correctly when overrideFinishCostMsi IS DEFINED', async () => {
                const overrideFinishCostMsi = chance.d100();
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    overrideFinishCostMsi: overrideFinishCostMsi
                };
                const quote = await createQuote(quoteInputAttributes);
                const { totalFinishMsi } = quote;

                const expectedValue = overrideFinishCostMsi * totalFinishMsi;

                expect(quote.totalFinishCost).not.toBeFalsy();
                expect(quote.totalFinishCost).toEqual(expectedValue);
            });

            it('should compute the attribute correctly when overrideFinishCostMsi IS UNDEFINED', async () => {
                delete quoteInputAttributes.overrideFinishCostMsi;
                const quote = await createQuote(quoteInputAttributes);
                const { totalFinishMsi } = quote;

                const expectedValue = totalFinishMsi * finish.quotePrice;

                expect(quote.totalFinishCost).not.toBeFalsy();
                expect(quote.totalFinishCost).toEqual(expectedValue);
            });
        });

        describe('attribute: colorCalibrationTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.COLOR_CALIBRATION_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.colorCalibrationTime).not.toBeFalsy();
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
                
                expect(quote.printTearDownTime).not.toBeFalsy();
                expect(quote.printTearDownTime).toEqual(expectedValue);
            });
        });

        describe('attribute: cuttingStockSpliceTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.CUTTING_STOCK_SPLICE_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.cuttingStockSpliceTime).not.toBeFalsy();
                expect(quote.cuttingStockSpliceTime).toEqual(expectedValue);
            });
        });

        describe('attribute: dieSetupTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.DIE_SETUP;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.dieSetupTime).not.toBeFalsy();
                expect(quote.dieSetupTime).toEqual(expectedValue);
            });
        });

        describe('attribute: sheetedSetupTime', () => {
            it('should set attribute to a constant value if "isSheeted" is TRUE', async () => {
                quoteInputAttributes.isSheeted = true;
                const expectedValue = constants.SHEETED_SETUP_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.sheetedSetupTime).not.toBeFalsy();
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
                
                expect(quote.cuttingTearDownTime).not.toBeFalsy();
                expect(quote.cuttingTearDownTime).toEqual(expectedValue);
            });
        });

        describe('attribute: sheetedTearDownTime', () => {
            it('should set attribute to a constant value if "isSheeted" is TRUE', async () => {
                quoteInputAttributes.isSheeted = true;
                const expectedValue = constants.SHEETED_TEAR_DOWN_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.sheetedTearDownTime).not.toBeFalsy();
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
                
                expect(quote.coreGatheringTime).not.toBeFalsy();
                expect(quote.coreGatheringTime).toEqual(expectedValue);
            });
        });

        describe('attribute: labelDropoffAtShippingTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.LABEL_DROP_OFF_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.labelDropoffAtShippingTime).not.toBeFalsy();
                expect(quote.labelDropoffAtShippingTime).toEqual(expectedValue);
            });
        });

        describe('attribute: packingSlipsTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.PACKING_SLIP_TIME;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.packingSlipsTime).not.toBeFalsy();
                expect(quote.packingSlipsTime).toEqual(expectedValue);
            });
        });

        describe('attribute: dieCutterSetupFeet', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.DIE_CUTTER_SETUP_FEET;

                const quote = await createQuote(quoteInputAttributes);

                expect(quote.dieCutterSetupFeet).not.toBeFalsy();
                expect(quote.dieCutterSetupFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: extraFrames', () => {
            it('should default the attribute to equal 25, until we create an algorithm to calculate it dynamically', async () => {
                const expectedDefaultValue = 25;
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.extraFrames).not.toBeFalsy();
                expect(quote.extraFrames).toEqual(expectedDefaultValue);
            });
        });

        describe('attribute: totalFrames', () => {
            it('should be calculated correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalStockFeet, frameLength } = quote;

                const expectedValue = Math.ceil((totalStockFeet / frameLength) * INCHES_PER_FOOT);

                expect(quote.totalFrames).not.toBeFalsy();
                expect(quote.totalFrames).toEqual(expectedValue);
            });
        });

        describe('attribute: totalStockCost', () => {
            it('should be overridable by the user', async () => {
                const overrideMaterialQuotedMsi = chance.d100();
                quoteInputAttributes.overrideMaterialQuotedMsi = overrideMaterialQuotedMsi;
                const quote = await createQuote(quoteInputAttributes);
                const { totalStockMsi } = quote;

                const expectedValue = totalStockMsi * overrideMaterialQuotedMsi;

                expect(quote.totalStockCost).not.toBeFalsy();
                expect(quote.totalStockCost).toEqual(expectedValue);
            });

            it('should be calculated correctly when overrideMaterialQuotedMsi is not defined', async () => {
                delete quoteInputAttributes.overrideMaterialQuotedMsi;
                const quote = await createQuote(quoteInputAttributes);
                const { totalStockMsi } = quote;

                const expectedValue = totalStockMsi * material.quotePrice;

                expect(quote.totalStockCost).not.toBeFalsy();
                expect(quote.totalStockCost).toEqual(expectedValue);
            });
        });

        describe('attribute: cuttingStockTime', () => {
            it('should be defined', async () => {
                const quote = await createQuote(quoteInputAttributes);

                expect(quote.cuttingStockTime).toBeDefined();
            });
        });

        /* * Job Variables * */
        describe('attribute: printingSpeed', () => {
            it('should be calculated correctly when sizeAroundOverride and spaceAroundOverride are defined', async () => {
                quoteInputAttributes.sizeAroundOverride = chance.d100();
                quoteInputAttributes.spaceAroundOverride = chance.d100();
                const quote = await createQuote(quoteInputAttributes);
                const { numberOfColors, sizeAroundOverride, spaceAroundOverride} = quote;

                const expectedValue = getExpectedPrintingSpeed(
                    numberOfColors,
                    sizeAroundOverride,
                    spaceAroundOverride
                );
                
                expect(quote.printingSpeed).not.toBeFalsy();
                expect(quote.printingSpeed).toEqual(expectedValue);
            });

            it('should be calculated correctly when sizeAroundOverride and spaceAroundOverride are NOT defined', async () => {
                delete quoteInputAttributes.sizeAroundOverride;
                delete quoteInputAttributes.spaceAroundOverride;
                const quote = await createQuote(quoteInputAttributes);
                const { numberOfColors } = quote;
    
                const expectedValue = getExpectedPrintingSpeed(
                    numberOfColors,
                    die.sizeAround,
                    die.spaceAround
                );
                
                expect(quote.printingSpeed).not.toBeFalsy();
                expect(quote.printingSpeed).toEqual(expectedValue);
            });
        });

        describe('attribute: totalFinishedRolls', () => {
            it('should be calculated correctly when: labelQty / labelsPerRoll > 1', async () => {
                const bigNumber = 1000000000;
                const smallNumber = chance.d10();
                quoteInputAttributes.labelQty = bigNumber;
                quoteInputAttributes.labelsPerRoll = smallNumber;
                const quote = await createQuote(quoteInputAttributes);
                const { labelQty, labelsPerRoll } = quote;

                const expectedValue = Math.ceil(labelQty / labelsPerRoll);
                
                expect(quote.totalFinishedRolls).not.toBeFalsy();
                expect(quote.totalFinishedRolls).toEqual(expectedValue);
            });

            it('should be calculated correctly when: labelQty / labelsPerRoll > 0 && labelQty / labelsPerRoll <= 1', async () => {
                const bigNumber = 1000000000;
                const smallNumber = chance.d10();
                quoteInputAttributes.labelQty = smallNumber;
                quoteInputAttributes.labelsPerRoll = bigNumber;

                const quote = await createQuote(quoteInputAttributes);

                const expectedValue = 1;
                
                expect(quote.totalFinishedRolls).not.toBeFalsy();
                expect(quote.totalFinishedRolls).toEqual(expectedValue);
            });
        });

        describe('attribute: frameLength', () => {
            it('should compute using sizeAroundOverride and spaceAroundOverride when defined', async () => {
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    sizeAroundOverride: chance.d100(),
                    spaceAroundOverride: chance.d100()
                };
                const expectedValue = computeFrameLength(die, quoteInputAttributes);
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.frameLength).not.toBeFalsy();
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
                
                expect(quote.frameLength).not.toBeFalsy();
                expect(quote.frameLength).toEqual(expectedValue);
            });
        });
    });
});
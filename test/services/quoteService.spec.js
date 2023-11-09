/* eslint-disable no-magic-numbers */
const constants = require('../../application/enums/constantsEnum');
const { createQuote } = require('../../application/services/quoteService');
const chance = require('chance').Chance();
const mongoose = require('mongoose');
const { when } = require('jest-when');

jest.mock('../../application/models/die');
jest.mock('../../application/models/material');
jest.mock('../../application/models/finish');
jest.mock('../../application/models/baseProduct');

const DieMock = require('../../application/models/die');
const MaterialMock = require('../../application/models/material');
const FinishMock = require('../../application/models/finish');
const BaseProductMock = require('../../application/models/baseProduct');

const FEET_PER_ROLL = 5000;
const ONE_THOUSAND = 1000;
const FOUR = 4;
const MINUTES_PER_HOUR = 60;

const THREE_DECIMAL_PLACES = 3;

function generateProduct(mongooseProductId) {
    return {
        productId: mongooseProductId,
        labelQty: chance.d100()
    };
}

function generateMaterial() {
    return {
        _id: mongoose.Types.ObjectId(),
        quotePrice: chance.d100(),
        thickness: chance.integer({ min: 1, max: 2}),
        costPerMsi: chance.d100()
    };
}

function generateFinish() {
    return {
        _id: mongoose.Types.ObjectId(),
        quotePrice: chance.d100(),
        thickness: chance.integer({ min: 1, max: 2}),
        costPerMsi: chance.d100()
    };
}

function generateDie() {
    return {
        _id: mongoose.Types.ObjectId(),
        sizeAcross: 1,
        sizeAround: chance.d6(),
        spaceAround: chance.d6(),
        numberAround: chance.d12()
    };
}

function computeFrameLength(die) {
    const { sizeAround, spaceAround, numberAround } = die;

    return (sizeAround + spaceAround) * numberAround;
}

function getExpectedPrintingSpeed(numberOfColors, die) {
    const { sizeAround, spaceAround } = die;
    const unroundedPrintingSpeed = 60 / ((numberOfColors * 0.49) * (12 / (sizeAround + spaceAround))); // eslint-disable-line no-magic-numbers

    return Math.round(unroundedPrintingSpeed);
}

const INCHES_PER_FOOT = 12;

describe('File: quoteService.js', () => {
    let quoteInputAttributes, die, primaryMaterial, secondaryMaterial, finish, baseProduct;

    beforeEach(() => {
        die = generateDie();
        primaryMaterial = generateMaterial();
        secondaryMaterial = generateMaterial();
        finish = generateFinish();
        baseProduct = {
            _id: mongoose.Types.ObjectId(),
            die: die._id,
            primaryMaterial: primaryMaterial._id,
            secondaryMaterial: secondaryMaterial._id,
            finish: finish._id,
            labelsPerRoll: chance.integer({ min: 1, max: 1000 }),
            numberOfColors: chance.integer({ min: 1, max: 12 })
        };

        when(DieMock.findById)
            .calledWith(die._id)
            .mockResolvedValue(die);
        when(FinishMock.findById)
            .calledWith(finish._id)
            .mockResolvedValue(finish);
        when(BaseProductMock.findById)
            .calledWith(baseProduct._id)
            .mockResolvedValue(baseProduct);
        when(MaterialMock.findById)
            .calledWith(primaryMaterial._id)
            .mockResolvedValue(primaryMaterial);
        when(MaterialMock.findById)
            .calledWith(secondaryMaterial._id)
            .mockResolvedValue(secondaryMaterial);

        quoteInputAttributes = {
            labelQty: chance.integer({ min: 100, max: 1000}),
            products: [generateProduct(baseProduct._id)]
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Function: createQuote', () => {
        describe('attribute: initialStockLength', () => {
            it('should compute using dieOverride.sizeAround and dieOverride.spaceAround when defined', async () => {
                const dieOverride = generateDie();
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    dieOverride
                };
                const { labelQty } = quoteInputAttributes;
                const expectedValue = (((dieOverride.sizeAround + dieOverride.spaceAround) * labelQty) / dieOverride.numberAround) / INCHES_PER_FOOT;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.initialStockLength).not.toBeFalsy();
                expect(quote.initialStockLength).toEqual(expectedValue);
            });

            it('should compute using die.sizeAround and die.spaceAround when dieOverride not defined', async () => {
                delete quoteInputAttributes.dieOverride;
                quoteInputAttributes = {
                    ...quoteInputAttributes,
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
                expect(quote.printCleanerFeet).toBeCloseTo(expectedValue, 2);
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
                const dieOverride = generateDie();
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    dieOverride
                };
                const expectedFrameLength = computeFrameLength(dieOverride);
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
                const bigInteger = 9950000;
                const numberThatShouldForceTotalStockFeetToBeGreaterThan5000 = bigInteger;
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
                expect(quote.throwAwayStockPercentage).toBeCloseTo(expectedValue, 2);
            });
        });

        describe('attribute: totalStockMsi', () => {
            it('should compute attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalStockFeet } = quote;

                const expectedValue = (totalStockFeet * constants.MAX_MATERIAL_SIZE_ACROSS * INCHES_PER_FOOT) / ONE_THOUSAND;
            
                expect(quote.totalStockMsi).not.toBeFalsy();
                expect(quote.totalStockMsi).toBeCloseTo(expectedValue, 2);
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
                expect(quote.totalFinishMsi).toBeCloseTo(expectedValue, 2);
            });
        });

        describe('attribute: totalCoreCost', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalFinishedRolls } = quote;

                const expectedValue = totalFinishedRolls * constants.PER_CORE_COST;

                expect(quote.totalCoreCost).not.toBeFalsy();
                expect(quote.totalCoreCost).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: inlinePrimingCost', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalStockMsi } = quote;

                const expectedValue = totalStockMsi * constants.INLINE_PRIMING_COST;

                expect(quote.inlinePrimingCost).not.toBeFalsy();
                expect(quote.inlinePrimingCost).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: scalingClickCost', () => {
            it('should be computed correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { SCALING_CLICKS, COST_PER_COLOR } = constants;
                
                const expectedValue = SCALING_CLICKS * baseProduct.numberOfColors * 2 * COST_PER_COLOR;

                expect(quote.scalingClickCost).not.toBeFalsy();
                expect(quote.scalingClickCost).toBeCloseTo(expectedValue, 1);
            });

            it('should be computed correctly when numberOfColorsOverride is defined', async () => {
                const numberOfColorsOverride = chance.d12();
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    numberOfColorsOverride
                };
                const quote = await createQuote(quoteInputAttributes);
                const { SCALING_CLICKS, COST_PER_COLOR } = constants;
                
                const expectedValue = SCALING_CLICKS * numberOfColorsOverride * 2 * COST_PER_COLOR;

                expect(quote.scalingClickCost).not.toBeFalsy();
                expect(quote.scalingClickCost).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: proofRunupClickCost', () => {
            it('should be computed correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const numberOfDesigns = quoteInputAttributes.products.length;
                
                const expectedValue = constants.COST_PER_COLOR * baseProduct.numberOfColors * 2 * numberOfDesigns;

                expect(quote.proofRunupClickCost).not.toBeFalsy();
                expect(quote.proofRunupClickCost).toBeCloseTo(expectedValue, 1);
            });

            it('should be computed correctly when numberOfColorsOverride is defined', async () => {
                const numberOfColorsOverride = chance.d12();
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    numberOfColorsOverride
                };
                const quote = await createQuote(quoteInputAttributes);
                const numberOfDesigns = quoteInputAttributes.products.length;
                
                const expectedValue = constants.COST_PER_COLOR * numberOfColorsOverride * 2 * numberOfDesigns;

                expect(quote.proofRunupClickCost).not.toBeFalsy();
                expect(quote.proofRunupClickCost).toBeCloseTo(expectedValue, 1);
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
                expect(quote.printCleanerClickCost).toBeCloseTo(expectedValue, 1);
            });

            it('should be computed correctly (when totalStockFeet >= 5000)', async () => {
                const numberThatShouldForceTotalStockFeetToBeGreaterThan5000 = 900000;

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

                const expectedValue = quoteInputAttributes.products.length * constants.PRINTING_PROOF_TIME;

                expect(quote.proofPrintingTime).not.toBeFalsy();
                expect(quote.proofPrintingTime).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: rollChangeOverTime', () => {
            it('should equal zero when there is ONLY 1 roll', async () => {
                const superTinyNumberToEnsureOnly1RollIsRequired = 1;
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    labelQty: superTinyNumberToEnsureOnly1RollIsRequired
                };
                const quote = await createQuote(quoteInputAttributes);

                expect(quote.rollChangeOverTime).toEqual(0);
            });

            it('should equal zero when there is MORE THAN 1 roll', async () => {
                const bigNumberToEnsureManyRollsAreRequired = 50000;
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    labelQty: bigNumberToEnsureManyRollsAreRequired
                };
                const quote = await createQuote(quoteInputAttributes);
                const { totalRollsOfPaper } = quote;

                const expectedValue = totalRollsOfPaper * constants.PRINTING_ROLL_CHANGE_OVER_TIME;

                expect(quote.rollChangeOverTime).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: finishedRollLength', () => {
            describe('When quote.labelQty >= quote.labelsPerRoll', () => {
                beforeEach(() => {
                    const labelsPerRoll = baseProduct.labelsPerRoll;
                    const labelQty = chance.pickone([labelsPerRoll, labelsPerRoll + 1]);
                    quoteInputAttributes = {
                        ...quoteInputAttributes,
                        labelQty
                    };
                });

                it('should compute the attribute correctly when dieOverride.sizeAcross and dieOverride.spaceAround ARE defined', async () => {
                    const dieOverride = generateDie();
                    quoteInputAttributes = {
                        ...quoteInputAttributes,
                        dieOverride
                    };
                    const quote = await createQuote(quoteInputAttributes);
    
                    const expectedValue = ((dieOverride.sizeAcross + dieOverride.spaceAround) * baseProduct.labelsPerRoll) / INCHES_PER_FOOT;

                    expect(quote.finishedRollLength).not.toBeFalsy();
                    expect(quote.finishedRollLength).toEqual(expectedValue);
                });

                it('should compute the attribute correctly when dieOverride.sizeAcross and dieOverride.spaceAround ARE NOT defined', async () => {
                    delete quoteInputAttributes.dieOverride;
                    const quote = await createQuote(quoteInputAttributes);
    
                    const expectedValue = ((die.sizeAcross + die.spaceAround) * baseProduct.labelsPerRoll) / INCHES_PER_FOOT;
                
                    expect(quote.finishedRollLength).not.toBeFalsy();
                    expect(quote.finishedRollLength).toEqual(expectedValue);
                });
            });

            describe('When quote.labelQty < quote.labelsPerRoll', () => {
                beforeEach(() => {
                    const labelsPerRoll = baseProduct.labelsPerRoll;
                    const labelQty = labelsPerRoll - 1;
                    quoteInputAttributes = {
                        ...quoteInputAttributes,
                        labelsPerRoll,
                        labelQty
                    };
                });

                it('should compute the attribute correctly when sizeAcrossOverride and spaceAroundOverride ARE defined', async () => {
                    const dieOverride = generateDie();
                    quoteInputAttributes = {
                        ...quoteInputAttributes,
                        dieOverride
                    };
                    const quote = await createQuote(quoteInputAttributes);
                    const { labelQty } = quote;

                    const expectedValue = ((dieOverride.sizeAcross + dieOverride.spaceAround) * labelQty) / INCHES_PER_FOOT;

                    expect(quote.finishedRollLength).not.toBeFalsy();
                    expect(quote.finishedRollLength).toEqual(expectedValue);
                });

                it('should compute the attribute correctly when sizeAcrossOverride and spaceAroundOverride ARE NOT defined', async () => {
                    delete quoteInputAttributes.dieOverride;
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
                expect(quote.printingStockTime).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: stockSpliceTime', () => {
            it('should set attribute to a constant value', async () => {
                const expectedValue = constants.NEW_MATERIAL_STOCK_SPLICE;
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.stockSpliceTime).not.toBeFalsy();
                expect(quote.stockSpliceTime).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: totalTimeAtPrinting', () => {
            it('should compute the attribute correctly', async () => {
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    isSheeted: true
                };
                const quote = await createQuote(quoteInputAttributes);
                const { 
                    stockSpliceTime, colorCalibrationTime, proofPrintingTime, reinsertionPrintingTime, 
                    printTearDownTime, rollChangeOverTime, printingStockTime, reinsertionSetupTime
                } = quote;
            
                const expectedValue = stockSpliceTime + colorCalibrationTime + proofPrintingTime
                    + reinsertionSetupTime + rollChangeOverTime + printingStockTime
                    + reinsertionPrintingTime + printTearDownTime;

                expect(quote.totalTimeAtPrinting).not.toBeFalsy();
                expect(quote.totalTimeAtPrinting).toEqual(expectedValue);
            });
        });

        describe('attribute: totalPrintingCost', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalTimeAtPrinting } = quote;
                
                const expectedValue = (totalTimeAtPrinting / MINUTES_PER_HOUR) * constants.PRINTING_HOURLY_RATE;
            
                expect(quote.totalPrintingCost).not.toBeFalsy();
                expect(quote.totalPrintingCost).toBeCloseTo(expectedValue, 1);
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
                expect(quote.totalCuttingCost).toBeCloseTo(expectedValue, 1);
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
                expect(quote.changeOverTime).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: totalWindingRollTime', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalFinishedRolls, finishedRollLength } = quote;
    
                const expectedValue = totalFinishedRolls * (finishedRollLength / constants.REWIND_SPEED);
    
                expect(quote.totalWindingRollTime).not.toBeFalsy();
                expect(quote.totalWindingRollTime).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: totalWindingTime', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { coreGatheringTime, changeOverTime, totalWindingRollTime, labelDropoffAtShippingTime } = quote;

                const expectedValue = coreGatheringTime + changeOverTime + totalWindingRollTime + labelDropoffAtShippingTime;

                expect(quote.totalWindingTime).not.toBeFalsy();
                expect(quote.totalWindingTime).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: throwAwayWindingTimePercentage', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalWindingRollTime, totalWindingTime } = quote;

                const expectedValue = 1 - (totalWindingRollTime / totalWindingTime);

                expect(quote.throwAwayWindingTimePercentage).not.toBeFalsy();
                expect(quote.throwAwayWindingTimePercentage).toBeCloseTo(expectedValue, 2);
            });
        });

        describe('attribute: totalWindingCost', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalWindingTime } = quote;

                const expectedValue = (totalWindingTime / MINUTES_PER_HOUR) * constants.WINDING_HOURLY_RATE;

                expect(quote.totalWindingCost).not.toBeFalsy();
                expect(quote.totalWindingCost).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: totalCostOfMachineTime', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalPrintingCost, totalCuttingCost, totalWindingCost } = quote;
                
                const expectedValue = totalPrintingCost + totalCuttingCost + totalWindingCost;

                expect(quote.totalCostOfMachineTime).not.toBeFalsy();
                expect(quote.totalCostOfMachineTime).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: boxCreationTime', () => {
            it('should compute the attribute correctly', async () => {
                const hugeNumberOfLabelsHopefullyRequiringManyBoxes = 100000000000;
                quoteInputAttributes.labelQty = hugeNumberOfLabelsHopefullyRequiringManyBoxes;
                const quote = await createQuote(quoteInputAttributes);
                const { packagingDetails } = quote;
                const expectedValue = packagingDetails.totalBoxes * constants.BOX_CREATION_TIME;

                expect(quote.boxCreationTime).not.toBeFalsy();
                expect(quote.boxCreationTime).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: packagingBoxTime', () => {
            it('should compute the attribute correctly', async () => {
                const hugeNumberOfLabelsHopefullyRequiringManyBoxes = 100000000000;
                quoteInputAttributes.labelQty = hugeNumberOfLabelsHopefullyRequiringManyBoxes;
                const quote = await createQuote(quoteInputAttributes);
                const { packagingDetails } = quote;
                const expectedValue = packagingDetails.totalBoxes * constants.PACKAGING_PER_BOX_TIME;

                expect(quote.packagingBoxTime).not.toBeFalsy();
                expect(quote.packagingBoxTime).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: frameUtilization', () => {
            it('should compute the attribute correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { frameLength } = quote;

                const expectedValue = frameLength / constants.MAX_FRAME_AROUND;

                expect(quote.frameUtilization).not.toBeFalsy();
                expect(quote.frameUtilization).toBeCloseTo(expectedValue, 2);
            });
        });

        describe('attribute: totalFinishCost', () => {
            it('should compute the attribute correctly when finishOverride IS DEFINED', async () => {
                const finishOverride = generateFinish();
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    finishOverride
                };
                const quote = await createQuote(quoteInputAttributes);
                const { totalFinishMsi } = quote;

                const expectedValue = finishOverride.costPerMsi * totalFinishMsi;

                expect(quote.totalFinishCost).not.toBeFalsy();
                expect(quote.totalFinishCost).toBeCloseTo(expectedValue, 1);
            });

            it('should compute the attribute correctly when finishOverride IS UNDEFINED but products[x].finish IS DEFINED', async () => {
                delete quoteInputAttributes.finishOverride;
                const quote = await createQuote(quoteInputAttributes);
                const { totalFinishMsi } = quote;

                const expectedValue = totalFinishMsi * finish.costPerMsi;

                expect(quote.totalFinishCost).not.toBeFalsy();
                expect(quote.totalFinishCost).toBeCloseTo(expectedValue, 1);
            });

            it('should compute the attribute correctly when finishOverride IS UNDEFINED AND products[x].finish IS UNDEFINED', async () => {
                delete quoteInputAttributes.finishOverride;
                when(FinishMock.findById)
                    .calledWith(finish._id)
                    .mockResolvedValue(null);
                const expectedValue = 0;
                    
                const quote = await createQuote(quoteInputAttributes);

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

        // TODO (11-5-2023): Revist this one after talking with storm. (Why does this formula only involve a single material?)
        describe('attribute: totalStockCost', () => {
            it('should be calculated using products[x].primaryMaterial and products[x].secondaryMaterial when not overridden by user', async () => {
                delete quoteInputAttributes.primaryMaterialOverride;
                delete quoteInputAttributes.secondaryMaterialOverride;
                const quote = await createQuote(quoteInputAttributes);
                const { totalStockMsi } = quote;

                const expectedValue = (totalStockMsi * primaryMaterial.quotePrice) + (totalStockMsi * secondaryMaterial.quotePrice);

                expect(quote.totalStockCost).not.toBeFalsy();
                expect(quote.totalStockCost).toBeCloseTo(expectedValue, 1);
            });

            it('should be overridable by the user', async () => {
                const primaryMaterialOverride = generateMaterial();
                const secondaryMaterialOverride = generateMaterial();
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    primaryMaterialOverride,
                    secondaryMaterialOverride
                };
                const quote = await createQuote(quoteInputAttributes);
                const { totalStockMsi } = quote;

                const expectedValue = (totalStockMsi * primaryMaterialOverride.quotePrice) + (totalStockMsi * secondaryMaterialOverride.quotePrice);

                expect(quote.totalStockCost).not.toBeFalsy();
                expect(quote.totalStockCost).toBeCloseTo(expectedValue, 2);
            });

            it('should be computed correctly when secondaryMaterial is undefined', async () => {
                delete quoteInputAttributes.secondaryMaterialOverride;
                when(MaterialMock.findById)
                    .calledWith(secondaryMaterial._id)
                    .mockResolvedValue(null);
                const quote = await createQuote(quoteInputAttributes);
                const { totalStockMsi } = quote;

                const expectedValue = totalStockMsi * primaryMaterial.quotePrice;

                expect(quote.totalStockCost).not.toBeFalsy();
                expect(quote.totalStockCost).toBeCloseTo(expectedValue, 2);
            });
        });

        // TODO (11-7-2023): Test this better!
        describe('attribute: cuttingStockTime', () => {
            it('should be defined', async () => {
                const quote = await createQuote(quoteInputAttributes);

                expect(quote.cuttingStockTime).toBeDefined();
            });
        });

        /* * Job Variables * */
        describe('attribute: printingSpeed', () => {
            it('should be calculated correctly when dieOverride is defined', async () => {
                const dieOverride = generateDie();
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    dieOverride
                };
                const quote = await createQuote(quoteInputAttributes);

                const expectedValue = getExpectedPrintingSpeed(baseProduct.numberOfColors, dieOverride);
                
                expect(quote.printingSpeed).not.toBeFalsy();
                expect(quote.printingSpeed).toEqual(expectedValue);
            });

            it('should be calculated correctly when dieOverride.sizeAround and dieOverride.spaceAround are NOT defined', async () => {
                delete quoteInputAttributes.dieOverride;
                delete quoteInputAttributes.numberOfColorsOverride;
                const quote = await createQuote(quoteInputAttributes);
    
                const expectedValue = getExpectedPrintingSpeed(baseProduct.numberOfColors, die);
                
                expect(quote.printingSpeed).not.toBeFalsy();
                expect(quote.printingSpeed).toEqual(expectedValue);
            });
        });

        describe('attribute: totalFinishedRolls', () => {
            it('should be calculated correctly when: labelQty / labelsPerRoll > 1', async () => {
                const bigNumber = 10000;
                const smallNumber = chance.d10();
                quoteInputAttributes.labelQty = bigNumber;
                quoteInputAttributes.labelsPerRoll = smallNumber;
                const quote = await createQuote(quoteInputAttributes);
                const { labelQty } = quote;

                const expectedValue = Math.ceil(labelQty / baseProduct.labelsPerRoll);
                
                expect(quote.totalFinishedRolls).not.toBeFalsy();
                expect(quote.totalFinishedRolls).toEqual(expectedValue);
            });

            it('should be calculated correctly when: labelQty / labelsPerRoll > 0 && labelQty / labelsPerRoll <= 1', async () => {
                const bigNumber = 1000000000;
                const smallNumber = chance.d10();
                quoteInputAttributes.labelQty = smallNumber;
                quoteInputAttributes.labelsPerRollOverride = bigNumber;

                const quote = await createQuote(quoteInputAttributes);

                const expectedValue = 1;
                
                expect(quote.totalFinishedRolls).not.toBeFalsy();
                expect(quote.totalFinishedRolls).toEqual(expectedValue);
            });
        });

        describe('attribute: frameLength', () => {
            it('should compute using sizeAroundOverride and spaceAroundOverride when defined', async () => {
                const dieOverride = generateDie();
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    dieOverride
                };
                const expectedValue = computeFrameLength(dieOverride);
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.frameLength).not.toBeFalsy();
                expect(quote.frameLength).toEqual(expectedValue);
            });

            it('should compute using die.sizeAround and die.spaceAround when sizeAroundOverride and spaceAroundOverride are undefined', async () => {
                delete quoteInputAttributes.dieOverride;
                const expectedValue = computeFrameLength(die);
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.frameLength).not.toBeFalsy();
                expect(quote.frameLength).toEqual(expectedValue);
            });
        });

        describe('attribute: totalNumberOfRolls', () => {
            it('should be calculated correctly', async () => {
                const labelQty = chance.d100();
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    labelQty
                };
                const expectedValue = Math.ceil(labelQty / baseProduct.labelsPerRoll);
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.totalNumberOfRolls).not.toBeFalsy();
                expect(quote.totalNumberOfRolls).toEqual(expectedValue);
            });

            it('should handle setting totalNumberOfRolls to 0 correctly', async () => {
                const labelQty = 0;
                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    labelQty
                };
                
                const quote = await createQuote(quoteInputAttributes);
                
                expect(quote.totalNumberOfRolls).toEqual(0);
            });
        });

        describe('attribute: finishedRollDiameter', () => {
            it('should be calculated correctly', async () => {
                const labelsPerRollOverride = 2000;
                const dieOverride = generateDie();
                const finishOverride = generateFinish();
                const primaryMaterialOverride = generateMaterial();
                const secondaryMaterialOverride = generateMaterial();
                dieOverride.sizeAcross = 0.125;
                dieOverride.spaceAround = 1.5;
                const expectedRollDiameter = 6.230;

                // Sums to 6.750 in combined thickness
                finishOverride.thickness = 0.750;
                primaryMaterialOverride.thickness = 3;
                secondaryMaterialOverride.thickness = 3;

                quoteInputAttributes = {
                    ...quoteInputAttributes,
                    labelQty: 500000,
                    labelsPerRollOverride,
                    dieOverride,
                    finishOverride,
                    primaryMaterialOverride,
                    secondaryMaterialOverride
                };
                const quote = await createQuote(quoteInputAttributes);

                expect(quote.finishedRollDiameter).not.toBeFalsy();
                expect(quote.finishedRollDiameter).toEqual(expectedRollDiameter);
            });
        });

        describe('attribute: finishedRollDiameterWithoutCore', () => {
            it('should be computed correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const diameterOfTheCore = 3.3;
                const expectedRollDiameterWithoutCore = quote.finishedRollDiameter - diameterOfTheCore;

                expect(quote.finishedRollDiameterWithoutCore).not.toBeFalsy();
                expect(quote.finishedRollDiameterWithoutCore).toBeCloseTo(expectedRollDiameterWithoutCore, THREE_DECIMAL_PLACES);
            });
        });

        describe('attribute: packagingDetails', () => {
            it('should be defined', async () => {
                const quote = await createQuote(quoteInputAttributes);

                expect(quote.packagingDetails).toBeDefined();
            });
        });

        describe('attribute: totalBoxCost', () => {
            it('should be calculated correctly', async () => {
                const hugeLabelQtyToEnsureManyBoxes = 100000000;
                quoteInputAttributes.labelQty = hugeLabelQtyToEnsureManyBoxes;
                const quote = await createQuote(quoteInputAttributes);
                const { packagingDetails } = quote;
                const expectedBoxCost = packagingDetails.totalBoxes * constants.BOX_COST;

                expect(quote.totalBoxCost).not.toBeFalsy();
                expect(quote.totalBoxCost).toBeCloseTo(expectedBoxCost, 1);
            });
        });

        describe('attribute: totalMaterialsCost', () => {
            it('should be calculated correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const { totalStockCost, totalFinishCost, inlinePrimingCost, totalClicksCost, totalBoxCost } = quote;
                
                const expectedValue = totalStockCost + totalFinishCost + inlinePrimingCost + totalClicksCost + totalBoxCost;

                expect(quote.totalMaterialsCost).not.toBeFalsy();
                expect(quote.totalMaterialsCost).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: totalShippingTime', () => {
            it('should be calculated correctly', async () => {
                const hugeLabelQtyToEnsureMoreThanOneRoll = 100000000;
                quoteInputAttributes.labelQty = hugeLabelQtyToEnsureMoreThanOneRoll;
                const quote = await createQuote(quoteInputAttributes);
                const { boxCreationTime, packagingBoxTime, packingSlipsTime } = quote;
                
                const expectedValue = boxCreationTime + packagingBoxTime + packingSlipsTime;

                expect(quote.totalShippingTime).not.toBeFalsy();
                expect(quote.totalShippingTime).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: totalShippingCost', () => {
            it('should be calculated correctly', async () => {
                const hugeLabelQtyToEnsureManyBoxesToShip = 100000000;
                quoteInputAttributes.labelQty = hugeLabelQtyToEnsureManyBoxesToShip;
                const quote = await createQuote(quoteInputAttributes);
                const { totalShippingTime } = quote;
                
                const expectedValue = (totalShippingTime / MINUTES_PER_HOUR) * constants.SHIPPING_HOURLY_RATE;

                expect(quote.totalShippingCost).not.toBeFalsy();
                expect(quote.totalShippingCost).toBeCloseTo(expectedValue, 1);
            });
        });

        describe('attribute: totalClicksCost', () => {
            it('should be calculated correctly', async () => {
                const quote = await createQuote(quoteInputAttributes);
                const {
                    scalingClickCost, proofRunupClickCost,
                    printCleanerClickCost, totalFrames
                } = quote;
                const expectedClicksCost = scalingClickCost + proofRunupClickCost + printCleanerClickCost + (totalFrames * baseProduct.numberOfColors * 2);

                expect(quote.totalClicksCost).not.toBeFalsy();
                expect(quote.totalClicksCost).toBeCloseTo(expectedClicksCost, 1);
            });
        });

        describe('attribute: reinsertionSetupTime', () => {
            it('should be calculated correctly', async () => {
                const hugeLabelQtyToEnsureMoreThanOneRoll = 100000000;
                quoteInputAttributes.labelQty = hugeLabelQtyToEnsureMoreThanOneRoll;
                const quote = await createQuote(quoteInputAttributes);
                
                const expectedReinsertionSetupTime = quote.totalRollsOfPaper * constants.REINSERTION_SETUP_TIME_PER_ROLL;
                
                expect(quote.reinsertionSetupTime).not.toBeFalsy();
                expect(quote.reinsertionSetupTime).toEqual(expectedReinsertionSetupTime);
            });
        });
    });
});
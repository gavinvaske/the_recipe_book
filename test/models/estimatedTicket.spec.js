const EstimatedTicket = require('../../application/models/estimatedTicket');
const chance = require('chance').Chance();
const databaseService = require('../../application/services/databaseService');

function verifyLengthAttribute(estimatedTicketAttributes, attributeName) {
    let estimatedTicket;

    // (1) should be a number
    const expectedLength = chance.d100();
    estimatedTicketAttributes[attributeName] = expectedLength;
    estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

    expect(estimatedTicket[attributeName]).toEqual(expect.any(Number));
    expect(estimatedTicket[attributeName]).toEqual(expectedLength);

    // (2) should be a positive value
    const negativeValue = -1;
    estimatedTicketAttributes[attributeName] = negativeValue;
    estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
    
    const error = estimatedTicket.validateSync();

    expect(error).toBeDefined();
}

function verifyNumberOfFramesAttribute(estimatedTicketAttributes, attributeName) {
    let estimatedTicket;

    // (1) should be a number
    const expectedNumberOfRolls = chance.d100();
    estimatedTicketAttributes[attributeName] = expectedNumberOfRolls;
    estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

    expect(estimatedTicket[attributeName]).toEqual(expect.any(Number));
    expect(estimatedTicket[attributeName]).toEqual(expectedNumberOfRolls);

    // (2) should be a positive value
    const negativeValue = -1;
    estimatedTicketAttributes[attributeName] = negativeValue;
    estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
    
    const error = estimatedTicket.validateSync();

    expect(error).toBeDefined();
}

function verifyTimeAttribute(estimatedTicketAttributes, attributeName) {
    let estimatedTicket;

    // (1) should be a number
    const expectedTimeInSeconds = chance.d100();
    estimatedTicketAttributes[attributeName] = expectedTimeInSeconds;
    estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

    expect(estimatedTicket[attributeName]).toEqual(expect.any(Number));
    expect(estimatedTicket[attributeName]).toEqual(expectedTimeInSeconds);

    // (2) should be a positive value
    const negativeValue = -1;
    estimatedTicketAttributes[attributeName] = negativeValue;
    estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
    
    const error = estimatedTicket.validateSync();

    expect(error).toBeDefined();
}

function verifyNumberOfRollsAttribute(estimatedTicketAttributes, attributeName) {
    let estimatedTicket;

    // (1) should be a number
    const expectedNumberOfRolls = chance.d100();
    estimatedTicketAttributes[attributeName] = expectedNumberOfRolls;
    estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

    expect(estimatedTicket[attributeName]).toEqual(expect.any(Number));
    expect(estimatedTicket[attributeName]).toEqual(expectedNumberOfRolls);

    // (2) should be a positive value
    const negativeValue = -1;
    estimatedTicketAttributes[attributeName] = negativeValue;
    estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
    
    const error = estimatedTicket.validateSync();

    expect(error).toBeDefined();
}

function verifyCostAttribute(estimatedTicketAttributes, attributeName) {
    let estimatedTicket;

    // (1) should be a number
    const expectedNumberOfRolls = chance.d100();
    estimatedTicketAttributes[attributeName] = expectedNumberOfRolls;
    estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

    expect(estimatedTicket[attributeName]).toEqual(expect.any(Number));
    expect(estimatedTicket[attributeName]).toEqual(expectedNumberOfRolls);

    // (2) should ignore decimals smaller than 2 decimal places
    const expectedValue = chance.d100();
    const decimalToIgnore = 0.00999999999;
    estimatedTicketAttributes[attributeName] = expectedValue + decimalToIgnore;

    estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

    expect(estimatedTicket[attributeName]).toEqual(expectedValue);

    // (3) should be a positive value
    const negativeValue = -1;
    estimatedTicketAttributes[attributeName] = negativeValue;
    estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
    
    const error = estimatedTicket.validateSync();
    
    expect(error).toBeDefined();

    // (4) should handle floating point decimals up to 2 decimal places
    const numberOfDecimals = 2;
    const floatingPointWithTwoDecimals = chance.floating({ min: 0, fixed: numberOfDecimals });
    estimatedTicketAttributes[attributeName] = floatingPointWithTwoDecimals;
    const penniesPerDollar = 100;
    
    estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

    // values is converted to pennies below to prevent floating point rounding errors
    expect(Math.floor(estimatedTicket[attributeName] * penniesPerDollar))
        .toEqual(Math.floor(floatingPointWithTwoDecimals * penniesPerDollar));
}

describe('File: estimatedTicket.js', () => {
    let estimatedTicketAttributes;

    beforeEach(() => {
        estimatedTicketAttributes = {};
    });

    describe('attribute: initialStockLength', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(estimatedTicketAttributes, 'initialStockLength');
        });
    });

    describe('attribute: colorCalibrationFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(estimatedTicketAttributes, 'colorCalibrationFeet');
        });
    });

    describe('attribute: proofRunupFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(estimatedTicketAttributes, 'proofRunupFeet');
        });
    });

    describe('attribute: printCleanerFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(estimatedTicketAttributes, 'printCleanerFeet');
        });
    });

    describe('attribute: scalingFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(estimatedTicketAttributes, 'scalingFeet');
        });
    });

    describe('attribute: newMaterialSetupFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(estimatedTicketAttributes, 'newMaterialSetupFeet');
        });
    });

    describe('attribute: dieLineSetupFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(estimatedTicketAttributes, 'dieLineSetupFeet');
        });
    });

    describe('attribute: totalStockFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(estimatedTicketAttributes, 'totalStockFeet');
        });
    });

    // describe('attribute: throwAwayStockPercentage', () => {})

    // describe('attribute: totalStockMsi', () => {})

    describe('attribute: totalRollsOfPaper', () => {
        it('should be a number of rolls attribute', () => {
            verifyNumberOfRollsAttribute(estimatedTicketAttributes, 'totalRollsOfPaper');
        });
    });

    describe('attribute: extraFrames', () => {
        it('should be a number of frames attribute', () => {
            verifyNumberOfFramesAttribute(estimatedTicketAttributes, 'extraFrames');
        });
    });

    describe('attribute: totalFrames', () => {
        it('should be a number of frames attribute', () => {
            verifyNumberOfFramesAttribute(estimatedTicketAttributes, 'totalFrames');
        });
    });

    describe('attribute: totalStockCosts', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(estimatedTicketAttributes, 'totalStockCosts');
        });
    });

    describe('attribute: totalFinishFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(estimatedTicketAttributes, 'totalFinishFeet');
        });
    });

    // describe('attribute: totalFinishMsi', () => {})

    describe('attribute: totalFinishCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(estimatedTicketAttributes, 'totalFinishCost');
        });
    });

    describe('attribute: totalCoreCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(estimatedTicketAttributes, 'totalCoreCost');
        });
    });

    describe('attribute: boxCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(estimatedTicketAttributes, 'boxCost');
        });
    });

    describe('attribute: totalMaterialsCost', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(estimatedTicketAttributes, 'totalMaterialsCost');
        });
    });

    describe('attribute: stockSpliceTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'stockSpliceTime');
        });
    });
    describe('attribute: colorCalibrationTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'colorCalibrationTime');
        });
    });

    describe('attribute: printingProofTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'printingProofTime');
        });
    });

    describe('attribute: reinsertionPrintingTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes,'reinsertionPrintingTime');
        });
    });

    describe('attribute: printTearDownTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'printTearDownTime');
        });
    });

    describe('attribute: totalLabelPrintingTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'totalLabelPrintingTime');
        });
    });

    describe('attribute: throwAwayPrintTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'throwAwayPrintTime');
        });
    });

    describe('attribute: totalTimeAtPrinting', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'totalTimeAtPrinting');
        });
    });

    describe('attribute: totalPrintingCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(estimatedTicketAttributes, 'totalPrintingCost');
        });
    });

    describe('attribute: cuttingStockSpliceCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(estimatedTicketAttributes, 'cuttingStockSpliceCost');
        });
    });

    // describe('attribute: dieSetup', () => {})
    // describe('attribute: sheetedSetup', () => {})

    describe('attribute: cuttingStockTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'cuttingStockTime');
        });
    });

    describe('attribute: cuttingTearDownTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'cuttingTearDownTime');
        });
    });

    describe('attribute: sheetedTearDownTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes,'sheetedTearDownTime');
        });
    });

    describe('attribute: totalCuttingTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'totalCuttingTime');
        });
    });

    describe('attribute: totalCuttingCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(estimatedTicketAttributes, 'totalCuttingCost');
        });
    });

    describe('attribute: coreGatheringTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'coreGatheringTime');
        });
    });

    describe('attribute: changeOverTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'changeOverTime');
        });
    });

    describe('attribute: windingAllRollsTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'windingAllRollsTime');
        });
    });

    describe('attribute: labelDropoffAtShippingTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'labelDropoffAtShippingTime');
        });
    });

    describe('attribute: totalWindingTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'totalWindingTime');
        });
    });

    describe('attribute: throwAwayWindingTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'throwAwayWindingTime');
        });
    });
    describe('attribute: totalFinishedRolls', () => {
        it('should be a number of rolls attribute', () => {
            verifyNumberOfRollsAttribute(estimatedTicketAttributes, 'totalFinishedRolls');
        });
    });

    describe('attribute: totalWindingCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(estimatedTicketAttributes, 'totalWindingCost');
        });
    });

    describe('attribute: totalCostOfMachineTime', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(estimatedTicketAttributes, 'totalCostOfMachineTime');
        });
    });

    describe('attribute: boxCreationTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'boxCreationTime');
        });
    });

    describe('attribute: packagingBoxTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(estimatedTicketAttributes, 'packagingBoxTime');
        });
    });

    describe('database interactions', () => {
        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        it('should have timestamps', async () => {
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            let savedEstimatedTicket = await estimatedTicket.save();

            expect(savedEstimatedTicket.createdAt).toBeDefined();
            expect(savedEstimatedTicket.updatedAt).toBeDefined();
        });
    });
});
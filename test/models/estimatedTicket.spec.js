/* eslint-disable no-magic-numbers */
const EstimatedTicket = require('../../application/models/estimatedTicket');
const chance = require('chance').Chance();
const databaseService = require('../../application/services/databaseService');
const mongoose = require('mongoose');
const { dieShapes } = require('../../application/enums/dieShapesEnum');

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
    
    let error = estimatedTicket.validateSync();

    expect(error).toBeDefined();

    // (3) should be an integer
    const floatingPointValue = chance.floating({ min: 0 });
    estimatedTicketAttributes[attributeName] = floatingPointValue;
    estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

    error = estimatedTicket.validateSync();

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
        estimatedTicketAttributes = {
            productQty: chance.d100(),
            reinsertion: chance.bool(),
            variableData: chance.bool(),
            sheeted: chance.bool()
        };
    });

    // * Inputs * //
    describe('attribute: profitMargin', () => {
        it('should default to 30', () => {
            delete estimatedTicketAttributes.profitMargin;
            const defaultProfitMargin = 30;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
            expect(estimatedTicket.profitMargin).toEqual(defaultProfitMargin);
        });

        it('should be a number', () => {
            const expectedProfitMargin = chance.floating({ min: 0, max: 100 });
            estimatedTicketAttributes.profitMargin = expectedProfitMargin;

            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.profitMargin).toEqual(expectedProfitMargin);
        });

        it('should not be greater than 100', () => {
            const maxProfitMargin = 100;
            estimatedTicketAttributes.profitMargin = maxProfitMargin + 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: labelsPerRoll', () => {
        it('should default to 1,000', () => {
            delete estimatedTicketAttributes.labelsPerRoll;
            const defaultLabelsPerRoll = 1000;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
            expect(estimatedTicket.labelsPerRoll).toEqual(defaultLabelsPerRoll);
        });

        it('should be a number', () => {
            const expectedLabelsPerRoll = chance.d100();
            estimatedTicketAttributes.labelsPerRoll = expectedLabelsPerRoll;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.labelsPerRoll).toEqual(expectedLabelsPerRoll);
        });

        it('should be greater than or equal to 1', () => {
            const minLabelsPerRoll = 1;
            estimatedTicketAttributes.labelsPerRoll = minLabelsPerRoll - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be less than or equal to 1,000,000', () => {
            const maxLabelsPerRoll = 1000000;
            estimatedTicketAttributes.labelsPerRoll = maxLabelsPerRoll + 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be an integer', () => {
            const floatingPointValue = chance.floating({ min: 0, max: 1000 });
            estimatedTicketAttributes.labelsPerRoll = floatingPointValue;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: numberOfDesigns', () => {
        it('should be a number', () => {
            const expectedNumberOfDesigns = chance.d100();
            estimatedTicketAttributes.numberOfDesigns = expectedNumberOfDesigns;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.numberOfDesigns).toEqual(expectedNumberOfDesigns);
        });

        it('should befault to 1', () => {
            delete estimatedTicketAttributes.numberOfDesigns;
            const defaultNumberOfDesigns = 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
            expect(estimatedTicket.numberOfDesigns).toEqual(defaultNumberOfDesigns);
        });
        
        it('should be greater than or equal to 1', () => {
            const minNumberOfDesigns = 1;
            estimatedTicketAttributes.numberOfDesigns = minNumberOfDesigns - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be an integer', () => {
            const floatingPointValue = chance.floating({ min: 0, max: 100 });
            estimatedTicketAttributes.numberOfDesigns = floatingPointValue;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: reinsertion', () => {
        it('should be a boolean', () => {
            const expectedReinsertion = chance.bool();
            estimatedTicketAttributes.reinsertion = expectedReinsertion;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.reinsertion).toEqual(expectedReinsertion);
        });

        it('should default to false', () => {
            delete estimatedTicketAttributes.reinsertion;
            const defaultReinsertion = false;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
            expect(estimatedTicket.reinsertion).toEqual(defaultReinsertion);
        });
    });

    describe('attribute: variableData', () => {
        it('should be a boolean', () => {
            const expectedVariableData = chance.bool();
            estimatedTicketAttributes.variableData = expectedVariableData;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.variableData).toEqual(expectedVariableData);
        });

        it('should default to false', () => {
            delete estimatedTicketAttributes.variableData;
            const defaultVariableData = false;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
            expect(estimatedTicket.variableData).toEqual(defaultVariableData);
        });
    });

    describe('attribute: sheeted', () => {
        it('should be a boolean', () => {
            const expectedSheeted = chance.bool();
            estimatedTicketAttributes.sheeted = expectedSheeted;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.sheeted).toEqual(expectedSheeted);
        });

        it('should default to false', () => {
            delete estimatedTicketAttributes.sheeted;
            const defaultSheeted = false;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
            expect(estimatedTicket.sheeted).toEqual(defaultSheeted);
        });
    });

    describe('attribute: labelQty', () => {
        it('should be a number', () => {
            const expectedLabelQty = chance.d100();
            estimatedTicketAttributes.labelQty = expectedLabelQty;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.labelQty).toEqual(expectedLabelQty);
        });

        it('should be greater than or equal to 0', () => {
            const minLabelQty = 0;
            estimatedTicketAttributes.labelQty = minLabelQty - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: die', () => {
        it('should be a mongoose.Schema.Types.ObjectId', () => {
            const expectedDie = mongoose.Types.ObjectId();
            estimatedTicketAttributes.die = expectedDie;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

            expect(estimatedTicket.die).toEqual(expectedDie);
            expect(estimatedTicket.die).toEqual(expect.any(mongoose.Types.ObjectId));
        });
    });

    describe('attribute: sizeAcross', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.sizeAcross;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be greater than or equal to 0', () => {
            const minSizeAcross = 0;
            estimatedTicketAttributes.sizeAcross = minSizeAcross - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not allow floating points with more than 4 decimal places', () => {
            const floatingPointValueWith5DecimalPlaces = 1.00001;
            estimatedTicketAttributes.sizeAcross = floatingPointValueWith5DecimalPlaces;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should allow floating point values with 4 decimal places', () => {
            const floatingPointValueWith5DecimalPlaces = 2.0002;
            estimatedTicketAttributes.sizeAcross = floatingPointValueWith5DecimalPlaces;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should allow integers', () => {
            const integerValue = chance.d100();
            estimatedTicketAttributes.sizeAcross = integerValue;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });
    });

    describe('attribute: sizeAroundOverride', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.sizeAroundOverride;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should not be less than 0', () => {
            const minSizeAroundOverride = 0;
            estimatedTicketAttributes.sizeAroundOverride = minSizeAroundOverride - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should allow floating point values with 4 decimal places or less', () => {
            const allowedValues = [chance.d100(), 100.1234, 999999.123];
            estimatedTicketAttributes.sizeAroundOverride = chance.pickone(allowedValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should not allow floating point values with more than 4 decimal places', () => {
            const notAllowedValues = [1.00001, 8888.12345, 661.123456789];
            estimatedTicketAttributes.sizeAroundOverride = chance.pickone(notAllowedValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: shape', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.shape;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a valid enum value', () => {
            const allowedValue = chance.pickone(dieShapes);
            estimatedTicketAttributes.shape = allowedValue;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should fail if the value is not a valid enum value', () => {
            const notAllowedValue = chance.string();
            estimatedTicketAttributes.shape = notAllowedValue;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideSpaceAround', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.overrideSpaceAround;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideSpaceAround = chance.d100();
            estimatedTicketAttributes.overrideSpaceAround = expectedOverrideSpaceAround;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.overrideSpaceAround).toEqual(expectedOverrideSpaceAround);
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideSpaceAround = 0;
            estimatedTicketAttributes.overrideSpaceAround = minOverrideSpaceAround - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not allow floating point values with more than 4 decimal places', () => {
            const invalidValues = [1.12345, 123.54321, 9999.1234324234];
            estimatedTicketAttributes.overrideSpaceAround = chance.pickone(invalidValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should allow numbers with 4 decimal places or less', () => {
            const allowedValues = [chance.d100(), 100.1234, 999999.123];
            estimatedTicketAttributes.overrideSpaceAround = chance.pickone(allowedValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });
    });

    describe('attribute: overrideSpaceAcross', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.overrideSpaceAcross;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideSpaceAcross = chance.d100();
            estimatedTicketAttributes.overrideSpaceAcross = expectedOverrideSpaceAcross;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.overrideSpaceAcross).toEqual(expectedOverrideSpaceAcross);
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideSpaceAcross = 0;
            estimatedTicketAttributes.overrideSpaceAcross = minOverrideSpaceAcross - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not allow floating point values with more than 4 decimal places', () => {
            const invalidValues = [1.12345, 123.54321, 9999.1234324234];
            estimatedTicketAttributes.overrideSpaceAcross = chance.pickone(invalidValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should allow numbers with 4 decimal places or less', () => {
            const allowedValues = [chance.d100(), 100.1234, 999999.123];
            estimatedTicketAttributes.overrideSpaceAcross = chance.pickone(allowedValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });
    });

    describe('attribute: materialSelect', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.materialSelect;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a mongoose.Schema.Types.ObjectId', () => {
            const expectedMaterialSelect = mongoose.Types.ObjectId();
            estimatedTicketAttributes.materialSelect = expectedMaterialSelect;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.materialSelect).toEqual(expectedMaterialSelect);
        });
    });

    describe('attribute: overrideMaterialFreightMsi', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.overrideMaterialFreightMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideMaterialFreightMsi = chance.d100();
            estimatedTicketAttributes.overrideMaterialFreightMsi = expectedOverrideMaterialFreightMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.overrideMaterialFreightMsi).toEqual(expectedOverrideMaterialFreightMsi);
        });

        it('should not allow floating point values with more than 4 decimal places', () => {
            const invalidValues = [1.12345, 123.54321, 9999.1234324234];
            estimatedTicketAttributes.overrideMaterialFreightMsi = chance.pickone(invalidValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();

            expect(error).toBeDefined();
        });

        it('should allow numbers with 4 decimal places or less', () => {
            const allowedValues = [chance.d100(), 100.1234, 999999.123];
            estimatedTicketAttributes.overrideMaterialFreightMsi = chance.pickone(allowedValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideMaterialTotalCostMsi = 0;
            estimatedTicketAttributes.overrideMaterialFreightMsi = minOverrideMaterialTotalCostMsi - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });
    
    describe('attribute: overrideMaterialTotalCostMsi', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.overrideMaterialTotalCostMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();

            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideMaterialTotalCostMsi = chance.d100();
            estimatedTicketAttributes.overrideMaterialTotalCostMsi = expectedOverrideMaterialTotalCostMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.overrideMaterialTotalCostMsi).toEqual(expectedOverrideMaterialTotalCostMsi);
        });

        it('should not allow floating point values with more than 4 decimal places', () => {
            const invalidValues = [1.12345, 123.54321, 9999.1234324234];
            estimatedTicketAttributes.overrideMaterialTotalCostMsi = chance.pickone(invalidValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should allow numbers with 4 decimal places or less', () => {
            const allowedValues = [chance.d100(), 100.1234, 999999.123];
            estimatedTicketAttributes.overrideMaterialTotalCostMsi = chance.pickone(allowedValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideMaterialTotalCostMsi = 0;
            estimatedTicketAttributes.overrideMaterialTotalCostMsi = minOverrideMaterialTotalCostMsi - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideMaterialQuotedMsi', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.overrideMaterialQuotedMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideMaterialQuotedMsi = chance.d100();
            estimatedTicketAttributes.overrideMaterialQuotedMsi = expectedOverrideMaterialQuotedMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.overrideMaterialQuotedMsi).toEqual(expectedOverrideMaterialQuotedMsi);
        });

        it('should not allow floating point values with more than 4 decimal places', () => {
            const invalidValues = [1.12345, 123.54321, 9999.1234324234];
            estimatedTicketAttributes.overrideMaterialQuotedMsi = chance.pickone(invalidValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should allow numbers with 4 decimal places or less', () => {
            const allowedValues = [chance.d100(), 100.1234, 999999.123];
            estimatedTicketAttributes.overrideMaterialQuotedMsi = chance.pickone(allowedValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

            const error = estimatedTicket.validateSync();

            expect(error).toBeUndefined();
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideMaterialQuotedMsi = 0;
            estimatedTicketAttributes.overrideMaterialQuotedMsi = minOverrideMaterialQuotedMsi - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideMaterialThickness', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.overrideMaterialThickness;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideMaterialThickness = chance.d100();
            estimatedTicketAttributes.overrideMaterialThickness = expectedOverrideMaterialThickness;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.overrideMaterialThickness).toEqual(expectedOverrideMaterialThickness);
        });

        it('should not allow floating point values with more than 4 decimal places', () => {
            const invalidValues = [1.12345, 123.54321, 9999.1234324234];
            estimatedTicketAttributes.overrideMaterialThickness = chance.pickone(invalidValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should allow numbers with 4 decimal places or less', () => {
            const allowedValues = [chance.d100(), 100.1234, 999999.123];
            estimatedTicketAttributes.overrideMaterialThickness = chance.pickone(allowedValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideMaterialThickness = 0;
            estimatedTicketAttributes.overrideMaterialThickness = minOverrideMaterialThickness - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideFinishSelect', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.overrideFinishSelect;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a mongoose.Types.ObjectId', () => {
            const expectedOverrideFinishSelect = new mongoose.Types.ObjectId();
            estimatedTicketAttributes.overrideFinishSelect = expectedOverrideFinishSelect;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

            expect(estimatedTicket.overrideFinishSelect).toEqual(expectedOverrideFinishSelect);
        });
    });

    describe('attribute: overrideFinishCostMsi', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.overrideFinishCostMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideFinishCostMsi = chance.d100();
            estimatedTicketAttributes.overrideFinishCostMsi = expectedOverrideFinishCostMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.overrideFinishCostMsi).toEqual(expectedOverrideFinishCostMsi);
        });

        it('should not allow floating point values with more than 4 decimal places', () => {
            const invalidValues = [1.12345, 123.54321, 9999.1234324234];
            estimatedTicketAttributes.overrideFinishCostMsi = chance.pickone(invalidValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();

            expect(error).toBeDefined();
        });

        it('should allow numbers with 4 decimal places or less', () => {
            const allowedValues = [chance.d100(), 100.1234, 999999.123];
            estimatedTicketAttributes.overrideFinishCostMsi = chance.pickone(allowedValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideFinishCostMsi = 0;
            estimatedTicketAttributes.overrideFinishCostMsi = minOverrideFinishCostMsi - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideFinishFreightMsi', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.overrideFinishFreightMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideFinishFreightMsi = chance.d100();
            estimatedTicketAttributes.overrideFinishFreightMsi = expectedOverrideFinishFreightMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.overrideFinishFreightMsi).toEqual(expectedOverrideFinishFreightMsi);
        });

        it('should not allow floating point values with more than 4 decimal places', () => {
            const invalidValues = [1.12345, 123.543, 9999.1234324234];
            estimatedTicketAttributes.overrideFinishFreightMsi = chance.pickone(invalidValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();

            expect(error).toBeDefined();
        });

        it('should allow numbers with 4 decimal places or less', () => {
            const allowedValues = [chance.d100(), 100.123, 999999.123];
            estimatedTicketAttributes.overrideFinishFreightMsi = chance.pickone(allowedValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideFinishFreightMsi = 0;
            estimatedTicketAttributes.overrideFinishFreightMsi = minOverrideFinishFreightMsi - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideFinishTotalCostMsi', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.overrideFinishTotalCostMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideFinishTotalCostMsi = chance.d100();
            estimatedTicketAttributes.overrideFinishTotalCostMsi = expectedOverrideFinishTotalCostMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.overrideFinishTotalCostMsi).toEqual(expectedOverrideFinishTotalCostMsi);
        });

        it('should not allow floating point values with more than 4 decimal places', () => {
            const invalidValues = [1.12345, 123.54321, 9999.1234324234];
            estimatedTicketAttributes.overrideFinishTotalCostMsi = chance.pickone(invalidValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should allow numbers with 4 decimal places or less', () => {
            const allowedValues = [chance.d100(), 100.1234, 999999.123];
            estimatedTicketAttributes.overrideFinishTotalCostMsi = chance.pickone(allowedValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideFinishTotalCostMsi = 0;
            estimatedTicketAttributes.overrideFinishTotalCostMsi = minOverrideFinishTotalCostMsi - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideFinishQuotedMsi', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.overrideFinishQuotedMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();

            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideFinishQuotedMsi = chance.d100();
            estimatedTicketAttributes.overrideFinishQuotedMsi = expectedOverrideFinishQuotedMsi;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.overrideFinishQuotedMsi).toEqual(expectedOverrideFinishQuotedMsi);
        });

        it('should not allow floating point values with more than 4 decimal places', () => {
            const invalidValues = [1.12345, 123.54321, 9999.1234324234];
            estimatedTicketAttributes.overrideFinishQuotedMsi = chance.pickone(invalidValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should allow numbers with 4 decimal places or less', () => {
            const allowedValues = [chance.d100(), 100.1234, 999999.123];
            estimatedTicketAttributes.overrideFinishQuotedMsi = chance.pickone(allowedValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideFinishQuotedMsi = 0;
            estimatedTicketAttributes.overrideFinishQuotedMsi = minOverrideFinishQuotedMsi - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideFinishThickness', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.overrideFinishThickness;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();

            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideFinishThickness = chance.d100();
            estimatedTicketAttributes.overrideFinishThickness = expectedOverrideFinishThickness;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.overrideFinishThickness).toEqual(expectedOverrideFinishThickness);
        });

        it('should not allow floating point values with more than 4 decimal places', () => {
            const invalidValues = [1.12345, 123.54321, 9999.1234324234];
            estimatedTicketAttributes.overrideFinishThickness = chance.pickone(invalidValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should allow numbers with 4 decimal places or less', () => {
            const allowedValues = [chance.d100(), 100.1234, 999999.123];
            estimatedTicketAttributes.overrideFinishThickness = chance.pickone(allowedValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideFinishThickness = 0;
            estimatedTicketAttributes.overrideFinishThickness = minOverrideFinishThickness - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: coreDiameter', () => {
        it('should default to 3', () => {
            delete estimatedTicketAttributes.coreDiameter;
            
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            expect(estimatedTicket.coreDiameter).toEqual(3);
        });

        it('should be a number', () => {
            const expectedCoreDiameter = chance.d100();
            estimatedTicketAttributes.coreDiameter = expectedCoreDiameter;
            
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

            expect(estimatedTicket.coreDiameter).toEqual(expectedCoreDiameter);
        });

        it('should be greater than or equal to 0', () => {
            const minCoreDiameter = 0;
            estimatedTicketAttributes.coreDiameter = minCoreDiameter - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not allow floating points with more than 2 decimal places', () => {
            const invalidValues = [1.123, 123.54321, 9999.1234324234];
            estimatedTicketAttributes.coreDiameter = chance.pickone(invalidValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should allow numbers with 2 decimal places or less', () => {
            const validValues = [1.12, 123.2, chance.d100()];
            estimatedTicketAttributes.coreDiameter = chance.pickone(validValues);
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });
    });

    describe('attribute: numberOfColors', () => {
        it('should not be required', () => {
            delete estimatedTicketAttributes.numberOfColors;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should not be less than 1', () => {
            const minNumberOfColors = 1;
            estimatedTicketAttributes.numberOfColors = minNumberOfColors - 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not be greater than 12', () => {
            const maxNumberOfColors = 12;
            estimatedTicketAttributes.numberOfColors = maxNumberOfColors + 1;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();

            expect(error).toBeDefined();
        });

        it('should be an integer', () => {
            const expectedNumberOfColors = 1.15;
            estimatedTicketAttributes.numberOfColors = expectedNumberOfColors;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);

            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    // * Outputs * //
    describe('attribute: productQty', () => {
        it('should be required', () => {
            delete estimatedTicketAttributes.productQty;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            verifyLengthAttribute(estimatedTicketAttributes, 'productQty');
        });

        it('should be a positive number', () => {
            const negativeValue = -1;
            estimatedTicketAttributes.productQty = negativeValue;
            const estimatedTicket = new EstimatedTicket(estimatedTicketAttributes);
            
            const error = estimatedTicket.validateSync();
            
            expect(error).toBeDefined();
        });
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
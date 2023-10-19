/* eslint-disable no-magic-numbers */
const Quote = require('../../application/models/quote');
const chance = require('chance').Chance();
const databaseService = require('../../application/services/databaseService');
const mongoose = require('mongoose');
const { dieShapes } = require('../../application/enums/dieShapesEnum');
const constants = require('../../application/enums/constantsEnum');

const FOUR_DECIMAL_PLACES = 4;

function verifyPercentageAttribute(quoteAttributes, attributeName) {
    let quote, error;

    // (1) should be a number
    const expectedPercentage = chance.floating({ min: 0.1, max: 0.9, fixed: FOUR_DECIMAL_PLACES });
    quoteAttributes[attributeName] = expectedPercentage;
    quote = new Quote(quoteAttributes);

    expect(quote[attributeName]).toEqual(expect.any(Number));
    expect(quote[attributeName]).toEqual(expectedPercentage);

    // (2) Should not be less than 0
    const negativeValue = -1;
    quoteAttributes[attributeName] = negativeValue;
    quote = new Quote(quoteAttributes);
    
    error = quote.validateSync();

    expect(error).toBeDefined();

    // (3) Should not be greater than 1
    const greaterThanOneValue = 1.01;
    quoteAttributes[attributeName] = greaterThanOneValue;
    quote = new Quote(quoteAttributes);

    error = quote.validateSync();
    
    expect(error).toBeDefined();

    // (4) should round to 4 decimal places
    const decimalToRound = 0.5555555555555555;
    const expectedDecimalValue = 0.5556;
    quoteAttributes[attributeName] = decimalToRound;
    quote = new Quote(quoteAttributes);
    
    expect(quote[attributeName]).toEqual(expectedDecimalValue);
}

function verifyLengthAttribute(quoteAttributes, attributeName) {
    let quote;

    // (1) should be a number
    const expectedLength = chance.d100();
    quoteAttributes[attributeName] = expectedLength;
    quote = new Quote(quoteAttributes);

    expect(quote[attributeName]).toEqual(expect.any(Number));
    expect(quote[attributeName]).toEqual(expectedLength);

    // (2) should be a positive value
    const negativeValue = -1;
    quoteAttributes[attributeName] = negativeValue;
    quote = new Quote(quoteAttributes);
    
    const error = quote.validateSync();

    expect(error).toBeDefined();
}

function verifyNumberOfFramesAttribute(quoteAttributes, attributeName) {
    let quote;

    // (1) should be a number
    const expectedNumberOfRolls = chance.d100();
    quoteAttributes[attributeName] = expectedNumberOfRolls;
    quote = new Quote(quoteAttributes);

    expect(quote[attributeName]).toEqual(expect.any(Number));
    expect(quote[attributeName]).toEqual(expectedNumberOfRolls);

    // (2) should be a positive value
    const negativeValue = -1;
    quoteAttributes[attributeName] = negativeValue;
    quote = new Quote(quoteAttributes);
    
    const error = quote.validateSync();

    expect(error).toBeDefined();
}

function verifyTimeAttribute(quoteAttributes, attributeName) {
    let quote;

    // (1) should be a number
    const expectedTimeInSeconds = chance.d100();
    quoteAttributes[attributeName] = expectedTimeInSeconds;
    quote = new Quote(quoteAttributes);

    expect(quote[attributeName]).toEqual(expect.any(Number));
    expect(quote[attributeName]).toEqual(expectedTimeInSeconds);

    // (2) should be a positive value
    const negativeValue = -1;
    quoteAttributes[attributeName] = negativeValue;
    quote = new Quote(quoteAttributes);
    
    const error = quote.validateSync();

    expect(error).toBeDefined();
}

function verifyNumberOfRollsAttribute(quoteAttributes, attributeName) {
    let quote;

    // (1) should be a number
    const expectedNumberOfRolls = chance.d100();
    quoteAttributes[attributeName] = expectedNumberOfRolls;
    quote = new Quote(quoteAttributes);

    expect(quote[attributeName]).toEqual(expect.any(Number));
    expect(quote[attributeName]).toEqual(expectedNumberOfRolls);

    // (2) should be a positive value
    const negativeValue = -1;
    quoteAttributes[attributeName] = negativeValue;
    quote = new Quote(quoteAttributes);
    
    let error = quote.validateSync();

    expect(error).toBeDefined();

    // (3) should be an integer
    const floatingPointValue = chance.floating({ min: 0.1, max: 0.9 });
    quoteAttributes[attributeName] = floatingPointValue;
    quote = new Quote(quoteAttributes);

    error = quote.validateSync();

    expect(error).toBeDefined();
}

function verifyCostAttribute(quoteAttributes, attributeName) {
    let quote;

    // (1) should be a number
    const expectedNumberOfRolls = chance.d100();
    quoteAttributes[attributeName] = expectedNumberOfRolls;
    quote = new Quote(quoteAttributes);

    expect(quote[attributeName]).toEqual(expect.any(Number));
    expect(quote[attributeName]).toEqual(expectedNumberOfRolls);

    // (2) should round decimals smaller than 2 decimal places
    const expectedValue = chance.d100();
    const decimalToIgnore = 0.004;
    quoteAttributes[attributeName] = expectedValue + decimalToIgnore;

    quote = new Quote(quoteAttributes);

    expect(quote[attributeName]).toEqual(expectedValue);

    // (3) should be a positive value
    const negativeValue = -1;
    quoteAttributes[attributeName] = negativeValue;
    quote = new Quote(quoteAttributes);
    
    const error = quote.validateSync();
    
    expect(error).toBeDefined();

    // (4) should handle floating point decimals up to 2 decimal places
    const numberOfDecimals = 2;
    const floatingPointWithTwoDecimals = chance.floating({ min: 0, fixed: numberOfDecimals});
    quoteAttributes[attributeName] = floatingPointWithTwoDecimals;
    const penniesPerDollar = 100;
    
    quote = new Quote(quoteAttributes);

    // values is converted to pennies below to prevent floating point rounding errors
    expect(Math.floor(quote[attributeName] * penniesPerDollar))
        .toEqual(Math.floor(floatingPointWithTwoDecimals * penniesPerDollar));
}

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

function generateRandomPercentage() {
    return chance.floating({ min: 0, max: 1, fixed: FOUR_DECIMAL_PLACES});
}

describe('File: quote.js', () => {
    let quoteAttributes;

    beforeEach(() => {
        quoteAttributes = {
            profitMargin: generateRandomPercentage(),
            quoteId: chance.string(),
            productQty: chance.d100(),
            sizeAroundOverride: chance.d100(),
            spaceAroundOverride: chance.d100(),
            products: generateNProducts(),
            frameLength: chance.floating({ min: 0.1, max: constants.MAX_FRAME_LENGTH_INCHES, fixed: 2 }),
            totalStockFeet: chance.d100(),
        };

        const aNumberLessThanTotalStockFeet = quoteAttributes.totalStockFeet - 1;
        quoteAttributes.initialStockLength = aNumberLessThanTotalStockFeet;
    });

    it('should have the correct indexes', async () => {
        const indexMetaData = Quote.schema.indexes();
        const expectedIndexes = ['quoteId'];

        console.log('indexMetaData: ', indexMetaData);

        const isEveryExpectedIndexActuallyAnIndex = expectedIndexes.every((expectedIndex) => {
            return indexMetaData.some((metaData) => {
                const index = Object.keys(metaData[0])[0];
                if (index === expectedIndex) return true;
            });
        });

        expect(isEveryExpectedIndexActuallyAnIndex).toBe(true);
    });

    it('should pass validation if all required attributes are present', () => {
        const quote = new Quote(quoteAttributes);
        
        const error = quote.validateSync();
        
        expect(error).toBeUndefined();
    });

    describe('attribute: quoteId', () => {
        it('should be required', () => {
            delete quoteAttributes.quoteId;
            const quote = new Quote(quoteAttributes);

            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a string', () => {
            const expectedQuoteId = chance.string();
            quoteAttributes.quoteId = expectedQuoteId;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.quoteId).toEqual(expectedQuoteId);
        });
    });

    // * Inputs * //
    describe('attribute: profitMargin', () => {
        it('should be required', () => {
            delete quoteAttributes.profitMargin;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a percentage attribute', () => {
            verifyPercentageAttribute(quoteAttributes, 'profitMargin');
        });
    });

    describe('attribute: labelsPerRoll', () => {
        it('should default to 1,000', () => {
            delete quoteAttributes.labelsPerRoll;
            const defaultLabelsPerRoll = 1000;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
            expect(quote.labelsPerRoll).toEqual(defaultLabelsPerRoll);
        });

        it('should be a number', () => {
            const expectedLabelsPerRoll = chance.d100();
            quoteAttributes.labelsPerRoll = expectedLabelsPerRoll;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.labelsPerRoll).toEqual(expectedLabelsPerRoll);
        });

        it('should be greater than or equal to 1', () => {
            const minLabelsPerRoll = 1;
            quoteAttributes.labelsPerRoll = minLabelsPerRoll - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be less than or equal to 1,000,000', () => {
            const maxLabelsPerRoll = 1000000;
            quoteAttributes.labelsPerRoll = maxLabelsPerRoll + 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be an integer', () => {
            const floatingPointValue = chance.floating({ min: 0, max: 0.9 });
            quoteAttributes.labelsPerRoll = floatingPointValue;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: numberOfDesigns', () => {
        it('should be a number', () => {
            const expectedNumberOfDesigns = chance.d100();
            quoteAttributes.numberOfDesigns = expectedNumberOfDesigns;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.numberOfDesigns).toEqual(expectedNumberOfDesigns);
        });

        it('should befault to 1', () => {
            delete quoteAttributes.numberOfDesigns;
            const defaultNumberOfDesigns = 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
            expect(quote.numberOfDesigns).toEqual(defaultNumberOfDesigns);
        });
        
        it('should be greater than or equal to 1', () => {
            const minNumberOfDesigns = 1;
            quoteAttributes.numberOfDesigns = minNumberOfDesigns - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be an integer', () => {
            const floatingPointValue = chance.floating({ min: 0, max: 0.9 });
            quoteAttributes.numberOfDesigns = floatingPointValue;
            const quote = new Quote(quoteAttributes);

            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: reinsertion', () => {
        it('should be a boolean', () => {
            const expectedReinsertion = chance.bool();
            quoteAttributes.reinsertion = expectedReinsertion;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.reinsertion).toEqual(expectedReinsertion);
        });

        it('should default to false', () => {
            delete quoteAttributes.reinsertion;
            const defaultReinsertion = false;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
            expect(quote.reinsertion).toEqual(defaultReinsertion);
        });
    });

    describe('attribute: variableData', () => {
        it('should be a boolean', () => {
            const expectedVariableData = chance.bool();
            quoteAttributes.variableData = expectedVariableData;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.variableData).toEqual(expectedVariableData);
        });

        it('should default to false', () => {
            delete quoteAttributes.variableData;
            const defaultVariableData = false;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
            expect(quote.variableData).toEqual(defaultVariableData);
        });
    });

    describe('attribute: isSheeted', () => {
        it('should be a boolean', () => {
            const expectedIsSheeted = chance.bool();
            quoteAttributes.isSheeted = expectedIsSheeted;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.isSheeted).toEqual(expectedIsSheeted);
        });

        it('should default to false', () => {
            delete quoteAttributes.isSheeted;
            const defaultIsSheeted = false;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
            expect(quote.isSheeted).toEqual(defaultIsSheeted);
        });
    });

    describe('attribute: labelQty', () => {
        it('should be a number', () => {
            const expectedLabelQty = chance.d100();
            quoteAttributes.labelQty = expectedLabelQty;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.labelQty).toEqual(expectedLabelQty);
        });

        it('should be greater than or equal to 0', () => {
            const minLabelQty = 0;
            quoteAttributes.labelQty = minLabelQty - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: die', () => {
        it('should be a mongoose.Schema.Types.ObjectId', () => {
            const expectedDie = mongoose.Types.ObjectId();
            quoteAttributes.die = expectedDie;
            const quote = new Quote(quoteAttributes);

            expect(quote.die).toEqual(expectedDie);
            expect(quote.die).toEqual(expect.any(mongoose.Types.ObjectId));
        });
    });

    describe('attribute: sizeAcrossOverride', () => {
        it('should not be required', () => {
            delete quoteAttributes.sizeAcrossOverride;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be greater than or equal to 0', () => {
            const minSizeAcross = 0;
            quoteAttributes.sizeAcrossOverride = minSizeAcross - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should round the 4th decimal place', () => {
            const unroundedValue = 1.00005;
            const roundedValue = 1.0001;
            quoteAttributes.sizeAcrossOverride = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.sizeAcrossOverride).toEqual(roundedValue);
        });

        it('should allow floating point values with 4 decimal places', () => {
            const floatingPointValueWith5DecimalPlaces = 2.0002;
            quoteAttributes.sizeAcrossOverride = floatingPointValueWith5DecimalPlaces;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should allow integers', () => {
            const integerValue = chance.d100();
            quoteAttributes.sizeAcrossOverride = integerValue;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });
    });

    describe('attribute: sizeAroundOverride', () => {
        it('should not be required', () => {
            delete quoteAttributes.sizeAroundOverride;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should not be less than 0', () => {
            const minSizeAroundOverride = 0;
            quoteAttributes.sizeAroundOverride = minSizeAroundOverride - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should allow floating point values with 4 decimal places or less', () => {
            const allowedValues = [chance.d100(), 100.1234, 999999.123];
            quoteAttributes.sizeAroundOverride = chance.pickone(allowedValues);
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should round to the 4th decimal places', () => {
            const unroundedValue = 987.00005;
            const roundedValue = 987.0001;
            quoteAttributes.sizeAroundOverride = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.sizeAroundOverride).toEqual(roundedValue);
        });
    });

    describe('attribute: cornerRadius', () => {
        it('should not be required', () => {
            delete quoteAttributes.cornerRadius;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be allowed to be 0', () => {
            const allowedValue = 0;
            quoteAttributes.cornerRadius = allowedValue;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should not be less than 0', () => {
            const minCornerRadius = 0;
            quoteAttributes.cornerRadius = minCornerRadius - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be allowed to be 1', () => {
            const allowedValue = 1;
            quoteAttributes.cornerRadius = allowedValue;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should not be greater than 1', () => {
            const maxCornerRadius = 1;
            quoteAttributes.cornerRadius = maxCornerRadius + 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should round to the 4th decimal places', () => {
            const unroundedValue = 654645.12385;
            const roundedValue = 654645.1239;
            quoteAttributes.cornerRadius = unroundedValue;

            const quote = new Quote(quoteAttributes);

            expect(quote.cornerRadius).toEqual(roundedValue);
        });

        it('should allow floating point values with 4 decimal places or less', () => {
            const allowedValues = [0.5, 0.1234, 0.123];
            quoteAttributes.cornerRadius = chance.pickone(allowedValues);
            const quote = new Quote(quoteAttributes);

            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });
    });

    describe('attribute: shape', () => {
        it('should not be required', () => {
            delete quoteAttributes.shape;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a valid enum value', () => {
            const allowedValue = chance.pickone(dieShapes);
            quoteAttributes.shape = allowedValue;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should fail if the value is not a valid enum value', () => {
            const notAllowedValue = chance.string();
            quoteAttributes.shape = notAllowedValue;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: spaceAroundOverride', () => {
        it('should not be required', () => {
            delete quoteAttributes.spaceAroundOverride;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedSpaceAroundOverride = chance.d100();
            quoteAttributes.spaceAroundOverride = expectedSpaceAroundOverride;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.spaceAroundOverride).toEqual(expectedSpaceAroundOverride);
        });

        it('should be greater than or equal to 0', () => {
            const minSpaceAroundOverride = 0;
            quoteAttributes.spaceAroundOverride = minSpaceAroundOverride - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should round to the 4th decimal place', () => {
            const unroundedValue = 987.00005;
            const roundedValue = 987.0001;
            quoteAttributes.spaceAroundOverride = unroundedValue;

            const quote = new Quote(quoteAttributes);
            
            expect(quote.spaceAroundOverride).toEqual(roundedValue);
        });
    });

    describe('attribute: overrideSpaceAcross', () => {
        it('should not be required', () => {
            delete quoteAttributes.overrideSpaceAcross;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideSpaceAcross = chance.d100();
            quoteAttributes.overrideSpaceAcross = expectedOverrideSpaceAcross;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideSpaceAcross).toEqual(expectedOverrideSpaceAcross);
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideSpaceAcross = 0;
            quoteAttributes.overrideSpaceAcross = minOverrideSpaceAcross - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should round to the 4th decimal place', () => {
            const unroundedValue = 1234567890000.111199999999999;
            const roundedValue = 1234567890000.1112;
            quoteAttributes.overrideSpaceAcross = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideSpaceAcross).toEqual(roundedValue);
        });
    });

    describe('attribute: material', () => {
        it('should not be required', () => {
            delete quoteAttributes.material;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a mongoose.Schema.Types.ObjectId', () => {
            const expectedMaterial = mongoose.Types.ObjectId();
            quoteAttributes.material = expectedMaterial;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.material).toEqual(expectedMaterial);
        });
    });

    describe('attribute: overrideMaterialFreightMsi', () => {
        it('should not be required', () => {
            delete quoteAttributes.overrideMaterialFreightMsi;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideMaterialFreightMsi = chance.d100();
            quoteAttributes.overrideMaterialFreightMsi = expectedOverrideMaterialFreightMsi;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideMaterialFreightMsi).toEqual(expectedOverrideMaterialFreightMsi);
        });

        it('should round to the 4th decimal place', () => {
            const unroundedValue = 987654321.00005;
            const roundedValue = 987654321.0001;
            quoteAttributes.overrideMaterialFreightMsi = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideMaterialFreightMsi).toEqual(roundedValue);
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideMaterialTotalCostMsi = 0;
            quoteAttributes.overrideMaterialFreightMsi = minOverrideMaterialTotalCostMsi - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });
    
    describe('attribute: overrideMaterialTotalCostMsi', () => {
        it('should not be required', () => {
            delete quoteAttributes.overrideMaterialTotalCostMsi;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();

            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideMaterialTotalCostMsi = chance.d100();
            quoteAttributes.overrideMaterialTotalCostMsi = expectedOverrideMaterialTotalCostMsi;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideMaterialTotalCostMsi).toEqual(expectedOverrideMaterialTotalCostMsi);
        });

        it('should round to the 4th decimal place', () => {
            const unroundedValue = 9999.1234324234;
            const roundedValue = 9999.1234;
            quoteAttributes.overrideMaterialTotalCostMsi = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideMaterialTotalCostMsi).toEqual(roundedValue);
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideMaterialTotalCostMsi = 0;
            quoteAttributes.overrideMaterialTotalCostMsi = minOverrideMaterialTotalCostMsi - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideMaterialQuotedMsi', () => {
        it('should not be required', () => {
            delete quoteAttributes.overrideMaterialQuotedMsi;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideMaterialQuotedMsi = chance.d100();
            quoteAttributes.overrideMaterialQuotedMsi = expectedOverrideMaterialQuotedMsi;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideMaterialQuotedMsi).toEqual(expectedOverrideMaterialQuotedMsi);
        });

        it('should round to the 4th decimal place', () => {
            const unroundedValue = 123.54321;
            const roundedValue = 123.5432;
            quoteAttributes.overrideMaterialQuotedMsi = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideMaterialQuotedMsi).toEqual(roundedValue);
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideMaterialQuotedMsi = 0;
            quoteAttributes.overrideMaterialQuotedMsi = minOverrideMaterialQuotedMsi - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideMaterialThickness', () => {
        it('should not be required', () => {
            delete quoteAttributes.overrideMaterialThickness;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideMaterialThickness = chance.d100();
            quoteAttributes.overrideMaterialThickness = expectedOverrideMaterialThickness;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideMaterialThickness).toEqual(expectedOverrideMaterialThickness);
        });

        it('should round to the 4th decimal place', () => {
            const unroundedValue = 111.2222222222222;
            const roundedValue = 111.2222;
            quoteAttributes.overrideMaterialThickness = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideMaterialThickness).toEqual(roundedValue);
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideMaterialThickness = 0;
            quoteAttributes.overrideMaterialThickness = minOverrideMaterialThickness - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideFinish', () => {
        it('should not be required', () => {
            delete quoteAttributes.overrideFinish;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a mongoose.Types.ObjectId', () => {
            const expectedOverrideFinish = new mongoose.Types.ObjectId();
            quoteAttributes.overrideFinish = expectedOverrideFinish;
            const quote = new Quote(quoteAttributes);

            expect(quote.overrideFinish).toEqual(expectedOverrideFinish);
        });
    });

    describe('attribute: overrideFinishCostMsi', () => {
        it('should not be required', () => {
            delete quoteAttributes.overrideFinishCostMsi;
            const quote = new Quote(quoteAttributes);

            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideFinishCostMsi = chance.d100();
            quoteAttributes.overrideFinishCostMsi = expectedOverrideFinishCostMsi;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideFinishCostMsi).toEqual(expectedOverrideFinishCostMsi);
        });

        it('should round to the 4th decimal place', () => {
            const unroundedValue = 1000.999999999999;
            const roundedValue = 1001;
            quoteAttributes.overrideFinishCostMsi = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideFinishCostMsi).toEqual(roundedValue);
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideFinishCostMsi = 0;
            quoteAttributes.overrideFinishCostMsi = minOverrideFinishCostMsi - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideFinishFreightMsi', () => {
        it('should not be required', () => {
            delete quoteAttributes.overrideFinishFreightMsi;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideFinishFreightMsi = chance.d100();
            quoteAttributes.overrideFinishFreightMsi = expectedOverrideFinishFreightMsi;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideFinishFreightMsi).toEqual(expectedOverrideFinishFreightMsi);
        });

        it('should round to the 4th decimal place', () => {
            const unroundedValue = 987.12279;
            const roundedValue = 987.1228;
            quoteAttributes.overrideFinishFreightMsi = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideFinishFreightMsi).toEqual(roundedValue);
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideFinishFreightMsi = 0;
            quoteAttributes.overrideFinishFreightMsi = minOverrideFinishFreightMsi - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideFinishTotalCostMsi', () => {
        it('should not be required', () => {
            delete quoteAttributes.overrideFinishTotalCostMsi;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideFinishTotalCostMsi = chance.d100();
            quoteAttributes.overrideFinishTotalCostMsi = expectedOverrideFinishTotalCostMsi;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideFinishTotalCostMsi).toEqual(expectedOverrideFinishTotalCostMsi);
        });

        it('should round to the 4th decimal place', () => {
            const unroundedValue = 654.10009;
            const roundedValue = 654.1001;
            quoteAttributes.overrideFinishTotalCostMsi = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideFinishTotalCostMsi).toEqual(roundedValue);
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideFinishTotalCostMsi = 0;
            quoteAttributes.overrideFinishTotalCostMsi = minOverrideFinishTotalCostMsi - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideFinishQuotedMsi', () => {
        it('should not be required', () => {
            delete quoteAttributes.overrideFinishQuotedMsi;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();

            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideFinishQuotedMsi = chance.d100();
            quoteAttributes.overrideFinishQuotedMsi = expectedOverrideFinishQuotedMsi;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideFinishQuotedMsi).toEqual(expectedOverrideFinishQuotedMsi);
        });

        it('should round to the 4th decimal place', () => {
            const unroundedValue = 1.00005;
            const roundedValue = 1.0001;
            quoteAttributes.overrideFinishQuotedMsi = unroundedValue;

            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideFinishQuotedMsi).toEqual(roundedValue);
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideFinishQuotedMsi = 0;
            quoteAttributes.overrideFinishQuotedMsi = minOverrideFinishQuotedMsi - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: overrideFinishThickness', () => {
        it('should not be required', () => {
            delete quoteAttributes.overrideFinishThickness;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();

            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedOverrideFinishThickness = chance.d100();
            quoteAttributes.overrideFinishThickness = expectedOverrideFinishThickness;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideFinishThickness).toEqual(expectedOverrideFinishThickness);
        });

        it('should round to the 4th decimal place', () => {
            const unroundedValue = 8888888888888.0000999999999999;
            const roundedValue = 8888888888888.0001;
            quoteAttributes.overrideFinishThickness = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.overrideFinishThickness).toEqual(roundedValue);
        });

        it('should be greater than or equal to 0', () => {
            const minOverrideFinishThickness = 0;
            quoteAttributes.overrideFinishThickness = minOverrideFinishThickness - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: coreDiameter', () => {
        it('should default to 3', () => {
            delete quoteAttributes.coreDiameter;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.coreDiameter).toEqual(3);
        });

        it('should be a number', () => {
            const expectedCoreDiameter = chance.d100();
            quoteAttributes.coreDiameter = expectedCoreDiameter;
            
            const quote = new Quote(quoteAttributes);

            expect(quote.coreDiameter).toEqual(expectedCoreDiameter);
        });

        it('should be greater than or equal to 0', () => {
            const minCoreDiameter = 0;
            quoteAttributes.coreDiameter = minCoreDiameter - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should round to the 2nd decimal place', () => {
            const unroundedValue = 1.123;
            const roundedValue = 1.12;
            quoteAttributes.coreDiameter = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.coreDiameter).toEqual(roundedValue);
        });
    });

    describe('attribute: numberOfColors', () => {
        it('should not be required', () => {
            delete quoteAttributes.numberOfColors;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should not be less than 1', () => {
            const minNumberOfColors = 1;
            quoteAttributes.numberOfColors = minNumberOfColors - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not be greater than 12', () => {
            const maxNumberOfColors = 12;
            quoteAttributes.numberOfColors = maxNumberOfColors + 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();

            expect(error).toBeDefined();
        });

        it('should be an integer', () => {
            const expectedNumberOfColors = 1.15;
            quoteAttributes.numberOfColors = expectedNumberOfColors;
            const quote = new Quote(quoteAttributes);

            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    // * Outputs * //
    describe('attribute: productQty', () => {
        it('should be required', () => {
            delete quoteAttributes.productQty;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            verifyLengthAttribute(quoteAttributes, 'productQty');
        });

        it('should be a positive number', () => {
            const negativeValue = -1;
            quoteAttributes.productQty = negativeValue;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: initialStockLength', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(quoteAttributes, 'initialStockLength');
        });
    });

    describe('attribute: colorCalibrationFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(quoteAttributes, 'colorCalibrationFeet');
        });

    });

    describe('attribute: proofRunupFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(quoteAttributes, 'proofRunupFeet');
        });
    });

    describe('attribute: printCleanerFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(quoteAttributes, 'printCleanerFeet');
        });
    });

    describe('attribute: scalingFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(quoteAttributes, 'scalingFeet');
        });
    });

    describe('attribute: newMaterialSetupFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(quoteAttributes, 'newMaterialSetupFeet');
        });
    });

    describe('attribute: dieLineSetupFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(quoteAttributes, 'dieLineSetupFeet');
        });
    });

    describe('attribute: dieCutterSetupFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(quoteAttributes, 'dieCutterSetupFeet');
        });
    });

    describe('attribute: throwAwayStockPercentage', () => {
        it('should be a percentage attribute', () => {
            verifyPercentageAttribute(quoteAttributes, 'throwAwayStockPercentage');
        });
    });

    describe('attribute: totalStockFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(quoteAttributes, 'totalStockFeet');
        });
    });

    describe('attribute: totalStockMsi', () => {
        it('should not be required', () => {
            delete quoteAttributes.totalStockFeet;
            delete quoteAttributes.totalStockMsi;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedTotalStockMsi = chance.d100();
            quoteAttributes.totalStockMsi = expectedTotalStockMsi;
            const quote = new Quote(quoteAttributes);

            expect(quote.totalStockMsi).toEqual(expectedTotalStockMsi);
        });

        // it('should default to the correctly calculated value', () => {
        //     delete quoteAttributes.totalStockMsi;
        //     const quote = new Quote(quoteAttributes);
        //     const expectedValue = (quote.totalStockFeet * constants.MAX_MATERIAL_SIZE_ACROSS) * (12 / 1000);

        //     expect(quote.totalStockMsi).toEqual(expectedValue);
        // });
    });

    describe('attribute: totalRollsOfPaper', () => {
        it('should be a number of rolls attribute', () => {
            verifyNumberOfRollsAttribute(quoteAttributes, 'totalRollsOfPaper');
        });
    });

    describe('attribute: extraFrames', () => {
        it('should be a number of frames attribute', () => {
            verifyNumberOfFramesAttribute(quoteAttributes, 'extraFrames');
        });

        it('should default to 25', () => {
            const expectedDefaultExtraFrames = 25;
            delete quoteAttributes.extraFrames;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.extraFrames).toEqual(expectedDefaultExtraFrames);
        });
    });

    describe('attribute: totalFrames', () => {
        it('should be a number of frames attribute', () => {
            verifyNumberOfFramesAttribute(quoteAttributes, 'totalFrames');
        });
    });

    describe('attribute: totalStockCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(quoteAttributes, 'totalStockCost');
        });
    });

    describe('attribute: totalFinishFeet', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(quoteAttributes, 'totalFinishFeet');
        });
    });

    describe('attribute: totalFinishMsi', () => {
        it('should not be required', () => {
            delete quoteAttributes.totalFinishMsi;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedTotalFinishMsi = chance.d100();
            quoteAttributes.totalFinishMsi = expectedTotalFinishMsi;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.totalFinishMsi).toEqual(expectedTotalFinishMsi);
        });

        it('should be greater than or equal to 0', () => {
            const minTotalFinishMsi = 0;
            quoteAttributes.totalFinishMsi = minTotalFinishMsi - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: totalFinishCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(quoteAttributes, 'totalFinishCost');
        });
    });

    describe('attribute: totalCoreCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(quoteAttributes, 'totalCoreCost');
        });
    });

    describe('attribute: totalBoxCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(quoteAttributes, 'totalBoxCost');
        });
    });

    describe('attribute: inlinePrimingCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(quoteAttributes, 'inlinePrimingCost');
        });
    });

    describe('attribute: scalingClickCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(quoteAttributes, 'scalingClickCost');
        });
    });

    describe('attribute: proofRunupClickCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(quoteAttributes, 'proofRunupClickCost');
        });
    });

    describe('attribute: printCleanerClickCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(quoteAttributes, 'printCleanerClickCost');
        });
    });

    describe('attribute: totalMaterialsCost', () => {
        it('should be a length attribute', () => {
            verifyLengthAttribute(quoteAttributes, 'totalMaterialsCost');
        });
    });

    describe('attribute: stockSpliceTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'stockSpliceTime');
        });
    });

    describe('attribute: colorCalibrationTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'colorCalibrationTime');
        });
    });

    describe('attribute: proofPrintingTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'proofPrintingTime');
        });
    });

    describe('attribute: reinsertionPrintingTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'reinsertionPrintingTime');
        });
    });

    describe('attribute: rollChangeOverTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'rollChangeOverTime');
        });
    });

    describe('attribute: printingStockTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'printingStockTime');
        });
    });

    describe('attribute: printTearDownTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'printTearDownTime');
        });
    });

    describe('attribute: totalTimeAtPrinting', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'totalTimeAtPrinting');
        });
    });

    describe('attribute: throwAwayPrintTimePercentage', () => {
        it('should be a time attribute', () => {
            verifyPercentageAttribute(quoteAttributes, 'throwAwayPrintTimePercentage');
        });
    });

    describe('attribute: totalPrintingCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(quoteAttributes, 'totalPrintingCost');
        });
    });

    describe('attribute: cuttingStockSpliceTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'cuttingStockSpliceTime');
        });
    });

    describe('attribute: dieSetupTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'dieSetupTime');
        });
    });

    describe('attribute: sheetedSetupTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'sheetedSetupTime');
        });
    });

    describe('attribute: cuttingStockTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'cuttingStockTime');
        });
    });

    describe('attribute: cuttingTearDownTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'cuttingTearDownTime');
        });
    });

    describe('attribute: sheetedTearDownTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes,'sheetedTearDownTime');
        });
    });

    describe('attribute: totalTimeAtCutting', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'totalTimeAtCutting');
        });
    });

    describe('attribute: totalCuttingCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(quoteAttributes, 'totalCuttingCost');
        });
    });

    describe('attribute: throwAwayCuttingTimePercentage', () => {
        it('should be a percentage attribute', () => {
            verifyPercentageAttribute(quoteAttributes, 'throwAwayCuttingTimePercentage');
        });
    });

    describe('attribute: coreGatheringTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'coreGatheringTime');
        });
    });

    describe('attribute: changeOverTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'changeOverTime');
        });
    });

    describe('attribute: totalWindingRollTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'totalWindingRollTime');
        });
    });

    describe('attribute: labelDropoffAtShippingTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'labelDropoffAtShippingTime');
        });
    });

    describe('attribute: totalWindingTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'totalWindingTime');
        });
    });

    describe('attribute: throwAwayWindingTimePercentage', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'throwAwayWindingTimePercentage');
        });
    });
    describe('attribute: totalFinishedRolls', () => {
        it('should be a number of rolls attribute', () => {
            verifyNumberOfRollsAttribute(quoteAttributes, 'totalFinishedRolls');
        });
    });

    describe('attribute: totalWindingCost', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(quoteAttributes, 'totalWindingCost');
        });
    });

    describe('attribute: totalCostOfMachineTime', () => {
        it('should be a cost attribute', () => {
            verifyCostAttribute(quoteAttributes, 'totalCostOfMachineTime');
        });
    });

    describe('attribute: boxCreationTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'boxCreationTime');
        });
    });

    describe('attribute: packagingBoxTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'packagingBoxTime');
        });
    });

    describe('attribute: packingSlipsTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'packingSlipsTime');
        });
    });

    describe('attribute: totalShippingTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'totalShippingTime');
        });
    });

    describe('attribute: totalShippingCost', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes, 'totalShippingCost');
        });
    });

    describe('attribute: customer', () => {
        it('should not be required', () => {
            delete quoteAttributes.customer;
            const quote = new Quote(quoteAttributes);

            const error = quote.validateSync();

            expect(error).toBeUndefined();
        });

        it('should be a mongoose.types.ObjectId', () => {
            const expectedCustomer = new mongoose.Types.ObjectId();
            quoteAttributes.customer = expectedCustomer;
            const quote = new Quote(quoteAttributes);

            expect(quote.customer).toEqual(expectedCustomer);
            expect(quote.customer).toEqual(expect.any(mongoose.Types.ObjectId));
        });
    });

    describe('attribute: frameLength', () => {
        it('should not be required', () => {
            delete quoteAttributes.frameLength;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedFrameLength = 1;
            quoteAttributes.frameLength = expectedFrameLength;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.frameLength).toEqual(expectedFrameLength);
        });

        it('should not be less than 0', () => {
            const minFrameLength = 0;
            quoteAttributes.frameLength = minFrameLength - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not be greater than MAX_FRAME_LENGTH_INCHES', () => {
            quoteAttributes.frameLength = constants.MAX_FRAME_LENGTH_INCHES + 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: frameUtilization', () => {
        it('should not be required', () => {
            delete quoteAttributes.frameUtilization;
            const quote = new Quote(quoteAttributes);

            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedFrameUtilization = 1;
            quoteAttributes.frameUtilization = expectedFrameUtilization;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.frameUtilization).toEqual(expectedFrameUtilization);
        });

        it('should not be less than 0', () => {
            const minFrameUtilization = 0;
            quoteAttributes.frameUtilization = minFrameUtilization - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not be greater than 1', () => {
            const maxFrameUtilization = 1;
            quoteAttributes.frameUtilization = maxFrameUtilization + 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        // it('should default to the correctly calculated value', () => {
        //     delete quoteAttributes.frameUtilization;
        //     const expectedNumberOfDecimals = 4;
        //     const expectedFrameUtilization = Number((quoteAttributes.frameLength / constants.MAX_FRAME_LENGTH_INCHES).toFixed(expectedNumberOfDecimals));

        //     const quote = new Quote(quoteAttributes);
            
        //     expect(quote.frameUtilization).toBeDefined();
        //     expect(quote.frameUtilization).toEqual(expectedFrameUtilization);
        // });

        it('should store round to 4 decimal places of precision', () => {
            const unroundedValue = 0.5555555555;
            const roundedValue = 0.5556;
            quoteAttributes.frameUtilization = unroundedValue;
            
            const quote = new Quote(quoteAttributes);

            expect(quote.frameUtilization).toEqual(roundedValue);
        });

        it('should be undefined if frameLength is not defined', () => {
            delete quoteAttributes.frameLength;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.frameUtilization).toBeUndefined();
        });
    });

    describe('attribute: finishedRollLength', () => {
        it('should not be required', () => {
            delete quoteAttributes.finishedRollLength;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedFinishRollLength = chance.d100();
            quoteAttributes.finishedRollLength = expectedFinishRollLength;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.finishedRollLength).toEqual(expectedFinishRollLength);
        });
    });

    describe('attribute: printingSpeed', () => {
        it('should not be required', () => {
            delete quoteAttributes.printingSpeed;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedPrintingSpeed = chance.d100();
            quoteAttributes.printingSpeed = expectedPrintingSpeed;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.printingSpeed).toEqual(expectedPrintingSpeed);
        });

        it('should not be less than 0', () => {
            const minPrintingSpeed = 0;
            quoteAttributes.printingSpeed = minPrintingSpeed - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not be a floating point number', () => {
            const floatingPointPrintingSpeed = chance.floating({ min: 0.1, max: 0.9 });
            quoteAttributes.printingSpeed = floatingPointPrintingSpeed;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: products', () => {
        let expectedProduct;

        beforeEach(() => {
            expectedProduct = {
                productId: mongoose.Types.ObjectId(),
                labelQty: chance.d100()
            };
            quoteAttributes.products = [expectedProduct];
        });

        it('should not be a required attribute', () => {
            delete quoteAttributes.products;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to an empty array', () => {
            delete quoteAttributes.products;
            
            const quote = new Quote(quoteAttributes);

            expect(quote.products).toEqual([]);
        });

        it('should be an array containing objects with the correct attributes', () => {
            const quote = new Quote(quoteAttributes);
            
            expect(quote.products[0]._id).toBeDefined();
            expect(quote.products[0].productId).toEqual(expectedProduct.productId);
            expect(quote.products[0].labelQty).toEqual(expectedProduct.labelQty);
        });

        describe('attribute: products[n].productId', () => {
            it('should fail validation if attribute does not exist', () => {
                delete quoteAttributes.products[0].productId;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });

            it('should be a mongoose.Types.ObjectId type', () => {
                const quote = new Quote(quoteAttributes);
                
                expect(quote.products[0].productId).toEqual(expect.any(mongoose.Types.ObjectId));
            });
        });

        describe('attribute: products[n].labelQty', () => {
            it('should fail validation if attribute IS NOT defined', () => {
                delete quoteAttributes.products[0].labelQty;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });

            it('should be a number type', () => {
                const quote = new Quote(quoteAttributes);
                
                expect(quote.products[0].labelQty).toEqual(expect.any(Number));
            });

            it('should not be less than 0', () => {
                quoteAttributes.products[0].labelQty = -1;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();

                expect(error).toBeDefined();
            });

            it('should fail validation if attribute is a floating point number', () => {
                quoteAttributes.products[0].labelQty = chance.floating({ min: 0.1, max: 0.9 });
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
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
            const quote = new Quote(quoteAttributes);
            let savedquote = await quote.save();

            expect(savedquote.createdAt).toBeDefined();
            expect(savedquote.updatedAt).toBeDefined();
        });
    });
});
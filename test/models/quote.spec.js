/* eslint-disable no-magic-numbers */
const Quote = require('../../application/models/quote');
const chance = require('chance').Chance();
const databaseService = require('../../application/services/databaseService');
const mongoose = require('mongoose');
const { dieShapes } = require('../../application/enums/dieShapesEnum');
const constants = require('../../application/enums/constantsEnum');
const testDataGenerator = require('../testDataGenerator');

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

    describe('attribute: labelsPerRollOverride', () => {
        it('should not be required', () => {
            delete quoteAttributes.labelsPerRollOverride;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedLabelsPerRoll = chance.d100();
            quoteAttributes.labelsPerRollOverride = expectedLabelsPerRoll;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.labelsPerRollOverride).toEqual(expectedLabelsPerRoll);
        });

        it('should be greater than or equal to 1', () => {
            const minLabelsPerRoll = 1;
            quoteAttributes.labelsPerRollOverride = minLabelsPerRoll - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be less than or equal to 1,000,000', () => {
            const maxLabelsPerRoll = 1000000;
            quoteAttributes.labelsPerRollOverride = maxLabelsPerRoll + 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be an integer', () => {
            const floatingPointValue = chance.floating({ min: 0, max: 0.9 });
            quoteAttributes.labelsPerRollOverride = floatingPointValue;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: numberOfDesignsOverride', () => {
        it('should be a number', () => {
            const expectedNumberOfDesigns = chance.d100();
            quoteAttributes.numberOfDesignsOverride = expectedNumberOfDesigns;
            const quote = new Quote(quoteAttributes);
            
            expect(quote.numberOfDesignsOverride).toEqual(expectedNumberOfDesigns);
        });
        
        it('should be greater than or equal to 1', () => {
            const minNumberOfDesigns = 1;
            quoteAttributes.numberOfDesignsOverride = minNumberOfDesigns - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be an integer', () => {
            const floatingPointValue = chance.floating({ min: 0, max: 0.9 });
            quoteAttributes.numberOfDesignsOverride = floatingPointValue;
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

    describe('attribute: dieOverride', () => {
        beforeEach(() => {
            const die = testDataGenerator.mockData.Die();
            quoteAttributes.dieOverride = {
                sizeAcross: die.sizeAcross,
                sizeAround: die.sizeAround,
                cornerRadius: die.cornerRadius,
                shape: die.shape,
                spaceAround: die.spaceAround,
                spaceAcross: die.spaceAcross
            };
        });

        it('should pass validation when all required attributes are provided', () => {
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should fail validation if unknown attribute is provided', () => {
            const unknownAttribute = chance.string();
            quoteAttributes.dieOverride[unknownAttribute] = chance.string();
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not be required', () => {
            delete quoteAttributes.dieOverride;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        describe('attribute: dieOverride.sizeAcross', () => {
            it('should be required', () => {
                delete quoteAttributes.dieOverride.sizeAcross;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).not.toBeUndefined();
            });
    
            it('should be greater than or equal to 0', () => {
                const minSizeAcross = 0;
                quoteAttributes.dieOverride.sizeAcross = minSizeAcross - 1;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
    
            it('should allow floating point values with 4 decimal places', () => {
                const floatingPointValueWith5DecimalPlaces = 2.0002;
                quoteAttributes.dieOverride.sizeAcross = floatingPointValueWith5DecimalPlaces;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeUndefined();
            });
    
            it('should allow integers', () => {
                const integerValue = chance.d100();
                quoteAttributes.dieOverride.sizeAcross = integerValue;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeUndefined();
            });
        });
        describe('attribute: dieOverride.sizeAround', () => {
            it('should be required', () => {
                delete quoteAttributes.dieOverride.sizeAround;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
    
            it('should not be negative', () => {
                quoteAttributes.dieOverride.sizeAround = -1;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
        });

        describe('attribute: dieOverride.cornerRadius', () => {
            it('should be required', () => {
                delete quoteAttributes.dieOverride.cornerRadius;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
    
            it('should be allowed to be 0', () => {
                const allowedValue = 0;
                quoteAttributes.dieOverride.cornerRadius = allowedValue;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeUndefined();
            });
    
            it('should not be negative', () => {
                quoteAttributes.dieOverride.cornerRadius = -1;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
        });

        describe('attribute: dieOverride.shape', () => {
            it('should be required', () => {
                delete quoteAttributes.dieOverride.shape;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
    
            it('should be a valid enum value', () => {
                const allowedValue = chance.pickone(dieShapes);
                quoteAttributes.dieOverride.shape = allowedValue;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeUndefined();
            });
    
            it('should fail if the value is not a valid enum value', () => {
                const notAllowedValue = chance.string();
                quoteAttributes.dieOverride.shape = notAllowedValue;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
    
                expect(error).toBeDefined();
            });
        });

        describe('attribute: dieOverride.spaceAround', () => {
            it('should be required', () => {
                delete quoteAttributes.dieOverride.spaceAround;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
    
            it('should be a number', () => {
                const expectedSpaceAround = chance.d100();
                quoteAttributes.dieOverride.spaceAround = expectedSpaceAround;
                
                const { dieOverride } = new Quote(quoteAttributes);
                
                expect(dieOverride.spaceAround).toEqual(expectedSpaceAround);
            });
    
            it('should not be negative', () => {
                quoteAttributes.dieOverride.spaceAround = -1;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
        });

        describe('attribute: dieOverride.spaceAcross', () => {
            it('should be required', () => {
                delete quoteAttributes.dieOverride.spaceAcross;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
    
            it('should be a number', () => {
                const expectedSpaceAcross = chance.d100();
                quoteAttributes.dieOverride.spaceAcross = expectedSpaceAcross;
                const { dieOverride } = new Quote(quoteAttributes);
                
                expect(dieOverride.spaceAcross).toEqual(expectedSpaceAcross);
            });
    
            it('should not be negative', () => {
                quoteAttributes.dieOverride.spaceAcross = -1;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
        });
    });

    describe('attribute: primaryMaterialOverride', () => {
        beforeEach(() => {
            const material = testDataGenerator.mockData.Material();
            quoteAttributes.primaryMaterialOverride = {
                name: material.name,
                thickness: material.thickness,
                costPerMsi: material.costPerMsi,
                freightCostPerMsi: material.freightCostPerMsi,
                quotePricePerMsi: material.quotePricePerMsi,
                facesheetWeightPerMsi: material.facesheetWeightPerMsi,
                adhesiveWeightPerMsi: material.adhesiveWeightPerMsi,
                linerWeightPerMsi: material.linerWeightPerMsi,
            };
        });

        it('should not be required', () => {
            delete quoteAttributes.primaryMaterialOverride;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should share the same validation rules with secondaryMaterialOverride', () => {
            quoteAttributes.secondaryMaterialOverride = quoteAttributes.primaryMaterialOverride;

            let quote = new Quote(quoteAttributes);
            
            let error = quote.validateSync();
            
            expect(error).toBeUndefined();
            
            // This next part of this test "ensures" that the above code doesn't result in a false positive
            const unknownAttribute = chance.word();
            quoteAttributes.secondaryMaterialOverride[unknownAttribute] = chance.word();
            quote = new Quote(quoteAttributes);

            error = quote.validateSync();

            expect(error).toBeDefined();
        });

        describe('attribute: name', () => {
            it('should be required', () => {
                delete quoteAttributes.primaryMaterialOverride.name;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).not.toBeUndefined();
            });

            it('should be a string', () => {
                const quote = new Quote(quoteAttributes);
                const { primaryMaterialOverride } = quote;
                
                expect(primaryMaterialOverride.name).toEqual(expect.any(String));
            });

            it('should automatically uppercase the name', () => {
                const lowerCaseString = chance.string().toLowerCase();
                quoteAttributes.primaryMaterialOverride.name = lowerCaseString;
                const quote = new Quote(quoteAttributes);
                
                const { primaryMaterialOverride } = quote;
                
                expect(primaryMaterialOverride.name).toEqual(lowerCaseString.toUpperCase());
            });
        });

        describe('attribute: thickness', () => {
            it('should be required', () => {
                delete quoteAttributes.primaryMaterialOverride.thickness;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).not.toBeUndefined();
            });
            
            it('should be a number', () => {
                const quote = new Quote(quoteAttributes);
                const { primaryMaterialOverride } = quote;
                
                expect(primaryMaterialOverride.thickness).toEqual(expect.any(Number));
            });

            it('should not be negative', () => {
                const negativeThickness = -1;
                quoteAttributes.primaryMaterialOverride.thickness = negativeThickness;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
        });

        describe('attribute: costPerMsi', () => {
            it('should be required', () => {
                delete quoteAttributes.primaryMaterialOverride.costPerMsi;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).not.toBeUndefined();
            });

            it('should be a number', () => {
                const quote = new Quote(quoteAttributes);
                
                const { primaryMaterialOverride } = quote;
                
                expect(primaryMaterialOverride.costPerMsi).toEqual(expect.any(Number));
            });

            it('should not be negative', () => {
                const negativeCostPerMsi = -1;
                quoteAttributes.primaryMaterialOverride.costPerMsi = negativeCostPerMsi;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
        });

        describe('attribute: freightCostPerMsi', () => {
            it('should be required', () => {
                delete quoteAttributes.primaryMaterialOverride.freightCostPerMsi;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).not.toBeUndefined();
            });
    
            it('should be a number', () => {
                const quote = new Quote(quoteAttributes);
                const { primaryMaterialOverride } = quote;
                
                expect(primaryMaterialOverride.freightCostPerMsi).toEqual(expect.any(Number));
            });
    
            it('should be greater than or equal to 0', () => {
                const minOverrideMaterialTotalCostMsi = 0;
                quoteAttributes.primaryMaterialOverride.freightCostPerMsi = minOverrideMaterialTotalCostMsi - 1;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
        });

        describe('attribute: quotePricePerMsi', () => {
            it('should be required', () => {
                delete quoteAttributes.primaryMaterialOverride.quotePricePerMsi;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).not.toBeUndefined();
            });

            it('should be a number', () => {
                const quote = new Quote(quoteAttributes);
                const { primaryMaterialOverride } = quote;
                
                expect(primaryMaterialOverride.quotePricePerMsi).toEqual(expect.any(Number));
            });

            it('should not be negative', () => {
                const negativeQuotePricePerMsi = -1;
                quoteAttributes.primaryMaterialOverride.quotePricePerMsi = negativeQuotePricePerMsi;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
        });

        describe('attribute: facesheetWeightPerMsi', () => {
            it('should be required', () => {
                delete quoteAttributes.primaryMaterialOverride.facesheetWeightPerMsi;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).not.toBeUndefined();
            });

            it('should be a number', () => {
                const quote = new Quote(quoteAttributes);
                const { primaryMaterialOverride } = quote;
                
                expect(primaryMaterialOverride.facesheetWeightPerMsi).toEqual(expect.any(Number));
            });

            it('should not be negative', () => {
                const negativeFacesheetWeightPerMsi = -1;
                quoteAttributes.primaryMaterialOverride.facesheetWeightPerMsi = negativeFacesheetWeightPerMsi;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
        });
    });

    describe('attribute: finishOverride', () => {
        beforeEach(() => {
            const finish = testDataGenerator.mockData.Finish();
            quoteAttributes.finishOverride = {
                name: finish.name,
                thickness: finish.thickness,
                costPerMsi: finish.costPerMsi,
                freightCostPerMsi: finish.freightCostPerMsi,
                quotePricePerMsi: finish.quotePricePerMsi,
            };
        });

        it('should not be required', () => {
            delete quoteAttributes.finishOverride;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should validate successfully when all required attributes are defined', () => {
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should fail validation if unknown attribute is defined', () => {
            const unknownAttribute = chance.string();
            quoteAttributes.finishOverride[unknownAttribute] = chance.word();
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        describe('attribute: name', () => {
            it('should be required', () => {
                delete quoteAttributes.finishOverride.name;
                const quote = new Quote(quoteAttributes);

                const error = quote.validateSync();
                
                expect(error).not.toBeUndefined();
            });

            it('should automatically uppercase the name', () => {
                const lowerCaseString = chance.string().toLowerCase();
                quoteAttributes.finishOverride.name = lowerCaseString;
                const quote = new Quote(quoteAttributes);
                
                const { finishOverride } = quote;
                
                expect(finishOverride.name).toEqual(lowerCaseString.toUpperCase());
            });
        });

        describe('attribute: thickness', () => {
            it('should be required', () => {
                delete quoteAttributes.finishOverride.thickness;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).not.toBeUndefined();
            });
            
            it('should be a number', () => {
                const quote = new Quote(quoteAttributes);
                const { finishOverride } = quote;
                
                expect(finishOverride.thickness).toEqual(expect.any(Number));
            });

            it('should not be negative', () => {
                const negativeThickness = -1;
                quoteAttributes.finishOverride.thickness = negativeThickness;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
        });

        describe('attribute: costPerMsi', () => {
            it('should be required', () => {
                delete quoteAttributes.finishOverride.costPerMsi;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).not.toBeUndefined();
            });

            it('should be a number', () => {
                const quote = new Quote(quoteAttributes);
                const { finishOverride } = quote;
                
                expect(finishOverride.costPerMsi).toEqual(expect.any(Number));
            });

            it('should not be negative', () => {
                const negativeCostPerMsi = -1;
                quoteAttributes.finishOverride.costPerMsi = negativeCostPerMsi;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
        });

        describe('attribute: freightCostPerMsi', () => {
            it('should be required', () => {
                delete quoteAttributes.finishOverride.freightCostPerMsi;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).not.toBeUndefined();
            });

            it('should be a number', () => {
                const quote = new Quote(quoteAttributes);
                const { finishOverride } = quote;
                
                expect(finishOverride.freightCostPerMsi).toEqual(expect.any(Number));
            });

            it('should not be negative', () => {
                const negativeFreightCostPerMsi = -1;
                quoteAttributes.finishOverride.freightCostPerMsi = negativeFreightCostPerMsi;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
        });

        describe('attribute: quotePricePerMsi', () => {
            it('should be required', () => {
                delete quoteAttributes.finishOverride.quotePricePerMsi;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).not.toBeUndefined();
            });

            it('should be a number', () => {
                const quote = new Quote(quoteAttributes);
                const { finishOverride } = quote;
                
                expect(finishOverride.quotePricePerMsi).toEqual(expect.any(Number));
            });

            it('should not be negative', () => {
                const negativeQuotePricePerMsi = -1;
                quoteAttributes.finishOverride.quotePricePerMsi = negativeQuotePricePerMsi;
                const quote = new Quote(quoteAttributes);
                
                const error = quote.validateSync();
                
                expect(error).toBeDefined();
            });
        });
    });

    describe('attribute: coreDiameter', () => {
        it('should default to 3.25', () => {
            delete quoteAttributes.coreDiameter;
            const expectedDefaultValue = 3.25;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.coreDiameter).toEqual(expectedDefaultValue);
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

    describe('attribute: numberOfColorsOverride', () => {
        it('should not be required', () => {
            delete quoteAttributes.numberOfColorsOverride;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should not be less than 1', () => {
            const minNumberOfColors = 1;
            quoteAttributes.numberOfColorsOverride = minNumberOfColors - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not be greater than 12', () => {
            const maxNumberOfColors = 12;
            quoteAttributes.numberOfColorsOverride = maxNumberOfColors + 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();

            expect(error).toBeDefined();
        });

        it('should be an integer', () => {
            const expectedNumberOfColors = 1.15;
            quoteAttributes.numberOfColorsOverride = expectedNumberOfColors;
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

        it('should round to the 4th decimal place', () => {
            const unroundedValue = 1.12345;
            const roundedValue = 1.1235;
            quoteAttributes.totalStockMsi = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.totalStockMsi).toEqual(roundedValue);
        });
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

        it('should round to the 4th decimal place', () => {
            const unroundedValue = 1.12342222222;
            const roundedValue = 1.1234;
            quoteAttributes.totalFinishMsi = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.totalFinishMsi).toEqual(roundedValue);
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

    describe('attribute: reinsertionSetupTime', () => {
        it('should be a time attribute', () => {
            verifyTimeAttribute(quoteAttributes,'reinsertionSetupTime');
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

    describe('attribute: finishedRollDiameter', () => {
        it('should not be required', () => {
            delete quoteAttributes.finishedRollDiameter;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const finishedRollDiameter = chance.d100();
            quoteAttributes.finishedRollDiameter = finishedRollDiameter;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.finishedRollDiameter).toEqual(finishedRollDiameter);
        });

        it('should round to 3 decimal places of precision', () => {
            const unroundedValue = 0.5555555555;
            const roundedValue = 0.556;
            quoteAttributes.finishedRollDiameter = unroundedValue;
            
            const quote = new Quote(quoteAttributes);

            expect(quote.finishedRollDiameter).toEqual(roundedValue);
        });
    });

    describe('attribute: finishedRollDiameterWithoutCore', () => {
        it('should not be required', () => {
            delete quoteAttributes.finishedRollDiameterWithoutCore;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const finishedRollDiameterWithoutCore = chance.d100();
            quoteAttributes.finishedRollDiameterWithoutCore = finishedRollDiameterWithoutCore;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.finishedRollDiameterWithoutCore).toEqual(finishedRollDiameterWithoutCore);
        });

        it('should round to 3 decimal places of precision', () => {
            const unroundedValue = 0.5555555555;
            const roundedValue = 0.556;
            quoteAttributes.finishedRollDiameterWithoutCore = unroundedValue;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.finishedRollDiameterWithoutCore).toEqual(roundedValue);
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

        it('should round to 4 decimal places', () => {
            const printingSpeed = 1.123456789;
            const roundedPrintingSpeed = 1.1235;
            quoteAttributes.printingSpeed = printingSpeed;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.printingSpeed).toEqual(roundedPrintingSpeed);
        });
    });

    describe('attribute: totalNumberOfRolls', () => {
        it('should not be required', () => {
            delete quoteAttributes.totalNumberOfRolls;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const expectedTotalNumberOfRolls = chance.d100();
            quoteAttributes.totalNumberOfRolls = expectedTotalNumberOfRolls;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.totalNumberOfRolls).toEqual(expectedTotalNumberOfRolls);
        });

        it('should not be negative', () => {
            const minTotalNumberOfRolls = 0;
            quoteAttributes.totalNumberOfRolls = minTotalNumberOfRolls - 1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be an integer', () => {
            const floatingPointValue = 0.55;
            quoteAttributes.totalNumberOfRolls = floatingPointValue;
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

    describe('attribute: totalClicksCost', () => {
        it('should not be required', () => {
            delete quoteAttributes.totalClicksCost;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('it should be a number', () => {
            const totalClicksCost = chance.d100();
            quoteAttributes.totalClicksCost = totalClicksCost;
            
            const quote = new Quote(quoteAttributes);
            
            expect(quote.totalClicksCost).toEqual(totalClicksCost);
        });

        it('should not be negative', () => {
            quoteAttributes.totalClicksCost = -0.1;
            const quote = new Quote(quoteAttributes);
            
            const error = quote.validateSync();
            
            expect(error).toBeDefined();
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
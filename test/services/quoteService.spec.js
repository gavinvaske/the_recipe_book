const constants = require('../../application/enums/constantsEnum');
const { createQuote } = require('../../application/services/quoteService');

describe('File: quoteService.js', () => {
    let quoteInputParameters;

    beforeEach(() => {
        quoteInputParameters = {};
    });

    describe('Function: quoteService', () => {
        describe('attribute: colorCalibrationFeet', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = constants.COLOR_CALIBRATION_FEET;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.colorCalibrationFeet).toBeDefined();
                expect(quote.colorCalibrationFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: proofRunupFeet', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = constants.PROOF_RUNUP_FEET;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.proofRunupFeet).toBeDefined();
                expect(quote.proofRunupFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: scalingFeet', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = constants.SCALING_FEET;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.scalingFeet).toBeDefined();
                expect(quote.scalingFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: newMaterialSetupFeet', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = constants.NEWLY_LOADED_ROLL_WASTE_FEET;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.newMaterialSetupFeet).toBeDefined();
                expect(quote.newMaterialSetupFeet).toEqual(expectedValue);
            });
        });

        describe('attribute: stockSpliceTime', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = constants.NEW_MATERIAL_STOCK_SPLICE;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.stockSpliceTime).toBeDefined();
                expect(quote.stockSpliceTime).toEqual(expectedValue);
            });
        });

        describe('attribute: colorCalibrationTime', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = constants.COLOR_CALIBRATION_TIME;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.colorCalibrationTime).toBeDefined();
                expect(quote.colorCalibrationTime).toEqual(expectedValue);
            });
        });

        describe('attribute: reinsertionPrintingTime', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = 0;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.reinsertionPrintingTime).toBeDefined();
                expect(quote.reinsertionPrintingTime).toEqual(expectedValue);
            });
        });

        describe('attribute: printTearDownTime', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = constants.PRINTING_TEAR_DOWN_TIME;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.printTearDownTime).toBeDefined();
                expect(quote.printTearDownTime).toEqual(expectedValue);
            });
        });

        describe('attribute: cuttingStockSpliceCost', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = constants.CUTTING_STOCK_SPLICE;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.cuttingStockSpliceCost).toBeDefined();
                expect(quote.cuttingStockSpliceCost).toEqual(expectedValue);
            });
        });

        describe('attribute: dieSetupTime', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = constants.DIE_SETUP;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.dieSetupTime).toBeDefined();
                expect(quote.dieSetupTime).toEqual(expectedValue);
            });
        });

        describe('attribute: sheetedSetupTime', () => {
            it('should set attribute to a constant value if "isSheeted" is TRUE', () => {
                quoteInputParameters.isSheeted = true;
                const expectedValue = constants.SHEETED_SETUP_TIME;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.sheetedSetupTime).toBeDefined();
                expect(quote.sheetedSetupTime).toEqual(expectedValue);
            });

            it('should set attribute to ZERO if "isSheeted" is FALSE', () => {
                quoteInputParameters.isSheeted = false;
                const expectedValue = 0;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.sheetedSetupTime).toBeDefined();
                expect(quote.sheetedSetupTime).toEqual(expectedValue);
            });
        });

        describe('attribute: cuttingTearDownTime', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = constants.CUTTING_TEAR_DOWN_TIME;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.cuttingTearDownTime).toBeDefined();
                expect(quote.cuttingTearDownTime).toEqual(expectedValue);
            });
        });

        describe('attribute: sheetedTearDownTime', () => {
            it('should set attribute to a constant value if "isSheeted" is TRUE', () => {
                quoteInputParameters.isSheeted = true;
                const expectedValue = constants.SHEETED_TEAR_DOWN_TIME;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.sheetedTearDownTime).toBeDefined();
                expect(quote.sheetedTearDownTime).toEqual(expectedValue);
            });

            it('should set attribute to ZERO if "isSheeted" is FALSY', () => {
                delete quoteInputParameters.isSheeted;
                const expectedValue = 0;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.sheetedTearDownTime).toBeDefined();
                expect(quote.sheetedTearDownTime).toEqual(expectedValue);
            });
        });

        describe('attribute: coreGatheringTime', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = constants.CORE_GATHERING_TIME;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.coreGatheringTime).toBeDefined();
                expect(quote.coreGatheringTime).toEqual(expectedValue);
            });
        });

        describe('attribute: labelDropoffAtShippingTime', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = constants.LABEL_DROP_OFF_TIME;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.labelDropoffAtShippingTime).toBeDefined();
                expect(quote.labelDropoffAtShippingTime).toEqual(expectedValue);
            });
        });

        describe('attribute: packingSlipsTime', () => {
            it('should set attribute to a constant value', () => {
                const expectedValue = constants.PACKING_SLIP_TIME;
                
                const quote = createQuote(quoteInputParameters);
                
                expect(quote.packingSlipsTime).toBeDefined();
                expect(quote.packingSlipsTime).toEqual(expectedValue);
            });
        });
    });
});
const chance = require('chance').Chance();
const ProductModel = require('../../application/models/product');

function convertNumberToString(value) {
    return `${value}`;
}

describe('validation', () => {
    let productAttributes;

    beforeEach(() => {
        productAttributes = {
            ProductNumber: chance.string(),
            ToolNo1: chance.string(),
            StockNum2: chance.string(),
            InkType: {}, // TODO: re-evaluate (The xml->json conversion may be defaulting to an object when it reallly should be a string)
            SizeAcross: convertNumberToString(chance.floating()),
            SizeAround: convertNumberToString(chance.floating()),
            NoAcross: convertNumberToString(chance.floating()),
            NoAround: convertNumberToString(chance.floating()),
            CornerRadius: convertNumberToString(chance.floating()),
            FinalUnwind: chance.string(),
            ColSpace: convertNumberToString(chance.floating()),
            RowSpace: convertNumberToString(chance.floating()),
            Description: chance.string(),
            OrderQuantity: convertNumberToString(chance.floating()),
            FinishNotes: {}, // TODO: re-evaluate (The xml->json conversion may be defaulting to an object when it reallly should be a string)
            StockNotes: {}, // TODO: re-evaluate (The xml->json conversion may be defaulting to an object when it reallly should be a string)
            Notes: [{}, {}], // TODO: re-evaluate (The xml->json conversion may be defaulting to an object when it reallly should be a string)
            Hidden_Notes: chance.string(), // TODO: re-evaluate (The xml->json conversion may be defaulting to an object when it reallly should be a string)
            NoColors: convertNumberToString(chance.floating()),
            LabelsPer_Roll: convertNumberToString(chance.floating()),
            FinishType: chance.string(),
            PriceM: convertNumberToString(chance.floating()),
            PriceMode: chance.string(),
            ToolNo2: chance.string(),
            Tool_NumberAround: chance.string(),
            Plate_ID: chance.string()
        };
    });

    it('should validate if all attributes are defined successfully', () => {
        const product = new ProductModel(productAttributes);
    
        const error = product.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: productNumber (aka ProductNumber)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.productNumber).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.ProductNumber;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type String', () => {
            const product = new ProductModel(productAttributes);

            expect(product.productNumber).toEqual(expect.any(String));
        });
    });
    
    describe('attribute: productDie (aka ToolNo1)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.productDie).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.ToolNo1;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type String', () => {
            const product = new ProductModel(productAttributes);

            expect(product.productDie).toEqual(expect.any(String));
        });
    });
    describe('attribute: primaryMaterial (aka StockNum2)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.primaryMaterial).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete productAttributes.StockNum2;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type String', () => {
            const product = new ProductModel(productAttributes);

            expect(product.primaryMaterial).toEqual(expect.any(String));
        });
    });
    describe('attribute: uvFinish (aka InkType)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.uvFinish).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete productAttributes.InkType;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type Object', () => {
            const product = new ProductModel(productAttributes);

            expect(product.uvFinish).toEqual(expect.any(Object));
        });
    });
    describe('attribute: SizeAcross (aka sizeAcross)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.sizeAcross).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.SizeAcross;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const product = new ProductModel(productAttributes);

            expect(product.sizeAcross).toEqual(expect.any(Number));
        });
    });
    describe('attribute: sizeAround (aka SizeAround)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.sizeAround).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.SizeAround;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const product = new ProductModel(productAttributes);

            expect(product.sizeAround).toEqual(expect.any(Number));
        });
    });
    describe('attribute: labelsAcross (aka NoAcross)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.labelsAcross).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.NoAcross;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const product = new ProductModel(productAttributes);

            expect(product.labelsAcross).toEqual(expect.any(Number));
        });
    });
    describe('attribute: labelsAround (aka NoAround)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.labelsAround).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.NoAround;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const product = new ProductModel(productAttributes);

            expect(product.labelsAround).toEqual(expect.any(Number));
        });
    });
    describe('attribute: cornerRadius (aka CornerRadius)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.cornerRadius).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.CornerRadius;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const product = new ProductModel(productAttributes);

            expect(product.cornerRadius).toEqual(expect.any(Number));
        });
    });
    describe('attribute: unwindDirection (aka FinalUnwind)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.unwindDirection).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.FinalUnwind;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type String', () => {
            const product = new ProductModel(productAttributes);

            expect(product.unwindDirection).toEqual(expect.any(String));
        });
    });
    describe('attribute: matrixAcross (aka ColSpace)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.matrixAcross).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.ColSpace;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const product = new ProductModel(productAttributes);

            expect(product.matrixAcross).toEqual(expect.any(Number));
        });
    });
    describe('attribute: matrixAround (aka RowSpace)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.matrixAround).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.RowSpace;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const product = new ProductModel(productAttributes);

            expect(product.matrixAround).toEqual(expect.any(Number));
        });
    });
    describe('attribute: description (aka Description)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.description).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.Description;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type String', () => {
            const product = new ProductModel(productAttributes);

            expect(product.description).toEqual(expect.any(String));
        });
    });
    describe('attribute: labelQty (aka OrderQuantity)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.labelQty).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.OrderQuantity;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const product = new ProductModel(productAttributes);

            expect(product.labelQty).toEqual(expect.any(Number));
        });
    });
    describe('attribute: windingNotes (aka FinishNotes)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.windingNotes).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete productAttributes.FinishNotes;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type Object', () => {
            const product = new ProductModel(productAttributes);

            expect(product.windingNotes).toEqual(expect.any(Object));
        });
    });
    describe('attribute: dieCuttingNotes (aka StockNotes)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.dieCuttingNotes).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete productAttributes.StockNotes;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type Object', () => {
            const product = new ProductModel(productAttributes);

            expect(product.dieCuttingNotes).toEqual(expect.any(Object));
        });
    });
    describe('attribute: prePrintingNotes (aka Notes)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.prePrintingNotes).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete productAttributes.Notes;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });
    });
    describe('attribute: printingNotes (aka Hidden_Notes)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.printingNotes).toBeDefined();
        });
    });
    describe('attribute: numberOfColors (aka NoColors)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.numberOfColors).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete productAttributes.NoColors;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type Number', () => {
            const product = new ProductModel(productAttributes);

            expect(product.numberOfColors).toEqual(expect.any(Number));
        });
    });
    describe('attribute: labelsPerRoll (aka LabelsPer_Roll)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.labelsPerRoll).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.LabelsPer_Roll;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const product = new ProductModel(productAttributes);

            expect(product.labelsPerRoll).toEqual(expect.any(Number));
        });
    });
    describe('attribute: finishType (aka FinishType)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.finishType).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.FinishType;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });
    });
    describe('attribute: price (aka PriceM)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.price).toBeDefined();
        });
        
        it('should fail validation if attribute is missing', () => {
            delete productAttributes.PriceM;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });
    });
    describe('attribute: priceMode (aka PriceMode)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.priceMode).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete productAttributes.PriceMode;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type String', () => {
            const product = new ProductModel(productAttributes);

            expect(product.priceMode).toEqual(expect.any(String));
        });
    });
    describe('attribute: dieTwo (aka ToolNo2)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.dieTwo).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete productAttributes.ToolNo2;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });
    });
    describe('attribute: toolNumberAround (aka Tool_NumberAround)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.toolNumberAround).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete productAttributes.Tool_NumberAround;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type String', () => {
            const product = new ProductModel(productAttributes);

            expect(product.toolNumberAround).toEqual(expect.any(String));
        });
    });

    describe('attribute: plateId (aka Plate_ID)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.plateId).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete productAttributes.Plate_ID;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type String', () => {
            const product = new ProductModel(productAttributes);

            expect(product.plateId).toEqual(expect.any(String));
        });
    });
});
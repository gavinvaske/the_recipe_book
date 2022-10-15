const chance = require('chance').Chance();
const ProductModel = require('../../application/models/product');
const {hotFolders} = require('../../application/enums/hotFolderEnum');
const {idToColorEnum} = require('../../application/enums/idToColorEnum');

function getRandomNumberOfDigits() {
    return chance.integer({min: 1});
}

describe('validation', () => {
    let productAttributes;

    beforeEach(() => {
        const validProductDies = ['DD-123', 'DO-98839'];

        productAttributes = {
            ProductNumber: chance.pickone(['1245D-100', '767D-2672', '767D-001']),
            ToolNo1: chance.pickone(validProductDies),
            StockNum2: chance.pickone(Object.keys(hotFolders)),
            InkType: chance.string(),
            SizeAcross: String(chance.floating({min: 0.1})),
            SizeAround: String(chance.floating({min: 0.1})),
            NoAcross: String(chance.floating({min: 0.1})),
            NoAround: String(chance.floating({min: 0.1})),
            CornerRadius: String(chance.floating({min: 0, max: 0.99})),
            FinalUnwind: chance.string(),
            ColSpace: String(chance.floating()),
            RowSpace: String(chance.floating()),
            Description: chance.string(),
            OrderQuantity: String(chance.integer({min: 0})),
            FinishNotes: chance.string(),
            StockNotes: chance.string(),
            Notes: [chance.string(), chance.string()],
            Hidden_Notes: chance.string(),
            NoColors: chance.pickone(Object.keys(idToColorEnum)),
            LabelsPer_: String(chance.integer({min: 0})),
            FinishType: chance.string(),
            PriceM: String(chance.integer({min: 0})),
            PriceMode: chance.string(),
            ToolNo2: chance.pickone(validProductDies),
            Tool_NumberAround: String(chance.integer({min: 0})),
            Plate_ID: chance.string(),
            alerts: []
        };
    });

    it('should validate if all attributes are defined successfully', () => {
        const product = new ProductModel(productAttributes);
    
        const error = product.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: productNumber (aka ProductNumber)', () => {
        it('should fail validation if string does not start with 3 or 4 digits followed by a "D-" follows by 1 or more digits', () => {
            const slightlyInvalidProductNumbers = chance.pickone([`12D-${getRandomNumberOfDigits()}`, `123D-${getRandomNumberOfDigits()}xxxxx`]);
            productAttributes.ProductNumber = slightlyInvalidProductNumbers;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });
        it('should validate if correct Regex format is provided', () => {
            const validProductNumber = chance.pickone([`1245d-${getRandomNumberOfDigits()}`, `767d-${getRandomNumberOfDigits()}`, `767d-${getRandomNumberOfDigits()}`]);
            productAttributes.ProductNumber = validProductNumber;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();
            expect(error).toBe(undefined);
        });

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
        it('should fail validation if productDie prefix is invalid', () => {
            const invalidProductDie = chance.pickone([`RW-${getRandomNumberOfDigits()}`, `XLDR${getRandomNumberOfDigits()}xxxxxx`]);
            productAttributes.ToolNo1 = invalidProductDie;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass validation if correct Regex format is provided', () => {
            const validProductDie = chance.pickone([`dd-${getRandomNumberOfDigits()}xxx`, `do-${getRandomNumberOfDigits()}`]);
            productAttributes.ToolNo1 = validProductDie;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();
            expect(error).toBe(undefined);
        });

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

            expect(product.uvFinish).toEqual(expect.any(String));
        });
    });
    describe('attribute: SizeAcross (aka sizeAcross)', () => {
        it('should not less than or equal to zero', () => {
            productAttributes.SizeAcross = 0;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

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

        it('should not less than or equal to zero', () => {
            productAttributes.SizeAround = 0;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
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

        it('should not less than or equal to zero', () => {
            productAttributes.NoAcross = 0;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
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

        it('should not less than or equal to zero', () => {
            productAttributes.NoAround = 0;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
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

        it('should not be less than 0', () => {
            productAttributes.CornerRadius = chance.floating({min: -0.01});
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be valid if number is zero', () => {
            productAttributes.CornerRadius = 0;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be valid if number less than 1 and greater than or equal to 0', () => {
            productAttributes.CornerRadius = chance.floating({min: 0, max: 0.99999});
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
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

        it('should fail if attribute is not an integer', () => {
            productAttributes.OrderQuantity = chance.floating({fixed: 8});
            const product = new ProductModel(productAttributes);

            console.log(`productAttributes.OrderQuantity => ${productAttributes.OrderQuantity}`);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail if attribute is less than zero', () => {
            productAttributes.OrderQuantity = chance.integer({max: 0});
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
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

        it('should be of type String', () => {
            const product = new ProductModel(productAttributes);

            expect(product.windingNotes).toEqual(expect.any(String));
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

        it('should be of type String', () => {
            const product = new ProductModel(productAttributes);

            expect(product.dieCuttingNotes).toEqual(expect.any(String));
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

        it('should be an array of Strings', () => {
            const product = new ProductModel(productAttributes);

            expect(product.prePrintingNotes[0]).toEqual(expect.any(String));
            expect(product.prePrintingNotes[1]).toEqual(expect.any(String));
        });
    });
    describe('attribute: printingNotes (aka Hidden_Notes)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.printingNotes).toBeDefined();
        });

        it('should be of type String', () => {
            const product = new ProductModel(productAttributes);

            expect(product.printingNotes).toEqual(expect.any(String));
        });
    });
    describe('attribute: numberOfColors (aka NoColors)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.numberOfColors).toBeDefined();
        });

        it('should pass validation if integer is mapped to the correct color', () => {
            const colorId = 5;
            productAttributes.NoColors = colorId;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
            expect(product.numberOfColors).toBe(idToColorEnum[colorId]);
        });

        it('should fail validation if integer is not mapped to any color', () => {
            const invalidColorId = 9999999999;
            productAttributes.NoColors = invalidColorId;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass validation if attribute is missing', () => {
            delete productAttributes.NoColors;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type Number', () => {
            const colorId = 5;
            productAttributes.numberOfColors = colorId;
            const product = new ProductModel(productAttributes);

            expect(product.numberOfColors).toEqual(expect.any(String));
        });
    });

    describe('attribute: labelsPerRoll (aka LabelsPer_)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.labelsPerRoll).toBeDefined();
        });

        it('should fail if attribute is not an integer', () => {
            productAttributes.LabelsPer_ = chance.floating({fixed: 8});
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail if attribute is less than zero', () => {
            productAttributes.LabelsPer_ = chance.integer({max: 0});
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if attribute is missing', () => {
            delete productAttributes.LabelsPer_;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type String', () => {
            const product = new ProductModel(productAttributes);

            expect(product.labelsPerRoll).toEqual(expect.any(Number));
        });
    });
    describe('attribute: finishType (aka FinishType)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.finishType).toBeDefined();
        });

        it('should NOT fail validation if attribute is missing', () => {
            delete productAttributes.FinishType;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });
    });
    describe('attribute: price (aka PriceM)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.price).toBeDefined();
        });

        it('should not store floating points of more than 2 decimal places', () => {
            const priceWithWayTooManyDecimals = '100.112222222';
            productAttributes.PriceM = priceWithWayTooManyDecimals;
            const expectedPrice = 100.11;

            const product = new ProductModel(productAttributes);

            expect(product.price).toEqual(expectedPrice);
        });
        
        it('should fail validation if negative price is used', () => {
            const negativePrice = chance.integer({max: -1});
            productAttributes.PriceM = negativePrice;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should remove commas from price', () => {
            const currencyWithCommas = '1,192,123.83';
            const currencyWithoutCommas = 1192123.83;
            productAttributes.PriceM = currencyWithCommas;

            const product = new ProductModel(productAttributes);

            expect(product.price).toEqual(currencyWithoutCommas);
        });
        
        it('should fail validation if attribute is missing', () => {
            delete productAttributes.PriceM;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if price is a non-number', () => {
            const invalidPrice = chance.word();
            productAttributes.PriceM = invalidPrice;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if price is empty', () => {
            const invalidPrice = '';
            productAttributes.PriceM = invalidPrice;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const product = new ProductModel(productAttributes);

            expect(product.price).toEqual(expect.any(Number));
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
    describe('attribute: productDieTwo (aka ToolNo2)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.productDieTwo).toBeDefined();
        });

        it('should fail validation if productDie prefix is invalid', () => {
            const invalidProductDie = chance.pickone([`RW-${getRandomNumberOfDigits()}`, `zzz-${getRandomNumberOfDigits()}`]);
            productAttributes.ToolNo2 = invalidProductDie;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass validation if correct Regex format is provided', () => {
            const validProductDie = chance.pickone([`dd-${getRandomNumberOfDigits()}`, `do-${getRandomNumberOfDigits()}`]);
            productAttributes.ToolNo2 = validProductDie;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();
            expect(error).toBe(undefined);
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

        it('should fail if attribute is not an integer', () => {
            productAttributes.Tool_NumberAround = chance.floating({fixed: 8});
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if negative price is used', () => {
            const negativeValue = chance.integer({max: -1});
            productAttributes.Tool_NumberAround = negativeValue;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const product = new ProductModel(productAttributes);

            expect(product.toolNumberAround).toEqual(expect.any(Number));
        });
    });

    describe('attribute: plateId (aka PlateID)', () => {
        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.plateId).toBeDefined();
        });

        it('should be of type String', () => {
            const product = new ProductModel(productAttributes);

            expect(product.plateId).toEqual(expect.any(String));
        });
    });

    describe('attribute: totalLabelQty', () => {

        it('should be a number', async () => {
            const product = new ProductModel(productAttributes);

            expect(product.totalWindingRolls).toEqual(expect.any(Number));
        });
        it('should compute attribute correctly', () => {
            const product = new ProductModel(productAttributes);

            expect(product.totalWindingRolls).toEqual(Math.ceil(product.labelQty / product.labelsPerRoll));
        });
    });

    describe('attribute: coreHeight', () => {
        it('should be required if FinishType attribute equals "Roll"', () => {
            productAttributes.FinishType = 'Roll';
            delete productAttributes.coreHeight;

            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should NOT BE required if FinishType DOES NOT equal "Roll"', () => {
            productAttributes.FinishType = chance.string();
            delete productAttributes.coreHeight;

            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: alerts', () => {
        let productAlerts;
        const validDepartmentsEnum = [
            'ART-PREP',
            'PRE-PRESS',
            'PRINTING',
            'CUTTING',
            'WINDING',
            'SHIPPING',
            'BILLING',
            'COMPLETED'
        ];

        beforeEach(() => {
            productAlerts = [
                {
                    department: chance.pickone(validDepartmentsEnum),
                    message: chance.string()
                }
            ];
        });

        it('should contain attribute', () => {
            const product = new ProductModel(productAttributes);

            expect(product.alerts).toBeDefined();
        });

        it('should contain an object with the correct attributes', () => {
            productAttributes.alerts = productAlerts;

            const product = new ProductModel(productAttributes);

            expect(product.alerts.length).toEqual(1);
            expect(product.alerts[0].department).toEqual(productAlerts[0].department);
            expect(product.alerts[0].message).toEqual(productAlerts[0].message);
        });

        it('should fail validation if an alert has a "department" attribute which IS NOT an accepted enum', () => {
            const invalidDepartment = chance.string();

            productAttributes.alerts = [
                {
                    ...productAlerts[0],
                    department:invalidDepartment
                }
            ];

            const product = new ProductModel(productAttributes);
            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass validation if an alert has a "department" attribute which IS an accepted enum', () => {
            productAttributes.alerts = productAlerts;

            const product = new ProductModel(productAttributes);
            const error = product.validateSync();

            expect(error).toBe(undefined);
        });

        it('should fail validation if an alert is missing "department" attribute', () => {
            productAttributes.alerts = productAlerts;
            delete productAttributes.alerts[0].department;

            const product = new ProductModel(productAttributes);
            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should not fail validation if an alert is missing "message" attribute', () => {
            productAttributes.alerts = productAlerts;
            delete productAttributes.alerts[0].message;

            const product = new ProductModel(productAttributes);
            const error = product.validateSync();

            expect(error).toBe(undefined);
        });

        it('should default alerts.message attribute to be an empty string IF not defined', () => {
            productAttributes.alerts = productAlerts;
            delete productAttributes.alerts[0].message;

            const product = new ProductModel(productAttributes);

            expect(product.alerts[0].message).toEqual('');
        });
    });

    describe('attribute: hotFolder', () => {
        it('should contain attribute which is computed automatically', () => {
            const product = new ProductModel(productAttributes);

            expect(product.hotFolder).toBeDefined();
        });

        it('should not be defined if the variable it depends upon is undefined', () => {
            delete productAttributes.StockNum2;
            const product = new ProductModel(productAttributes);

            expect(product.hotFolder).not.toBeDefined();
        });

        it('should return correct hotFolder which the primaryMaterial (aka "StockNum2") is mapped to', () => {
            const materialIds = Object.keys(hotFolders);
            const materialId = chance.pickone(materialIds);
            productAttributes.StockNum2 = materialId;

            const product = new ProductModel(productAttributes);

            expect(product.hotFolder).toBe(hotFolders[materialId]);
        });

        it('should fail validation if hotFolder is not an accepted value', () => {
            const hotFolder = chance.word();
            productAttributes.hotFolder = hotFolder;

            const product = new ProductModel(productAttributes);
            const error = product.validateSync();

            expect(error).not.toBe(undefined);
        });
    });

    describe('attribute: proof', () => {
        let proof;

        beforeEach(() => {
            proof = {
                url: chance.url(),
                fileName: chance.word()
            };
        });

        it('should contain attribute', () => {
            productAttributes.proof = proof;
            const product = new ProductModel(productAttributes);

            expect(product.proof).toBeDefined();
        });

        it('should pass validation if proof is not defined', () => {
            delete productAttributes.proof;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should fail validation if proof.url is not a valid URL', () => {
            proof.url = chance.word();
            productAttributes.proof = proof;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBeDefined();
        });

        it('should pass validation if proof is a valid URL', () => {
            proof.url = chance.url();
            productAttributes.proof = proof;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should fail validation if proof.url is defined but fileName is not', () => {
            delete proof.fileName;
            productAttributes.proof = proof;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail validation if proof.fileName is defined but url is not', () => {
            delete proof.url;
            proof.fileName = chance.word();
            productAttributes.proof = proof;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBeDefined();
        });
    });
});
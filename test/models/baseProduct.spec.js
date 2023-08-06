const chance = require('chance').Chance();
const ProductModel = require('../../application/models/baseProduct');
const mongoose = require('mongoose');
const databaseService = require('../../application/services/databaseService');
const CustomerModel = require('../../application/models/customer');
const MaterialModel = require('../../application/models/material');
const { unwindDirections, defaultUnwindDirection } = require('../../application/enums/unwindDirectionsEnum');
const { finishTypes, defaultFinishType } = require('../../application/enums/finishTypesEnum');
const DieModel = require('../../application/models/die');
const constantsEnum = require('../../application/enums/constantsEnum');

const MILLIMETERS_PER_INCH = 25.4;

function roundDownToNearestEvenNumber(value) {
    return Math.floor(value / 2) * 2;
}

describe('Product Model', () => {
    let productAttributes;

    beforeEach(() => {
        productAttributes = {
            customerId: mongoose.Types.ObjectId(),
            productDescription: chance.string(),
            dieId: mongoose.Types.ObjectId(),
            unwindDirection: chance.pickone(unwindDirections),
            artNotes: chance.string(),
            primaryMaterialId: mongoose.Types.ObjectId(),
            finish: mongoose.Types.ObjectId(),
            finishType: chance.pickone(finishTypes),
            customerId: mongoose.Types.ObjectId(),
            authorUserId: mongoose.Types.ObjectId()
        };
    });

    it('should validate when attributes are defined correctly', () => {
        const product = new ProductModel(productAttributes);

        const error = product.validateSync();

        expect(error).not.toBeDefined();
    });

    describe('attribute: customerId', () => {
        it('should be required', () => {
            delete productAttributes.customerId;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a valid mongoose ObjectId', () => {
            const product = new ProductModel(productAttributes);

            expect(product.customerId).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should fail if attribute is not a valid mongoose ObjectId', () => {
            productAttributes.customerId = chance.word();
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: productDescription', () => {
        it('should be required', () => {
            delete productAttributes.productDescription;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a string', () => {
            const product = new ProductModel(productAttributes);
            
            expect(product.productDescription).toEqual(expect.any(String));
        });

        it('should trim whitespace', () => {
            const productDescription = chance.string();
            productAttributes.productDescription = ` ${productDescription}   `;

            const product = new ProductModel(productAttributes);

            expect(product.productDescription).toEqual(productDescription);
        });
    });

    describe('attribute: dieId', () => {
        it('should be required', () => {
            delete productAttributes.dieId;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a valid mongoose ObjectId', () => {
            const product = new ProductModel(productAttributes);

            expect(product.dieId).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should fail if attribute is not a valid mongoose ObjectId', () => {
            productAttributes.dieId = chance.word();
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: unwindDirections', () => {
        it('should have a specific default value if not defined', () => {
            delete productAttributes.unwindDirection;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).not.toBeDefined();
            expect(product.unwindDirection).toEqual(defaultUnwindDirection);
        });

        it('should fail if attribute is not a valid unwindDirection value', () => {
            productAttributes.unwindDirection = chance.word();
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });
    });
    
    describe('attribute: ovOrEpm', () => {
        let ovOrEpmOptions, defaultOvOrEpmOption;

        beforeEach(() => {
            ovOrEpmOptions = ['NO', 'OV', 'EPM'];
            defaultOvOrEpmOption = 'NO';
        });

        it('should have a specific default value if not defined', () => {
            delete productAttributes.ovOrEpm;
            
            const product = new ProductModel(productAttributes);
            
            expect(product.ovOrEpm).toEqual(defaultOvOrEpmOption);
        });

        it('should fail if attribute is not a valid ovOrEpm value', () => {
            const invalidOvOrEpmOption = chance.string();
            productAttributes.ovOrEpm = invalidOvOrEpmOption;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBeDefined();
        });

        it('should pass validation if attribute is a valid ovOrEpm value', () => {
            const validOvOrEpmOption = chance.pickone(ovOrEpmOptions);
            productAttributes.ovOrEpm = validOvOrEpmOption;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).not.toBeDefined();
        });

        it('should convert attribute to upper case', () => {
            const lowerCaseOvOrEpmOption = chance.pickone(ovOrEpmOptions).toLowerCase();
            productAttributes.ovOrEpm = lowerCaseOvOrEpmOption;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).not.toBeDefined();
            expect(product.ovOrEpm).toEqual(lowerCaseOvOrEpmOption.toUpperCase());
        });
    });

    describe('attribute: artNotes', () => {
        it('should not be required', () => {
            delete productAttributes.artNotes;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).not.toBeDefined();
        });

        it('should trim whitespace', () => {
            const artNotes = chance.string();
            productAttributes.artNotes = ` ${artNotes}   `;
            
            const product = new ProductModel(productAttributes);
            
            expect(product.artNotes).toEqual(artNotes);
        });
    });

    describe('attribute: primaryMaterialId', () => {
        it('should be required', () => {
            delete productAttributes.primaryMaterialId;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a valid mongoose ObjectId', () => {
            const product = new ProductModel(productAttributes);
            
            expect(product.primaryMaterialId).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should fail if attribute is not a valid mongoose ObjectId', () => {
            productAttributes.primaryMaterialId = chance.word();
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: secondaryMaterial', () => {
        it('should not be required', () => {
            delete productAttributes.secondaryMaterial;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).not.toBeDefined();
        });

        it('should be a valid mongoose ObjectId', () => {
            productAttributes.secondaryMaterial = mongoose.Types.ObjectId();
            
            const product = new ProductModel(productAttributes);
            
            expect(product.secondaryMaterial).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should fail if attribute is not a valid mongoose ObjectId', () => {
            productAttributes.secondaryMaterial = chance.word();
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: finish', () => {
        it('should be required', () => {
            delete productAttributes.finish;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a valid mongoose ObjectId', () => {
            const product = new ProductModel(productAttributes);
            
            expect(product.finish).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should fail if attribute is not a valid mongoose ObjectId', () => {
            productAttributes.finish = chance.word();
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: pressNotes', () => {
        it('should not be required', () => {
            delete productAttributes.pressNotes;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).not.toBeDefined();
        });

        it('should trim whitespace', () => {
            const pressNotes = chance.string();
            productAttributes.pressNotes = ` ${pressNotes}   `;
            
            const product = new ProductModel(productAttributes);
            
            expect(product.pressNotes).toEqual(pressNotes);
        });
    });

    describe('attribute: finishType', () => {
        it('should have a specific default value if not defined', () => {
            delete productAttributes.finishType;
            
            const product = new ProductModel(productAttributes);
            
            expect(product.finishType).toEqual(defaultFinishType);
        });

        it('should fail if attribute is not a valid finishType value', () => {
            productAttributes.finishType = chance.word();
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should pass validation if attribute is a valid finishType value AND convert to uppercase', () => {
            const validFinishType = chance.pickone(finishTypes).toLowerCase();
            productAttributes.finishType = validFinishType;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();

            expect(error).not.toBeDefined();
            expect(product.finishType).toBe(validFinishType.toUpperCase());
        });
    });

    describe('attribute: coreDiameter', () => {
        const DEFAULT_CORE_DIAMETER = 3;

        it('should have a specific default value if not defined', () => {
            delete productAttributes.coreDiameter;
            
            const product = new ProductModel(productAttributes);
            
            expect(product.coreDiameter).toEqual(DEFAULT_CORE_DIAMETER);
        });

        it('should pass validation if attribute is a valid number', () => {
            productAttributes.coreDiameter = chance.integer({ min: 0 });
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).not.toBeDefined();
        });

        it('should fail validation if attribute is negative', () => {
            productAttributes.coreDiameter = chance.integer({ max: -1 });
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: labelsPerRoll', () => {
        const DEFAULT_LABELS_PER_ROLL = 1000;

        it('should have a specific default value if not defined', () => {
            delete productAttributes.labelsPerRoll;
            
            const product = new ProductModel(productAttributes);
            
            expect(product.labelsPerRoll).toEqual(DEFAULT_LABELS_PER_ROLL);
        });

        it('should fail validation if attribute is negative', () => {
            productAttributes.labelsPerRoll = chance.integer({ max: -1 });
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if attribute is not a whole number', () => {
            productAttributes.labelsPerRoll = chance.floating({ min: 0.01 });
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: dieCuttingNotes', () => {
        it('should not be required', () => {
            delete productAttributes.dieCuttingNotes;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).not.toBeDefined();
        });

        it('should trim whitespace', () => {
            const dieCuttingNotes = chance.string();
            productAttributes.dieCuttingNotes = ` ${dieCuttingNotes}   `;
            
            const product = new ProductModel(productAttributes);
            
            expect(product.dieCuttingNotes).toEqual(dieCuttingNotes);
        });
    });
    
    describe('attribute: customerId', () => {
        it('should be required', () => {
            delete productAttributes.customerId;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a valid mongoose ObjectId', () => {
            const product = new ProductModel(productAttributes);
            
            expect(product.customerId).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should fail validation if attribute is not a valid mongoose ObjectId', () => {
            productAttributes.customerId = chance.word();
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: authorUserId', () => {
        it('should be required', () => {
            delete productAttributes.authorUserId;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a valid mongoose ObjectId', () => {
            const product = new ProductModel(productAttributes);

            expect(product.authorUserId).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should fail validation if attribute is not a valid mongoose ObjectId', () => {
            productAttributes.authorUserId = chance.word();
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('verify database interactions', () => {
        let savedCustomer,
            savedDie,
            savedPrimaryMaterial,
            dieAttributes;

        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();

            const customer = new CustomerModel({ customerId: chance.word() });
            savedCustomer = await customer.save({ validateBeforeSave: false });

            productAttributes.customerId = savedCustomer._id;

            dieAttributes = {
                sizeAround: chance.floating({ min: 0.01, max: 10, fixed: 4 }),
                spaceAround: chance.floating({ min: 0.01, max: 10, fixed: 4 }),
                sizeAcross: chance.floating({ min: 0.01, max: 10, fixed: 4 }),
                spaceAcross: chance.floating({ min: 0.01, max: 10, fixed: 4 }),
            };
            const materialAttributes = {
                width: chance.floating({ min: 0.01, fixed: 4 }),
            };
            const die = new DieModel(dieAttributes);
            const primaryMaterial = new MaterialModel(materialAttributes);

            savedDie = await die.save({ validateBeforeSave: false });
            savedPrimaryMaterial = await primaryMaterial.save({ validateBeforeSave: false });

            productAttributes.dieId = savedDie._id;
            productAttributes.primaryMaterialId = savedPrimaryMaterial._id;
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        describe('verify timestamps on created object', () => {
            it('should have a "createdAt" attribute once object is saved', async () => {
                const product = new ProductModel(productAttributes);

                let savedProduct = await product.save({ validateBeforeSave: false });

                expect(savedProduct.createdAt).toBeDefined();
                expect(savedProduct.updatedAt).toBeDefined();
            });
        });

        describe('attribute: productNumber', () => {
            it('should generate the attribute in the correct format', async () => {
                const expectedProductNumber1 = `${savedCustomer.customerId}-001`;
                const expectedProductNumber2 = `${savedCustomer.customerId}-002`;
                const expectedProductNumber3 = `${savedCustomer.customerId}-003`;

                const product1 = new ProductModel(productAttributes);
                const product2 = new ProductModel(productAttributes);
                const product3 = new ProductModel(productAttributes);

                let savedProduct1 = await product1.save({ validateBeforeSave: false });
                let savedProduct2 = await product2.save({ validateBeforeSave: false });
                let savedProduct3 = await product3.save({ validateBeforeSave: false });

                expect(savedProduct1.productNumber).toBe(expectedProductNumber1);
                expect(savedProduct2.productNumber).toBe(expectedProductNumber2);
                expect(savedProduct3.productNumber).toBe(expectedProductNumber3);
            });
        });

        describe('attribute: pressCount', () => {
            it('should generate the attribute according to the correct formula', async () => {
                productAttributes.labelsPerRoll = chance.d100();
                productAttributes.dieId = savedDie._id;
                const product = new ProductModel(productAttributes);
                let savedProduct = await product.save({ validateBeforeSave: false });

                const expectedPressCount = (dieAttributes.sizeAround + dieAttributes.spaceAround) * (productAttributes.labelsPerRoll / 10); // eslint-disable-line no-magic-numbers

                expect(savedProduct.pressCount).toEqual(expectedPressCount);
            });
        });

        describe('attribute: overrun', () => {
            it('should default product.overrun to customer.overrun when product is initially created', async () => {
                const expectedOverrun = savedCustomer.overrun;
                const product = new ProductModel(productAttributes);
                let savedProduct = await product.save({ validateBeforeSave: false });
                
                expect(savedProduct.overrun).toEqual(expectedOverrun);
            });

            it('should NOT use the value from customer.overrun if product.overrun is EXPLICITLY set to equal 0', async () => {
                const product = new ProductModel(productAttributes);
                let savedProduct = await product.save({ validateBeforeSave: false });

                savedProduct.overrun = 0; // EXPLICITLY set to 0
                savedProduct = await savedProduct.save({ validateBeforeSave: false });
                
                expect(savedProduct.overrun).toEqual(0);
            });
        });

        describe('attribute: frameNumberAcross', () => {
            it('should have a default value if not defined', async () => {
                delete productAttributes.frameNumberAcross;
                const product = new ProductModel(productAttributes);
                const expectedDefaultValue = Math.floor((savedDie.sizeAcross + savedDie.spaceAcross) / savedPrimaryMaterial.width);

                const savedProduct = await product.save({ validateBeforeSave: false });

                expect(savedProduct.frameNumberAcross).toEqual(expectedDefaultValue);
            });

            it('should be overridable by the user', async () => {
                const expectedFrameNumberAcross = chance.floating({ min: 1, max: 100 });
                productAttributes.frameNumberAcross = expectedFrameNumberAcross;
                const product = new ProductModel(productAttributes);

                const savedProduct = await product.save({ validateBeforeSave: false });

                expect(savedProduct.frameNumberAcross).toEqual(expectedFrameNumberAcross);
            });
        });

        describe('attribute: frameNumberAround', () => {
            it('should have a default value if not defined', async () => {
                delete productAttributes.frameNumberAround;
                const product = new ProductModel(productAttributes);
                const expectedDefaultValueInInches = Math.floor((constantsEnum.MAX_FRAME_LENGTH_INCHES / (savedDie.sizeAround + savedDie.spaceAround)));

                const savedProduct = await product.save({ validateBeforeSave: false });

                expect(savedProduct.frameNumberAround).toEqual(expectedDefaultValueInInches);
            });

            it('should be overridable by the user', async () => {
                const expectedFrameNumberAround = chance.floating({ min: 1, max: 100 });
                productAttributes.frameNumberAround = expectedFrameNumberAround;
                const product = new ProductModel(productAttributes);

                const savedProduct = await product.save({ validateBeforeSave: false });

                expect(savedProduct.frameNumberAround).toEqual(expectedFrameNumberAround);
            });

            it('should round the value down to the nearest whole even number if die.sizeAround <= 1', async () => {
                delete productAttributes.frameNumberAround;
                
                await DieModel.findByIdAndUpdate(savedDie._id, { sizeAround: 0.69 }, { runValidators: false });
                savedDie = await DieModel.findById(savedDie._id);

                const valueBeforeRoundingToDownToNearestEvenNumber = Math.floor(constantsEnum.MAX_FRAME_LENGTH_INCHES / (savedDie.sizeAround + savedDie.spaceAround));
                const expectedFrameNumberAround = roundDownToNearestEvenNumber(valueBeforeRoundingToDownToNearestEvenNumber);

                const savedProduct = await new ProductModel(productAttributes).save({ validateBeforeSave: false });

                expect(savedProduct.frameNumberAround).toEqual(expectedFrameNumberAround);
            });
        });

        describe('attribute: frameRepeat', () => {
            it('should have the correct computed value', async () => {
                delete productAttributes.frameRepeat; // This value is NOT user definable. It is computed automatically upon saving the product
                const frameRepeatInInches = Math.floor(constantsEnum.MAX_FRAME_LENGTH_INCHES / (savedDie.sizeAround + savedDie.spaceAround)) * (savedDie.sizeAround + savedDie.spaceAround);
                const frameRepeatInMillimeters = frameRepeatInInches * MILLIMETERS_PER_INCH;

                const savedProduct = await new ProductModel(productAttributes).save({ validateBeforeSave: false });

                expect(savedProduct.frameRepeat).toEqual(frameRepeatInMillimeters);
            });
        });
    });
});
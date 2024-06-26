const chance = require('chance').Chance();
const ProductModel = require('../../application/models/baseProduct');
const mongoose = require('mongoose');
const databaseService = require('../../application/services/databaseService');
const CustomerModel = require('../../application/models/customer');
const MaterialModel = require('../../application/models/material');
const { defaultUnwindDirection, unwindDirections } = require('../../application/enums/unwindDirectionsEnum');
const { finishTypes, defaultFinishType } = require('../../application/enums/finishTypesEnum');
const DieModel = require('../../application/models/Die');

const testDataGenerator = require('../testDataGenerator');

describe('Product Model', () => {
    let productAttributes;

    beforeEach(() => {
        productAttributes = {
            customer: new mongoose.Types.ObjectId(),
            die: new mongoose.Types.ObjectId(),
            primaryMaterial: new mongoose.Types.ObjectId(),
            finish: new mongoose.Types.ObjectId(),
            author: new mongoose.Types.ObjectId(),
            ...testDataGenerator.mockData.SharedBaseProductAttributes()
        };
    });

    it('should validate when attributes are defined correctly', () => {
        const product = new ProductModel(productAttributes);

        const error = product.validateSync();

        expect(error).not.toBeDefined();
    });

    it('should throw an error if an unknown attribute is defined', () => {
        const unknownAttribute = chance.string();
       
        productAttributes[unknownAttribute] = chance.string();

        expect(() => new ProductModel(productAttributes)).toThrow();
    });

    describe('attribute: customer', () => {
        it('should be required', () => {
            delete productAttributes.customer;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a valid mongoose ObjectId', () => {
            const product = new ProductModel(productAttributes);

            expect(product.customer).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should fail if attribute is not a valid mongoose ObjectId', () => {
            productAttributes.customer = chance.word();
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

    describe('attribute: die', () => {
        it('should be required', () => {
            delete productAttributes.die;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a valid mongoose ObjectId', () => {
            const product = new ProductModel(productAttributes);

            expect(product.die).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should fail if attribute is not a valid mongoose ObjectId', () => {
            productAttributes.die = chance.word();
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: unwindDirection', () => {
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

        it('should be a number', () => {
            productAttributes.unwindDirection = chance.pickone(unwindDirections);
            
            const product = new ProductModel(productAttributes);
            
            expect(product.unwindDirection).toEqual(expect.any(Number));
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

    describe('attribute: primaryMaterial', () => {
        it('should be required', () => {
            delete productAttributes.primaryMaterial;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a valid mongoose ObjectId', () => {
            const product = new ProductModel(productAttributes);
            
            expect(product.primaryMaterial).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should fail if attribute is not a valid mongoose ObjectId', () => {
            productAttributes.primaryMaterial = chance.word();
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
            productAttributes.secondaryMaterial = new mongoose.Types.ObjectId();
            
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
        it('should NOT be required', () => {
            delete productAttributes.finish;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).not.toBeDefined();
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
    
    describe('attribute: customer', () => {
        it('should be required', () => {
            delete productAttributes.customer;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a valid mongoose ObjectId', () => {
            const product = new ProductModel(productAttributes);
            
            expect(product.customer).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should fail validation if attribute is not a valid mongoose ObjectId', () => {
            productAttributes.customer = chance.word();
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: author', () => {
        it('should be required', () => {
            delete productAttributes.author;
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a valid mongoose ObjectId', () => {
            const product = new ProductModel(productAttributes);

            expect(product.author).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should fail validation if attribute is not a valid mongoose ObjectId', () => {
            productAttributes.author = chance.word();
            const product = new ProductModel(productAttributes);
            
            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: spotPlate', () => {
        it('should default to FALSE', () => {
            const expectedDefaultValue = false;
            delete productAttributes.spotPlate;

            const product = new ProductModel(productAttributes);

            expect(product.spotPlate).toBe(expectedDefaultValue);
        });

        it('should use defined value instead of default value', () => {
            const definedValue = true;
            productAttributes.spotPlate = definedValue;

            const product = new ProductModel(productAttributes);
            
            expect(product.spotPlate).toEqual(definedValue);
        });
    });

    describe('attribute: numberOfColors', () => {
        it('should be required', () => {
            delete productAttributes.numberOfColors;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            const product = new ProductModel(productAttributes);

            expect(product.numberOfColors).toEqual(expect.any(Number));
        });

        it('should be a whole number', () => {
            const nonWholeNumber = chance.floating({ min: 1 });
            productAttributes.numberOfColors = nonWholeNumber;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a non-negative number', () => {
            const negativeNumber = chance.d100() * -1;
            productAttributes.numberOfColors = negativeNumber;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: frameNumberAcross', () => {
        it('should not be required', () => {
            delete productAttributes.frameNumberAcross;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            productAttributes.frameNumberAcross = chance.d100();
            
            const product = new ProductModel(productAttributes);

            expect(product.frameNumberAcross).toEqual(expect.any(Number));
        });

        it('should fail if value is negative', () => {
            productAttributes.frameNumberAcross = chance.d100() * -1;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: frameNumberAround', () => {
        it('should not be required', () => {
            delete productAttributes.frameNumberAround;
            const product = new ProductModel(productAttributes);

            const error = product.validateSync();

            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            productAttributes.frameNumberAround = chance.d100();
            
            const product = new ProductModel(productAttributes);

            expect(product.frameNumberAround).toEqual(expect.any(Number));
        });

        it('should fail if value is negative', () => {
            productAttributes.frameNumberAround = chance.d100() * -1;
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

        beforeAll(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        beforeEach(async () => {
            const customerAttributes = testDataGenerator.mockData.Customer();
            const customer = new CustomerModel(customerAttributes);
            savedCustomer = await customer.save();
            productAttributes.customer = savedCustomer._id;

            dieAttributes = testDataGenerator.mockData.Die();
            const die = new DieModel(dieAttributes);

            const materialAttributes = testDataGenerator.mockData.Material();
            const primaryMaterial = new MaterialModel(materialAttributes);

            savedDie = await die.save();
            savedPrimaryMaterial = await primaryMaterial.save();

            productAttributes.die = savedDie._id;
            productAttributes.primaryMaterial = savedPrimaryMaterial._id;
        });

        afterEach(async () => {
            await databaseService.clearDatabase();
        });

        afterAll(async () => {
            await databaseService.closeDatabase();
        });

        it('should have a timestamps once object is saved', async () => {
            const product = new ProductModel(productAttributes);

            let savedProduct = await product.save();

            expect(savedProduct.createdAt).toBeDefined();
            expect(savedProduct.updatedAt).toBeDefined();
        });

        it('should soft delete items', async () => {
            const product = new ProductModel(productAttributes);
            const productId = product._id;

            await product.save();
            await ProductModel.deleteById(productId);

            const softDeletedProduct = await ProductModel.findOneDeleted({_id: productId}).exec();

            expect(softDeletedProduct).toBeDefined();
            expect(softDeletedProduct.deleted).toBe(true);
        });

        describe('attribute: productNumber', () => {
            it('should generate the attribute in the correct format', async () => {
                const expectedProductNumber1 = `${savedCustomer.customerId}-001`;
                const expectedProductNumber2 = `${savedCustomer.customerId}-002`;
                const expectedProductNumber3 = `${savedCustomer.customerId}-003`;

                const product1 = new ProductModel(productAttributes);
                const product2 = new ProductModel(productAttributes);
                const product3 = new ProductModel(productAttributes);

                let savedProduct1 = await product1.save();
                let savedProduct2 = await product2.save();
                let savedProduct3 = await product3.save();

                expect(savedProduct1.productNumber).toBe(expectedProductNumber1);
                expect(savedProduct2.productNumber).toBe(expectedProductNumber2);
                expect(savedProduct3.productNumber).toBe(expectedProductNumber3);
            });
        });

        describe('attribute: overun', () => {
            it('should default product.secondaryMaterial to customer.overun when product is initially created', async () => {
                const expectedOverun = savedCustomer.overun;
                const product = new ProductModel(productAttributes);
                let savedProduct = await product.save();
                
                expect(savedProduct.overun).toBeDefined();
                expect(savedProduct.overun).toEqual(expectedOverun);
            });

            it('should NOT use the value from customer.overun if product.overun is EXPLICITLY set to equal 0', async () => {
                const product = new ProductModel(productAttributes);
                let savedProduct = await product.save();

                savedProduct.overun = 0; // EXPLICITLY set to 0
                savedProduct = await savedProduct.save();
                
                expect(savedProduct.overun).toEqual(0);
            });
        });
    });
});
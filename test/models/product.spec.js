const chance = require('chance').Chance();
const ProductModel = require('../../application/models/product');
const mongoose = require('mongoose');
const databaseService = require('../../application/services/databaseService');
const CustomerModel = require('../../application/models/customer');
const { unwindDirections, defaultUnwindDirection } = require('../../application/enums/unwindDirectionsEnum');

describe('Product Model', () => {
    let productAttributes;

    beforeEach(() => {
        productAttributes = {
            customerId: mongoose.Types.ObjectId(),
            productDescription: chance.string(),
            die: mongoose.Types.ObjectId(),
            unwindDirection: chance.pickone(unwindDirections)
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

    describe('verify database interactions', () => {
        let savedCustomer;

        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();

            const customer = new CustomerModel({ customerId: chance.word() });
            savedCustomer = await customer.save({ validateBeforeSave: false }); 

            productAttributes.customerId = savedCustomer._id;
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        describe('verify timestamps on created object', () => {
            it('should have a "createdAt" attribute once object is saved', async () => {
                const product = new ProductModel(productAttributes);

                let savedProduct = await product.save();

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

                let savedProduct1 = await product1.save();
                let savedProduct2 = await product2.save();
                let savedProduct3 = await product3.save();

                expect(savedProduct1.productNumber).toBe(expectedProductNumber1);
                expect(savedProduct2.productNumber).toBe(expectedProductNumber2);
                expect(savedProduct3.productNumber).toBe(expectedProductNumber3);
            });
        });
    });
});
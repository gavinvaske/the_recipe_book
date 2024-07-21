import mongoose from 'mongoose'
import Chance from 'chance'
import purchasedProductSchema from '../../application/schemas/purchasedProduct';
import * as databaseService from '../../application/services/databaseService.js';

const chance = Chance();

describe('File: purchasedProductSchema.js', () => {
    let purchasedProductAttributes, PurchasedProduct;

    beforeEach(() => {
        purchasedProductAttributes = {
            baseProduct: new mongoose.Types.ObjectId(),
            labelQuantity: chance.d100(),
            numberOfFinishedRolls: chance.d100(),
            finishedLabelQuantity: chance.d100()
        };
        PurchasedProduct = mongoose.model('PurchasedProduct', purchasedProductSchema);
    });

    it('should pass validation if all required attributes are defined correctly', () => {
        const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);
        
        const error = purchasedProduct.validateSync();
        
        expect(error).toBeUndefined();
    });

    describe('attribute: baseProduct', () => {
        it('should be required', () => {
            delete purchasedProductAttributes.baseProduct;
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);
            
            const error = purchasedProduct.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a valid mongoose ObjectId', () => {
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);

            expect(purchasedProduct.baseProduct).toEqual(expect.any(mongoose.Types.ObjectId));
            expect(purchasedProduct.baseProduct).toBe(purchasedProduct.baseProduct);
        });
    });

    describe('attribute: labelQuantity', () => {
        it('should be a number', () => {
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);

            expect(purchasedProduct.labelQuantity).toEqual(expect.any(Number));
        });

        it('should NOT be required', () => {
            delete purchasedProductAttributes.labelQuantity;
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);
            
            const error = purchasedProduct.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should not be negative', () => {
            const negativeValue = -1;
            purchasedProductAttributes.labelQuantity = negativeValue;
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);
            
            const error = purchasedProduct.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: numberOfFinishedRolls', () => {
        it('should be a number', () => {
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);

            expect(purchasedProduct.numberOfFinishedRolls).toEqual(expect.any(Number));
        });

        it('should NOT be required', () => {
            delete purchasedProductAttributes.numberOfFinishedRolls;
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);
            
            const error = purchasedProduct.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete purchasedProductAttributes.numberOfFinishedRolls;
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);

            expect(purchasedProduct.numberOfFinishedRolls).toEqual(0);
        });

        it('should not be negative', () => {
            const negativeValue = -1;
            purchasedProductAttributes.numberOfFinishedRolls = negativeValue;
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);
            
            const error = purchasedProduct.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: finishedLabelQuantity', () => {
        it('should be a number', () => {
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);

            expect(purchasedProduct.finishedLabelQuantity).toEqual(expect.any(Number));
        });

        it('should NOT be required', () => {
            delete purchasedProductAttributes.finishedLabelQuantity;
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);
            
            const error = purchasedProduct.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete purchasedProductAttributes.finishedLabelQuantity;
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);

            expect(purchasedProduct.finishedLabelQuantity).toEqual(0);
        });

        it('should not be negative', () => {
            const negativeValue = -1;
            purchasedProductAttributes.finishedLabelQuantity = negativeValue;
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);
            
            const error = purchasedProduct.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('database interactions', () => {
        beforeAll(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.clearDatabase();
        });

        afterAll(async () => {
            await databaseService.closeDatabase();
        });

        it('should have a "createdAt" attribute once object is saved', async () => {
            const purchasedProduct = new PurchasedProduct(purchasedProductAttributes);
            let savedPurchasedProduct = await purchasedProduct.save();

            expect(savedPurchasedProduct.createdAt).toBeDefined();
            expect(savedPurchasedProduct.updatedAt).toBeDefined();
        });
    });
});
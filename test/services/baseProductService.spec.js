const BaseProductModel = require('../../application/models/baseProduct');
const databaseService = require('../../application/services/databaseService');
const testDataGenerator = require('../testDataGenerator');

const FinishModel = require('../../application/models/finish');
const MaterialModel = require('../../application/models/material');
const CustomerModel = require('../../application/models/customer');

const baseProductService = require('../../application/services/baseProductService');

describe('File: baseProduct.js', () => {
    let baseProductAttributes, baseProduct, primaryMaterial, secondaryMaterial, finish, customer;

    describe('verify database interactions', () => {
        describe('Function: getCombinedMaterialThicknessByBaseProductId()', () => {
            beforeEach(async () => {
                await databaseService.connectToTestMongoDatabase();
                const primaryMaterialAttributes = testDataGenerator.mockData.Material();
                const secondaryMaterialAttributes = testDataGenerator.mockData.Material();
                const finishAttributes = testDataGenerator.mockData.Finish();
                const customerAttributes = testDataGenerator.mockData.Customer();

                primaryMaterial = new MaterialModel(primaryMaterialAttributes);
                secondaryMaterial = new MaterialModel(secondaryMaterialAttributes);
                finish = new FinishModel(finishAttributes);
                customer = new CustomerModel(customerAttributes);
                
                await primaryMaterial.save();
                await secondaryMaterial.save();
                await finish.save();
                await customer.save();

                baseProductAttributes = {
                    finish: finish._id,
                    primaryMaterial: primaryMaterial._id,
                    secondaryMaterial: secondaryMaterial._id,
                    customer: customer._id
                };
                baseProduct = new BaseProductModel(baseProductAttributes);

                await baseProduct.save({ validateBeforeSave: false });
            });

            afterEach(async () => {
                await databaseService.closeDatabase();
            });

            it('should compute the combined material thickness correctly', async () => {
                const expectectedCombinedMaterialThickness = primaryMaterial.thickness + secondaryMaterial.thickness + finish.thickness;
                
                const actualCombinedMaterialThickness = await baseProductService.getCombinedMaterialThicknessByBaseProductId(baseProduct._id);

                expect(actualCombinedMaterialThickness).not.toBeFalsy();
                expect(actualCombinedMaterialThickness).toBe(expectectedCombinedMaterialThickness);
            });

            it('should compute the material thickness correctly when secondaryMaterial is not defined', async () => {
                baseProductAttributes = {
                    ...baseProductAttributes,
                    secondaryMaterial: undefined
                };
                baseProduct = new BaseProductModel(baseProductAttributes);
                await baseProduct.save({ validateBeforeSave: false });
                const expectectedCombinedMaterialThickness = primaryMaterial.thickness + finish.thickness;
                
                const actualCombinedMaterialThickness = await baseProductService.getCombinedMaterialThicknessByBaseProductId(baseProduct._id);

                expect(actualCombinedMaterialThickness).not.toBeFalsy();
                expect(actualCombinedMaterialThickness).toBe(expectectedCombinedMaterialThickness);
            });

            it('should compute the material thickness correctly when finish is not defined', async () => {
                baseProductAttributes = {
                    ...baseProductAttributes,
                    finish: undefined
                };
                baseProduct = new BaseProductModel(baseProductAttributes);
                await baseProduct.save({ validateBeforeSave: false });
                const expectectedCombinedMaterialThickness = primaryMaterial.thickness + secondaryMaterial.thickness;
                
                const actualCombinedMaterialThickness = await baseProductService.getCombinedMaterialThicknessByBaseProductId(baseProduct._id);

                expect(actualCombinedMaterialThickness).not.toBeFalsy();
                expect(actualCombinedMaterialThickness).toBe(expectectedCombinedMaterialThickness);
            });

            it('should compute the material thickness correctly when primaryMaterial is not defined', async () => {
                baseProductAttributes = {
                    ...baseProductAttributes,
                    primaryMaterial: undefined
                };
                baseProduct = new BaseProductModel(baseProductAttributes);
                await baseProduct.save({ validateBeforeSave: false });
                const expectectedCombinedMaterialThickness = secondaryMaterial.thickness + finish.thickness;
                
                const actualCombinedMaterialThickness = await baseProductService.getCombinedMaterialThicknessByBaseProductId(baseProduct._id);

                expect(actualCombinedMaterialThickness).not.toBeFalsy();
                expect(actualCombinedMaterialThickness).toBe(expectectedCombinedMaterialThickness);
            });

        });
    });
});
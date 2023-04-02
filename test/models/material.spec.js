const chance = require('chance').Chance();
const MaterialModel = require('../../application/models/material');
const mongoose = require('mongoose');

describe('validation', () => {
    let materialAttributes;

    beforeEach(() => {
        materialAttributes = {
            name: chance.string(),
            materialId: chance.string()
        };
    });

    describe('successful validation', () => {
        it('should validate when required attributes are defined', () => {
            const finish = new MaterialModel(materialAttributes);
    
            const error = finish.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should trim whitespace around "name"', () => {
            const name = chance.string();
            materialAttributes.name = ' ' + name + ' ';

            const material = new MaterialModel(materialAttributes);

            expect(material.name).toBe(name);
        });
    });

    describe('attribute: materialId', () => {
        it('should be a string', () => {
            const material = new MaterialModel(materialAttributes);

            expect(material.materialId).toEqual(expect.any(String));
        });

        it('should be required', () => {
            delete materialAttributes.materialId;
            const material = new MaterialModel(materialAttributes);
    
            const error = material.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should trim whitespace', () => {
            const materialIdWithoutWhitespace = materialAttributes.materialId;
            materialAttributes.materialId = '  ' + materialIdWithoutWhitespace + '  ';

            const material = new MaterialModel(materialAttributes);
    
            expect(material.materialId).toEqual(materialIdWithoutWhitespace);
        });
    });

    describe('attribute: vendorId', () => {
        it('should not be a required attribute', () => {
            delete materialAttributes.vendorId;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();
    
            expect(error).toBeUndefined();
        });

        it('should fail validation if the datatype is not a mongoose object ID', () => {
            const invalidVendorId = chance.word();
            materialAttributes.vendorId = invalidVendorId;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should pass validation if value is a mongoose object id', () => {
            const vendorId = new mongoose.Types.ObjectId();
            materialAttributes.vendorId = vendorId;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeUndefined();
        });

        it('should set the vendorId equal to null if an empty string is passed in', () => {
            const vendorId = '';
            materialAttributes.vendorId = vendorId;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeUndefined();
            expect(material.vendorId).toEqual(null);
        });
    });

    describe('attribute: materialCategoryId', () => {
        it('should have attribute', () => {
            materialAttributes.materialCategoryId = new mongoose.Types.ObjectId();

            const material = new MaterialModel(materialAttributes);

            expect(material.materialCategoryId).toBeDefined();
        });

        it('should fail validation if attribute is the wrong type', () => {
            materialAttributes.materialCategoryId = chance.word();
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should handle storing valid mongoose object Ids', () => {
            materialAttributes.materialCategoryId = new mongoose.Types.ObjectId();
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeUndefined();
            expect(mongoose.Types.ObjectId.isValid(material.materialCategoryId)).toBe(true);
        });

        it('should pass validation if attribute is missing', () => {
            delete materialAttributes.materialCategoryId;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeUndefined();
        });
    });
});
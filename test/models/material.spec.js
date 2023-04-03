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

    it('should validate when required attributes are defined', () => {
        const finish = new MaterialModel(materialAttributes);

        const error = finish.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: name', () => {
        it('should trim whitespace around "name"', () => {
            const name = chance.string();
            materialAttributes.name = ' ' + name + ' ';

            const material = new MaterialModel(materialAttributes);

            expect(material.name).toBe(name.toUpperCase());
        });

        it('should uppercase the attribute', () => {
            const lowerCaseName = chance.string().toLowerCase();
            materialAttributes.name = lowerCaseName;

            const material = new MaterialModel(materialAttributes);

            expect(material.name).toBe(lowerCaseName.toUpperCase());
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

    describe('attribute: vendor', () => {
        it('should not be a required attribute', () => {
            delete materialAttributes.vendor;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();
    
            expect(error).toBeUndefined();
        });

        it('should fail validation if the datatype is not a mongoose object ID', () => {
            const invalidVendor = chance.word();
            materialAttributes.vendor = invalidVendor;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should pass validation if value is a mongoose object id', () => {
            materialAttributes.vendor = new mongoose.Types.ObjectId();
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeUndefined();
        });

        it('should set the vendor equal to null if an empty string is passed in', () => {
            materialAttributes.vendor = '';
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeUndefined();
            expect(material.vendor).toEqual(null);
        });
    });

    describe('attribute: materialCategory', () => {
        it('should have attribute', () => {
            materialAttributes.materialCategory = new mongoose.Types.ObjectId();

            const material = new MaterialModel(materialAttributes);

            expect(material.materialCategory).toBeDefined();
        });

        it('should fail validation if attribute is the wrong type', () => {
            materialAttributes.materialCategory = chance.word();
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should handle storing valid mongoose object Ids', () => {
            materialAttributes.materialCategory = new mongoose.Types.ObjectId();
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeUndefined();
            expect(mongoose.Types.ObjectId.isValid(material.materialCategory)).toBe(true);
        });

        it('should pass validation if attribute is missing', () => {
            delete materialAttributes.materialCategory;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeUndefined();
        });

        it('should set the attribute to null if an empty string is passed in', () => {
            materialAttributes.materialCategory = '';
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeUndefined();
            expect(material.materialCategory).toEqual(null);
        });
    });
});
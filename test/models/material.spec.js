const chance = require('chance').Chance();
const MaterialModel = require('../../application/models/material');

describe('validation', () => {
    let materialAttributes;

    beforeEach(() => {
        jest.resetAllMocks();
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
            const finish = new MaterialModel(materialAttributes);

            expect(finish.materialId).toEqual(expect.any(String));
        });

        it('should be required', () => {
            delete materialAttributes.materialId;
            const finish = new MaterialModel(materialAttributes);
    
            const error = finish.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should trim whitespace', () => {
            const materialIdWithoutWhitespace = materialAttributes.materialId;
            materialAttributes.materialId = '  ' + materialIdWithoutWhitespace + '  ';

            const finish = new MaterialModel(materialAttributes);
    
            expect(finish.materialId).toEqual(materialIdWithoutWhitespace);
        });
    });
});
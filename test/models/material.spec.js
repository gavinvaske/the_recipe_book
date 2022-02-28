const chance = require('chance').Chance();
const MaterialModel = require('../../application/models/material');

describe('validation', () => {
    let materialAttributes;

    beforeEach(() => {
        jest.resetAllMocks();
        materialAttributes = {
            name: chance.string()
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
});
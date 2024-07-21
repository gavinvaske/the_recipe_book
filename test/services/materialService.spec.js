import Chance from 'chance'
const chance = Chance();
const materialService = require('../../application/services/materialService');

jest.mock('../../application/models/material');

describe('materialService test suite', () => {
    describe('getMaterialIds()', () => {
        let materials, materialIds;
        
        beforeEach(() => {
            materialIds = chance.n(chance.string, chance.d12());
            materials = buildMaterials(materialIds);
        });

        it('should parse materialId attribute from all materials', () => {
            const actualMaterialIds = materialService.getMaterialIds(materials);

            expect(actualMaterialIds.sort()).toEqual(materialIds.sort());
        });
    });
});

function buildMaterials(materialIds) {
    return materialIds.map((materialId) => {
        return {
            materialId
        };
    });
}
import Chance from 'chance';
import * as materialService from '../../application/api/services/materialService.ts';

const chance = Chance();

jest.mock('../../application/api/models/material.ts');

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
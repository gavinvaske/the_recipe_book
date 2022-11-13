const chance = require('chance').Chance();
const materialService = require('../../application/services/materialService');
const mockMaterialModel = require('../../application/models/material');

jest.mock('../../application/models/material');

describe('materialService test suite', () => {
    describe('getMaterialIds()', () => {
        let materials, materialIds;
        
        beforeEach(() => {
            materialIds = chance.n(chance.string, chance.integer({min: 0, max: 20}));
            materials = buildMaterials(materialIds)
        })

        it('should parse _id attribute from all materials', () => {
            const actualMaterialIds = materialService.getMaterialIds(materials);

            expect(actualMaterialIds.sort()).toEqual(materialIds.sort());
        })
    });

    describe('getAllMaterials()', () => {
        let materialsInDatabase;

        afterEach(() => {
            jest.resetAllMocks();
        });

        beforeEach(() => {
            materialsInDatabase = [];
            execFunction = jest.fn().mockResolvedValue(materialsInDatabase);
            findFunction = jest.fn().mockImplementation(() => {
                return {
                    exec: execFunction
                };
            })

            mockMaterialModel.find.mockImplementation(findFunction);
        });

        it ('should not throw error', async () => {
            await expect(materialService.getAllMaterials()).resolves.not.toThrowError();
        });
        
        it ('should search for materials from database', async () => {
            await materialService.getAllMaterials();

            expect(findFunction).toHaveBeenCalledTimes(1);
            expect(execFunction).toHaveBeenCalledTimes(1);
        });

        it ('should return empty array when no materials are found by query', async () => {
            materialsInDatabase = [];
            execFunction = jest.fn().mockResolvedValue(materialsInDatabase);
        
            const materials = await materialService.getAllMaterials();

            expect(materials).toBeDefined();
            expect(materials.length).toBe(0); // eslint-disable-line no-magic-numbers
        });

        it ('should return the materials from the database', async () => {
            materialsInDatabase = buildMaterials(chance.n(chance.string, chance.integer({min: 0, max: 100})));
            execFunction = jest.fn().mockResolvedValue(materialsInDatabase);
        
            const materials = await materialService.getAllMaterials();

            expect(materials).toBeDefined();
            expect(materials.length).toBe(materialsInDatabase.length);
        });
    });
});

function buildMaterials(materialIds) {
    return materialIds.map((materialId) => {
        return {
            _id: materialId
        }
    });
}
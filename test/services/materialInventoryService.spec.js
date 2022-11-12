const materialInventoryService = require('../../application/services/materialInventoryService');
const mockMaterialModel = require('../../application/models/material');
const mockMaterialOrderService = require('../../application/services/materialOrderService');
const chance = require('chance').Chance();

jest.mock('../../application/models/material');
jest.mock('../../application/services/materialOrderService');

describe('materialInventoryService test suite', () => {
    let execFunction,
        findFunction, 
        leanFunction,
        materialsInDatabase;
        
    afterEach(() => {
        jest.resetAllMocks();
    });
        
    beforeEach(() => {
        materialsInDatabase = [];
        execFunction = jest.fn().mockResolvedValue(materialsInDatabase);
        leanFunction = jest.fn().mockImplementation(() => {
            return {
                exec: execFunction
            };
        });
        findFunction = jest.fn().mockImplementation(() => {
            return {
                lean: leanFunction
            };
        });

        mockMaterialModel.find.mockImplementation(findFunction);
    });

    describe('getAllMaterialInventoryData()', () => {
        it ('should not throw error', async () => {
            await expect(materialInventoryService.getAllMaterialInventoryData()).resolves.not.toThrowError();
        });        
        
        it ('should search for materials from database', async () => {
            await materialInventoryService.getAllMaterialInventoryData();

            expect(findFunction).toHaveBeenCalledTimes(1);
            expect(leanFunction).toHaveBeenCalledTimes(1);
            expect(execFunction).toHaveBeenCalledTimes(1);
        });

        it ('should return empty array when no materials are found by query', async () => {
            materialsInDatabase = [];
        
            const materials = await materialInventoryService.getAllMaterialInventoryData();

            expect(materials).toBeDefined();
            expect(materials.length).toBe(0); // eslint-disable-line no-magic-numbers
        });

        it ('should return correct data', async () => {
            materialsInDatabase = [
                {
                    [chance.string()]: chance.string()
                }
            ];
            const purchaseOrdersInDatabase = [];
            const expectedLengthOfMaterialOrdered = 87;
            const expectedLengthOfMaterialInInventory = 23;
            execFunction = jest.fn().mockResolvedValue(materialsInDatabase);

            mockMaterialOrderService.getLengthOfOneMaterialOrdered.mockReturnValue(expectedLengthOfMaterialOrdered);
            mockMaterialOrderService.getLengthOfOneMaterialInInventory.mockReturnValue(expectedLengthOfMaterialInInventory);
            mockMaterialOrderService.findPurchaseOrdersByMaterialThatHaveNotArrived.mockReturnValue(purchaseOrdersInDatabase);
        
            const materials = await materialInventoryService.getAllMaterialInventoryData();

            expect(materials).toBeDefined();
            expect(materials.length).toBe(1);
            expect(materials).toEqual([
                {
                    material: materialsInDatabase[0],
                    lengthOfMaterialOrdered: expectedLengthOfMaterialOrdered,
                    lengthOfMaterialInStock: expectedLengthOfMaterialInInventory,
                    purchaseOrdersForMaterial: purchaseOrdersInDatabase
                }
            ]);
        });
    });
});
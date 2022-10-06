const materialInventoryService = require('../../application/services/materialInventoryService');
const mockMaterialModel = require('../../application/models/material');

jest.mock('../../application/models/material');

describe('materialInventoryService test suite', () => {
    let execFunction,
        findFunction, 
        leanFunction;

    afterEach(() => {
        jest.resetAllMocks();
    });

    beforeEach(() => {
        execFunction = jest.fn();
        leanFunction = jest.fn().mockImplementation(() => {
            return {
                exec: execFunction
            }
        });
        findFunction = jest.fn().mockImplementation(() => {
            return {
                lean: leanFunction
            }
        });

        mockMaterialModel.find.mockImplementation(findFunction);
    });

    describe('getAllMaterialInventoryData()', () => {
        it ('should not throw error', async () => {
            await expect(materialInventoryService.getAllMaterialInventoryData()).resolves.not.toThrowError();
        });        
        
        it ('should not throw error', async () => {
            await materialInventoryService.getAllMaterialInventoryData();

            expect(findFunction).toHaveBeenCalledTimes(1);
            expect(leanFunction).toHaveBeenCalledTimes(1);
            expect(execFunction).toHaveBeenCalledTimes(1);
        });
    })
});
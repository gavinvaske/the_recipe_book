const materialOrderService = require('../../application/services/materialOrderService');
const mockPurchaseOrderModel = require('../../application/models/materialOrder');
const chance = require('chance').Chance();

jest.mock('../../application/models/materialOrder');

describe('materialOrderService test suite', () => {
    let purchaseOrdersInDatabase,
        execFunction,
        findFunction,
        materialId;

    afterEach(() => {
        jest.resetAllMocks();
    });

    beforeEach(() => {
        materialId = chance.string();
        purchaseOrdersInDatabase = [];
        execFunction = jest.fn().mockResolvedValue(purchaseOrdersInDatabase);
        findFunction = jest.fn().mockImplementation(() => {
            return {
                exec: execFunction
            };
        });

        mockPurchaseOrderModel.find.mockImplementation(findFunction);
    });

    describe('getNumberOfPurchaseOrders()', () => {
        it('should not throw errors', async () => {
            await expect(materialOrderService.getNumberOfPurchaseOrders()).resolves.not.toThrowError();   
        });
        
        it('should query the database for purchase orders', async () => {
            await materialOrderService.getNumberOfPurchaseOrders();

            expect(findFunction).toHaveBeenCalledTimes(1);
            expect(execFunction).toHaveBeenCalledTimes(1);
        });

        it('should return the number of purchaseOrders in the database', async () => {
            const expectedNumberOfPurchaseOrders = chance.integer({min: 1, max: 100});
            purchaseOrdersInDatabase = generatePurchaseOrders(expectedNumberOfPurchaseOrders);
            execFunction = jest.fn().mockResolvedValue(purchaseOrdersInDatabase);

            const actualNumberOfPurchaseOrders = await materialOrderService.getNumberOfPurchaseOrders();

            console.log(`actualNumberOfPurchaseOrders +> ${actualNumberOfPurchaseOrders}`);

            expect(actualNumberOfPurchaseOrders).toBe(expectedNumberOfPurchaseOrders);
        });
    });

    describe('getLengthOfAllMaterialsOrdered()', () => {
        it('should not throw errors', async () => {
            await expect(materialOrderService.getLengthOfAllMaterialsOrdered()).resolves.not.toThrowError();   
        });

        it('should return 0 when no purchase orders exist in the database', async () => {
            const expectedLengthOfPurchasedMaterial = 0;

            const actualLengthOfPurchasedMaterial = await materialOrderService.getLengthOfAllMaterialsOrdered();

            expect(actualLengthOfPurchasedMaterial).toBe(expectedLengthOfPurchasedMaterial);
        });

        it('should return length of materials purchased', async () => {
            purchaseOrdersInDatabase = [
                buildPurchaseOrderObject(),
                buildPurchaseOrderObject()
            ];
            const expectedLengthOfPurchasedMaterial = 
                (purchaseOrdersInDatabase[0].totalRolls * purchaseOrdersInDatabase[0].feetPerRoll)
                + (purchaseOrdersInDatabase[1].totalRolls * purchaseOrdersInDatabase[1].feetPerRoll);
            execFunction = jest.fn().mockResolvedValue(purchaseOrdersInDatabase);

            const actualLengthOfPurchasedMaterial = await materialOrderService.getLengthOfAllMaterialsOrdered();

            expect(actualLengthOfPurchasedMaterial).toBe(expectedLengthOfPurchasedMaterial);
        });
    });

    describe('getLengthOfAllMaterialsInInventory()', () => {
        it('should not throw errors', async () => {
            await expect(materialOrderService.getLengthOfAllMaterialsInInventory()).resolves.not.toThrowError();   
        });

        it('should return 0 when no purchase orders exist in the database', async () => {
            const expectedLengthOfPurchasedMaterial = 0;

            const actualLengthOfPurchasedMaterial = await materialOrderService.getLengthOfAllMaterialsInInventory();

            expect(actualLengthOfPurchasedMaterial).toBe(expectedLengthOfPurchasedMaterial);
        });

        it('should return length of materials purchased that have arrived', async () => {
            purchaseOrdersInDatabase = [
                buildPurchaseOrderObject({hasArrived: true}),
                buildPurchaseOrderObject({hasArrived: false})
            ];
            const expectedLengthOfPurchasedMaterial = purchaseOrdersInDatabase[0].totalRolls * purchaseOrdersInDatabase[0].feetPerRoll;
            execFunction = jest.fn().mockResolvedValue(purchaseOrdersInDatabase);

            const actualLengthOfPurchasedMaterial = await materialOrderService.getLengthOfAllMaterialsInInventory();

            expect(actualLengthOfPurchasedMaterial).toBe(expectedLengthOfPurchasedMaterial);
        });
    });

    describe('getLengthOfOneMaterialInInventory()', () => {
        it('should not throw error if purchase order is not found using the provided materialId', async () => {
            await expect(materialOrderService.getLengthOfOneMaterialInInventory(materialId)).resolves.not.toThrowError();   
        });

        it('should use the correct query when performing the search', async () => {
            const expectedQuery = {
                material: materialId
            };

            await materialOrderService.getLengthOfOneMaterialInInventory(materialId);

            expect(JSON.stringify(findFunction.mock.calls[0][0])).toBe(JSON.stringify(expectedQuery))
        });

        it('should return length of 0 if no purchase order is found for the given materialId', async () => {
            const expectedLength = 0;

            const actualLength = await materialOrderService.getLengthOfOneMaterialInInventory(materialId);

            expect(actualLength).toBe(expectedLength);
        });

        it('should return the correct length of material in inventory from purchaseOrders queried for using materialId', async () => {
            purchaseOrdersInDatabase = [
                buildPurchaseOrderObject({hasArrived: true}),
                buildPurchaseOrderObject({hasArrived: false}),
                buildPurchaseOrderObject({hasArrived: true})
            ];
            const expectedLength = 
                (purchaseOrdersInDatabase[0].totalRolls * purchaseOrdersInDatabase[0].feetPerRoll)
                + (purchaseOrdersInDatabase[2].totalRolls * purchaseOrdersInDatabase[2].feetPerRoll);;
            execFunction = jest.fn().mockResolvedValue(purchaseOrdersInDatabase);

            const actualLength = await materialOrderService.getLengthOfOneMaterialInInventory(materialId);

            expect(actualLength).toBe(expectedLength);
        });
    });

    describe('getLengthOfOneMaterialOrdered()', () => {
        it('should not throw error if purchase order is not found using the provided materialId', async () => {
            await expect(materialOrderService.getLengthOfOneMaterialOrdered(materialId)).resolves.not.toThrowError();   
        });

        it('should use the correct query when performing the search', async () => {
            const expectedQuery = {
                material: materialId
            };

            await materialOrderService.getLengthOfOneMaterialOrdered(materialId);

            expect(JSON.stringify(findFunction.mock.calls[0][0])).toBe(JSON.stringify(expectedQuery))
        });

        it('should return length of 0 if no purchase order is found for the given materialId', async () => {
            const expectedLength = 0;

            const actualLength = await materialOrderService.getLengthOfOneMaterialOrdered(materialId);

            expect(actualLength).toBe(expectedLength);
        });

        it('should return the correct length of material in inventory from purchaseOrders queried for using materialId', async () => {
            purchaseOrdersInDatabase = [
                buildPurchaseOrderObject({hasArrived: chance.bool()}),
                buildPurchaseOrderObject({hasArrived: chance.bool()}),
                buildPurchaseOrderObject({hasArrived: chance.bool()})
            ];
            const expectedLength = 
                (purchaseOrdersInDatabase[0].totalRolls * purchaseOrdersInDatabase[0].feetPerRoll)
                + (purchaseOrdersInDatabase[1].totalRolls * purchaseOrdersInDatabase[1].feetPerRoll)
                + (purchaseOrdersInDatabase[2].totalRolls * purchaseOrdersInDatabase[2].feetPerRoll);;
            execFunction = jest.fn().mockResolvedValue(purchaseOrdersInDatabase);

            const actualLength = await materialOrderService.getLengthOfOneMaterialOrdered(materialId);

            expect(actualLength).toBe(expectedLength);
        });
    });

    describe('findPurchaseOrdersByMaterialThatHaveNotArrived()', () => {
        it('should not throw error if purchase order is not found using the provided materialId', async () => {
            await expect(materialOrderService.findPurchaseOrdersByMaterialThatHaveNotArrived(materialId)).resolves.not.toThrowError();   
        });        
        
        it('should use the correct query when performing the search', async () => {
            const expectedQuery = {
                $and:[
                    {material: materialId},
                    {hasArrived: false},
                ]
            };

            await materialOrderService.findPurchaseOrdersByMaterialThatHaveNotArrived(materialId);

            expect(JSON.stringify(findFunction.mock.calls[0][0])).toBe(JSON.stringify(expectedQuery))
        });

        it('should return length of 0 if no purchase order is found for the given materialId', async () => {
            const expectedNumberOfPurchaseOrdersFound = 0;

            const purchaseOrdersFound = await materialOrderService.findPurchaseOrdersByMaterialThatHaveNotArrived(materialId);

            expect(purchaseOrdersFound.length).toBe(expectedNumberOfPurchaseOrdersFound);
        });

        it('should return the correct number of purchaseOrders queried for using materialId', async () => {
            purchaseOrdersInDatabase = chance.n(buildPurchaseOrderObject, chance.integer({min: 1, max: 100}));
            const expectedLength = purchaseOrdersInDatabase.length;
            execFunction = jest.fn().mockResolvedValue(purchaseOrdersInDatabase);

            const purchaseOrdersFound = await materialOrderService.findPurchaseOrdersByMaterialThatHaveNotArrived(materialId);

            expect(purchaseOrdersFound.length).toBe(expectedLength);
        });
    });
});


function generatePurchaseOrders(numberOfPurchaseOrdersToGenerate) {
    let purchaseOrders = [];

    for (let i=0; i < numberOfPurchaseOrdersToGenerate; i++) {
        const purchaseOrder = {};
        purchaseOrders.push(purchaseOrder);
    }

    return purchaseOrders;
}

function buildPurchaseOrderObject(additionalAttributes) {
    return {
        totalRolls: chance.integer({min: 1}),
        feetPerRoll: chance.integer({min: 1}),
        ...additionalAttributes
    };
}
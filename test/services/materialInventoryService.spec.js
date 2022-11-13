const chance = require('chance').Chance();
const materialInventoryService = require('../../application/services/materialInventoryService');
const mockPurchaseOrderService = require('../../application/services/purchaseOrderService');

jest.mock('../../application/services/purchaseOrderService');

describe('materialInventoryService test suite', () => {
    describe('mapMaterialIdToPurchaseOrders()', () => {
        it('should map correct materialId to associated purchaseOrders', () => {
            const firstMaterialId = chance.string();
            const secondMaterialId = chance.string();
            const materialIds = [firstMaterialId, secondMaterialId];
            const firstMaterialPurchaseOrders = [
                buildPurchaseOrder(firstMaterialId)
            ];
            const secondMaterialPurchaseOrders = [
                buildPurchaseOrder(secondMaterialId),
                buildPurchaseOrder(secondMaterialId),
                buildPurchaseOrder(secondMaterialId),
            ];
            const purchaseOrders = [
                ...firstMaterialPurchaseOrders,
                ...secondMaterialPurchaseOrders
            ];

            const actualMaterialIdToPurchaseOrders = materialInventoryService.mapMaterialIdToPurchaseOrders(materialIds, purchaseOrders);

            expect(actualMaterialIdToPurchaseOrders[firstMaterialId].length).toBe(firstMaterialPurchaseOrders.length);
            expect(actualMaterialIdToPurchaseOrders[secondMaterialId].length).toBe(secondMaterialPurchaseOrders.length);
        });

        it('should map correct materialId to associated purchaseOrders', () => {
            const firstMaterialId = chance.string();
            const secondMaterialId = chance.string();
            const materialIds = [firstMaterialId, secondMaterialId];
            const purchaseOrders = [];
            const emptyArray = [];

            const actualMaterialIdToPurchaseOrders = materialInventoryService.mapMaterialIdToPurchaseOrders(materialIds, purchaseOrders);

            expect(actualMaterialIdToPurchaseOrders[firstMaterialId]).toEqual(emptyArray);
            expect(actualMaterialIdToPurchaseOrders[secondMaterialId]).toEqual(emptyArray);
        });
    });

    describe('buildMaterialInventory', () => {
        let purchaseOrdersThatHaveArrived, purchaseOrdersThatHaveNotArrived, material, purchaseOrders;

        afterEach(() => {
            jest.resetAllMocks();
        });

        beforeEach(() => {
            material = {};
            purchaseOrdersThatHaveArrived = [
                buildPurchaseOrder(chance.string()),
                buildPurchaseOrder(chance.string())
            ];
            purchaseOrdersThatHaveNotArrived = [
                buildPurchaseOrder(chance.string())
            ];
            purchaseOrders = [
                ...purchaseOrdersThatHaveArrived,
                ...purchaseOrdersThatHaveNotArrived
            ];
            mockPurchaseOrderService.findPurchaseOrdersThatHaveArrived.mockReturnValue(purchaseOrdersThatHaveArrived);
            mockPurchaseOrderService.findPurchaseOrdersThatHaveNotArrived.mockReturnValue(purchaseOrdersThatHaveNotArrived);
            mockPurchaseOrderService.computeLengthOfMaterial.mockReturnValue(chance.integer({min: 0}));
        });
        it('should not throw an error', () => {
            expect(() => {
                materialInventoryService.buildMaterialInventory({}, []);
            }).not.toThrowError();
        });

        it('should call correct methods', () => {
            materialInventoryService.buildMaterialInventory(material, purchaseOrders);

            expect(mockPurchaseOrderService.findPurchaseOrdersThatHaveArrived).toHaveBeenCalledTimes(1);
            expect(mockPurchaseOrderService.findPurchaseOrdersThatHaveNotArrived).toHaveBeenCalledTimes(1);
            expect(mockPurchaseOrderService.computeLengthOfMaterial).toHaveBeenCalledWith(purchaseOrdersThatHaveArrived);
            expect(mockPurchaseOrderService.computeLengthOfMaterial).toHaveBeenCalledWith(purchaseOrdersThatHaveNotArrived);
        });

        it('should name this test better', () => {
            const lengthOfPurchaseOrdersThatHaveNotArrived = chance.integer({min: 1});
            const lengthOfPurchaseOrdersThatHaveArrived = chance.integer({min: 1});
            mockPurchaseOrderService.computeLengthOfMaterial.mockReturnValueOnce(lengthOfPurchaseOrdersThatHaveNotArrived).mockReturnValueOnce(lengthOfPurchaseOrdersThatHaveArrived);
            const expectedMaterialInventory = {
                material,
                lengthOfMaterialOrdered: lengthOfPurchaseOrdersThatHaveNotArrived,
                lengthOfMaterialInStock: lengthOfPurchaseOrdersThatHaveArrived,
                purchaseOrdersForMaterial: purchaseOrdersThatHaveNotArrived
            };

            const materialInventory = materialInventoryService.buildMaterialInventory(material, purchaseOrders);
        
            expect(materialInventory).toEqual(expectedMaterialInventory);
        });
    });
});

function buildPurchaseOrder(materialId) {
    return {
        material: materialId
    };
}
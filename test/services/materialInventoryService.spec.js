const chance = require('chance').Chance();
const { when } = require('jest-when');
const materialInventoryService = require('../../application/services/materialInventoryService');
const mockPurchaseOrderService = require('../../application/services/purchaseOrderService');
const mockMaterialInventoryEntryService = require('../../application/services/materialInventoryEntryService')

jest.mock('../../application/services/purchaseOrderService');
jest.mock('../../application/services/materialInventoryEntryService');

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
        let purchaseOrdersThatHaveArrived, 
            purchaseOrdersThatHaveNotArrived, 
            material,
            purchaseOrders,
            feetOfMaterialAlreadyUsedByTickets;

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
            feetOfMaterialAlreadyUsedByTickets = 0;

            when(mockPurchaseOrderService.findPurchaseOrdersThatHaveArrived)
                .calledWith(purchaseOrders)
                .mockReturnValue(purchaseOrdersThatHaveArrived);

            when(mockPurchaseOrderService.findPurchaseOrdersThatHaveNotArrived)
                .calledWith(purchaseOrders)
                .mockReturnValue(purchaseOrdersThatHaveNotArrived);

            when(mockPurchaseOrderService.computeLengthOfMaterial)
                .calledWith(purchaseOrders)
                .mockReturnValue(chance.integer({min: 0}));
        });
        it('should not throw an error', () => {
            expect(() => {
                materialInventoryService.buildMaterialInventory({}, [], feetOfMaterialAlreadyUsedByTickets);
            }).not.toThrow();
        });

        it('should call correct methods', () => {
            materialInventoryService.buildMaterialInventory(material, purchaseOrders, feetOfMaterialAlreadyUsedByTickets);

            expect(mockPurchaseOrderService.findPurchaseOrdersThatHaveArrived).toHaveBeenCalledTimes(1);
            expect(mockPurchaseOrderService.findPurchaseOrdersThatHaveNotArrived).toHaveBeenCalledTimes(1);
            expect(mockPurchaseOrderService.computeLengthOfMaterial).toHaveBeenCalledWith(purchaseOrdersThatHaveArrived);
            expect(mockPurchaseOrderService.computeLengthOfMaterial).toHaveBeenCalledWith(purchaseOrdersThatHaveNotArrived);
        });

        it('should return a materialInventory object with correctly calculated attributes', () => {
            const lengthOfMaterialOrdered = chance.integer({min: 1});
            const lengthOfMaterialInStock = chance.integer({min: 1});
            const materialLengthAdjustment = chance.integer();
            const materialIdToLengthAdjustment = {
              [material._id]: materialLengthAdjustment
            }

            when(mockPurchaseOrderService.computeLengthOfMaterial)
                .calledWith(purchaseOrdersThatHaveArrived)
                .mockReturnValue(lengthOfMaterialInStock);

            when(mockPurchaseOrderService.computeLengthOfMaterial)
                .calledWith(purchaseOrdersThatHaveNotArrived)
                .mockReturnValue(lengthOfMaterialOrdered);

            when(mockMaterialInventoryEntryService.groupInventoryEntriesByMaterial)
                .calledWith()
                .mockReturnValueOnce(materialIdToLengthAdjustment)

            feetOfMaterialAlreadyUsedByTickets = chance.integer();
            const netLengthOfMaterialInStock = lengthOfMaterialInStock - (feetOfMaterialAlreadyUsedByTickets + materialIdToLengthAdjustment);
            const expectedMaterialInventory = {
                material,
                netLengthOfMaterialInStock,
                lengthOfMaterialOrdered,
                lengthOfMaterialInStock,
                purchaseOrdersForMaterial: purchaseOrdersThatHaveNotArrived
            };

            const materialInventory = materialInventoryService.buildMaterialInventory(material, purchaseOrders, feetOfMaterialAlreadyUsedByTickets, materialIdToLengthAdjustment);
        
            expect(materialInventory).toEqual(expectedMaterialInventory);
        });
    });

    describe('computeNetLengthOfMaterialInInventory', () => {
        let materialInventories;

        it('should return 0 when input is an empty array', () => {
            materialInventories = [];
            const expectedNetLengthOfMaterial = 0;

            const actualNetLengthOfMaterial = materialInventoryService.computeNetLengthOfMaterialInInventory(materialInventories);

            expect(actualNetLengthOfMaterial).toBe(expectedNetLengthOfMaterial);
        });

        it('should return the summation of each materialInventories "netLengthOfMaterialInStock" attribute', () => {
            const netLengthOfMaterial1 = chance.integer();
            const netLengthOfMaterial2 = chance.integer();
            const netLengthOfMaterial3 = chance.integer();
            materialInventories = [
                { netLengthOfMaterialInStock: netLengthOfMaterial1 },
                { netLengthOfMaterialInStock: netLengthOfMaterial2 },
                { netLengthOfMaterialInStock: netLengthOfMaterial3 }
            ];
            const expectedNetLengthOfMaterial = netLengthOfMaterial1 + netLengthOfMaterial2 + netLengthOfMaterial3;

            const actualNetLengthOfMaterial = materialInventoryService.computeNetLengthOfMaterialInInventory(materialInventories);

            expect(actualNetLengthOfMaterial).toBe(expectedNetLengthOfMaterial);
        });
    });
});

function buildPurchaseOrder(materialId) {
    return {
        material: materialId
    };
}
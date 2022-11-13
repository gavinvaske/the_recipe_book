const purchaseOrderService = require('../services/purchaseOrderService')

module.exports.mapMaterialIdToPurchaseOrders = (materialIds, purchaseOrders) => {
    const materialIdToPurchaseOrders = {};

    materialIds.forEach((materialId) => {
        materialIdToPurchaseOrders[materialId] = [];
    });

    purchaseOrders.forEach((purchaseOrder) => {
        const materialId = purchaseOrder.material;
        
        materialIdToPurchaseOrders[materialId].push(purchaseOrder);
    });

    return materialIdToPurchaseOrders;
};

module.exports.buildMaterialInventory = (material, allPurchaseOrdersForMaterial) => {
    const purchaseOrdersThatHaveArrived = purchaseOrderService.findPurchaseOrdersThatHaveArrived(allPurchaseOrdersForMaterial);
    const purchaseOrdersThatHaveNotArrived = purchaseOrderService.findPurchaseOrdersThatHaveNotArrived(allPurchaseOrdersForMaterial);

    return {
        material,
        lengthOfMaterialOrdered: purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveNotArrived),
        lengthOfMaterialInStock: purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveArrived),
        purchaseOrdersForMaterial: purchaseOrdersThatHaveNotArrived
    };
};
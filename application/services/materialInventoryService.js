const purchaseOrderService = require('../services/purchaseOrderService');

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

module.exports.buildMaterialInventory = (material, allPurchaseOrdersForMaterial, feetOfMaterialAlreadyUsedByTickets) => {
    const purchaseOrdersThatHaveArrived = purchaseOrderService.findPurchaseOrdersThatHaveArrived(allPurchaseOrdersForMaterial);
    const purchaseOrdersThatHaveNotArrived = purchaseOrderService.findPurchaseOrdersThatHaveNotArrived(allPurchaseOrdersForMaterial);
    const lengthOfMaterialInStock = purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveArrived);

    return {
        material,
        lengthOfMaterialOrdered: purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveNotArrived),
        lengthOfMaterialInStock: lengthOfMaterialInStock,
        netLengthOfMaterialInStock: (lengthOfMaterialInStock - feetOfMaterialAlreadyUsedByTickets),
        purchaseOrdersForMaterial: purchaseOrdersThatHaveNotArrived
    };
};

module.exports.computeNetLengthOfMaterialInInventory = (materialInventories) => {
    const initialValue = 0;

    return materialInventories.reduce((accumulator, currentMaterialInventory) => {
        return accumulator + currentMaterialInventory.netLengthOfMaterialInStock;
    }, initialValue);
};
const PurchaseOrderModel = require('../models/materialOrder');

module.exports.getPurchaseOrdersForMaterials = async (materialIds) => {
    const searchQuery = {
        material: {$in: materialIds}
    };

    return await PurchaseOrderModel
        .find(searchQuery)
        .exec();
};

module.exports.findPurchaseOrdersThatHaveNotArrived = (purchaseOrders) => {
    return purchaseOrders.filter((purchaseOrder) => {
        return !purchaseOrder.hasArrived;
    });
};

module.exports.findPurchaseOrdersThatHaveArrived = (purchaseOrders) => {
    return purchaseOrders.filter((purchaseOrder) => {
        return purchaseOrder.hasArrived;
    });
};

module.exports.computeLengthOfMaterial = (purchaseOrders) => {
    let lengthOfMaterial = 0;
    
    purchaseOrders.forEach((purchaseOrder) => {
        lengthOfMaterial += getMaterialLengthOnPurchaseOrder(purchaseOrder);
    });

    return lengthOfMaterial;
};

function getMaterialLengthOnPurchaseOrder(purchaseOrder) {
    return purchaseOrder.totalRolls * purchaseOrder.feetPerRoll;
}
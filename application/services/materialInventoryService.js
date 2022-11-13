const MaterialModel = require('../models/material');
const PurchaseOrderModel = require('../models/materialOrder');

module.exports.getMaterialIds = (materials) => {
    return materials.map((material) => {
        return material._id;
    });
};

module.exports.getAllMaterials = async () => {
    return await MaterialModel
        .find()
        .exec();
};

module.exports.getPurchaseOrdersForMaterials = async (materialIds) => {
    const searchQuery = {
        material: {$in: materialIds}
    };

    return await PurchaseOrderModel
        .find(searchQuery)
        .exec();
};

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

module.exports.buildMaterialInventory = (material, allPurchaseOrdersForMaterial) => {
    const purchaseOrdersThatHaveArrived = this.findPurchaseOrdersThatHaveArrived(allPurchaseOrdersForMaterial);
    const purchaseOrdersThatHaveNotArrived = this.findPurchaseOrdersThatHaveNotArrived(allPurchaseOrdersForMaterial);

    return {
        material,
        lengthOfMaterialOrdered: this.computeLengthOfMaterial(purchaseOrdersThatHaveNotArrived),
        lengthOfMaterialInStock: this.computeLengthOfMaterial(purchaseOrdersThatHaveArrived),
        purchaseOrdersForMaterial: purchaseOrdersThatHaveNotArrived
    };
};

function getMaterialLengthOnPurchaseOrder(purchaseOrder) {
    return purchaseOrder.totalRolls * purchaseOrder.feetPerRoll;
}
const MaterialModel = require('../models/material');
const PurchaseOrderModel = require('../models/materialOrder');

module.exports.getAllMaterialInventoryData = async () => {
    let materialInventories = [];
    const materials = await MaterialModel
        .find()
        .lean()
        .exec();

    const materialIds = materials.map((material) => {
        return material._id;
    });

    const searchQuery = {
        material: {$in: materials}
    };
    const purchaseOrders = await PurchaseOrderModel
        .find(searchQuery)
        .exec();

    const materialIdToPurchaseOrders = {};

    materialIds.forEach((materialId) => {
        materialIdToPurchaseOrders[materialId] = [];
    });

    purchaseOrders.forEach((purchaseOrder) => {
        const materialId = purchaseOrder.material;
        
        materialIdToPurchaseOrders[materialId].push(purchaseOrder);
    });

    materials.forEach((material) => {
        const materialInventory = buildMaterialInventory(material, materialIdToPurchaseOrders);
        materialInventories.push(materialInventory);
    });

    const purchaseOrdersThatHaveYetToArrive = selectPurchaseOrdersThatHaveNotArrived(purchaseOrders);
    const lengthOfAllMaterialsInInventory = computeLengthOfMaterialInInventory(purchaseOrders);
    const lengthOfAllMaterialsOrdered = computeLengthOfMaterial(purchaseOrdersThatHaveYetToArrive);
    const totalPurchaseOrders = purchaseOrders.length;

    return {
        materialInventories,
        lengthOfAllMaterialsInInventory,
        lengthOfAllMaterialsOrdered,
        totalPurchaseOrders
    };
};

function buildMaterialInventory(material, materialIdToPurchaseOrders) {
    const materialId = material._id;
    const purchaseOrdersForOneMaterial = materialIdToPurchaseOrders[materialId];

    const lengthOfMaterialOrdered = computeLengthOfMaterial(purchaseOrdersForOneMaterial);
    const lengthOfMaterialInStock = computeLengthOfMaterialInInventory(purchaseOrdersForOneMaterial);
    const purchaseOrdersForMaterial = selectPurchaseOrdersThatHaveNotArrived(purchaseOrdersForOneMaterial);

    return {
        material,
        lengthOfMaterialOrdered,
        lengthOfMaterialInStock,
        purchaseOrdersForMaterial
    };
}

function computeLengthOfMaterial(purchaseOrders) {
    let lengthOfMaterial = 0;
    
    purchaseOrders.forEach((purchaseOrder) => {
        lengthOfMaterial += getTotalLengthOfMaterial(purchaseOrder);
    });

    return lengthOfMaterial;
}

function computeLengthOfMaterialInInventory(purchaseOrders) {
    let lengthOfMaterial = 0;

    purchaseOrders.forEach((purchaseOrder) => {
        if (purchaseOrder.hasArrived) {
            lengthOfMaterial += getTotalLengthOfMaterial(purchaseOrder);
        }
    });

    return lengthOfMaterial;
}

function selectPurchaseOrdersThatHaveNotArrived(purchaseOrders) {
    let purchaseOrdersThatHaveNotArrived = [];

    purchaseOrders.forEach((purchaseOrder) => {
        if (!purchaseOrder.hasArrived) {
            purchaseOrdersThatHaveNotArrived.push(purchaseOrder);
        }
    });

    return purchaseOrdersThatHaveNotArrived;
}

function getTotalLengthOfMaterial({totalRolls, feetPerRoll}) {
    return totalRolls * feetPerRoll;
}
import PurchaseOrderModel from '../models/materialOrder.js';

export async function getPurchaseOrdersForMaterials(materialIds) {
    const searchQuery = {
        material: {$in: materialIds}
    };

    return await PurchaseOrderModel
        .find(searchQuery)
        .exec();
}

export function findPurchaseOrdersThatHaveNotArrived(purchaseOrders) {
    return purchaseOrders.filter((purchaseOrder) => {
        return !purchaseOrder.hasArrived;
    });
}

export function findPurchaseOrdersThatHaveArrived(purchaseOrders) {
    return purchaseOrders.filter((purchaseOrder) => {
        return purchaseOrder.hasArrived;
    });
}

export function computeLengthOfMaterial(purchaseOrders) {
    let lengthOfMaterial = 0;
    
    purchaseOrders.forEach((purchaseOrder) => {
        lengthOfMaterial += getMaterialLengthOnPurchaseOrder(purchaseOrder);
    });

    return lengthOfMaterial;
}

function getMaterialLengthOnPurchaseOrder(purchaseOrder) {
    return purchaseOrder.totalRolls * purchaseOrder.feetPerRoll;
}
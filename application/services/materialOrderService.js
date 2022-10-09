const PurchaseOrderModel = require('../models/materialOrder');

async function getAllPurchaseOrders() {
    return await PurchaseOrderModel
        .find()
        .exec();
}

function getTotalLengthOfMaterial({totalRolls, feetPerRoll}) {
    return totalRolls * feetPerRoll;
}

async function findPurchaseOrdersByMaterial(materialId) {
    const searchQuery = {
        material: materialId
    };

    return await PurchaseOrderModel
        .find(searchQuery)
        .exec();
};

module.exports.findPurchaseOrdersByMaterialThatHaveNotArrived = async (materialId) => {
    const searchQuery = {
        $and:[
            {material: materialId},
            {hasArrived: false},
        ]};

    return await PurchaseOrderModel
        .find(searchQuery)
        .exec();
};

module.exports.getLengthOfOneMaterialOrdered = async (materialId) => {
    const purchaseOrders = await findPurchaseOrdersByMaterial(materialId);
    
    let totalRollsPurchased = 0;

    purchaseOrders.forEach((purchaseOrder) => {
        totalRollsPurchased += getTotalLengthOfMaterial(purchaseOrder);
    });

    return totalRollsPurchased;
};

module.exports.getLengthOfOneMaterialInInventory = async (materialId) => {
    const searchQuery = {
        material: materialId
    };
    const purchaseOrders = await PurchaseOrderModel
        .find(searchQuery)
        .exec();
    
    let totalLength = 0;

    purchaseOrders.forEach((purchaseOrder) => {
        if (purchaseOrder.hasArrived) {
            totalLength += getTotalLengthOfMaterial(purchaseOrder);
        }
    });

    return totalLength;
};

module.exports.getLengthOfAllMaterialsInInventory = async () => {
    const purchaseOrders = await getAllPurchaseOrders();

    let totalFeetOnHand = 0;

    purchaseOrders.forEach((purchaseOrder) => {
        if (purchaseOrder.hasArrived) {
            totalFeetOnHand += getTotalLengthOfMaterial(purchaseOrder);
        }
    });

    return totalFeetOnHand;
};

module.exports.getLengthOfAllMaterialsOrdered = async () => {
    const purchaseOrders = await getAllPurchaseOrders();

    let totalFeetThatHasNotArrivedYet = 0;

    purchaseOrders.forEach((purchaseOrder) => {
        if (!purchaseOrder.hasArrived) {
            totalFeetThatHasNotArrivedYet += getTotalLengthOfMaterial(purchaseOrder);
        }
    });

    return totalFeetThatHasNotArrivedYet;
};

module.exports.getNumberOfPurchaseOrders = async () => {
    const purchaseOrders = await getAllPurchaseOrders();
        
    return purchaseOrders.length;
};

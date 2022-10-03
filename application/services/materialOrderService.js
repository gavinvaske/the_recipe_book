const MaterialOrderModel = require('../models/materialOrder');

async function getAllPurchaseOrders() {
    return await MaterialOrderModel
        .find()
        .exec();
}

function getTotalLengthOfMaterial({totalRolls, feetPerRoll}) {
    return totalRolls * feetPerRoll;
}

module.exports.getLengthOfOneMaterialOrdered = async (materialId) => {
    const searchQuery = {
        material: materialId
    };
    const purchaseOrders = await MaterialOrderModel
        .find(searchQuery)
        .exec();
    
    let totalRollsPurchased = 0;

    purchaseOrders.forEach((purchaseOrder) => {
        totalRollsPurchased += getTotalLengthOfMaterial(purchaseOrder);
    });

    return totalRollsPurchased;
}

module.exports.getLengthOfOneMaterialInInventory = async (materialId) => {
    const searchQuery = {
        material: materialId
    };
    const purchaseOrders = await MaterialOrderModel
        .find(searchQuery)
        .exec();
    
    let totalLength = 0;

    purchaseOrders.forEach((purchaseOrder) => {
        if (purchaseOrder.hasArrived) {
            totalLength += getTotalLengthOfMaterial(purchaseOrder);
        }
    });

    return totalLength;
}

module.exports.getLengthOfAllMaterialsInInventory = async () => {
    const purchaseOrders = await getAllPurchaseOrders();

    let totalFeetOnHand = 0;

    purchaseOrders.forEach((purchaseOrder) => {
        if (purchaseOrder.hasArrived) {
            totalFeetOnHand += getTotalLengthOfMaterial(purchaseOrder);
        }
    });

    return totalFeetOnHand;
}

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
}

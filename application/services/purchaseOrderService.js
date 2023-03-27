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

module.exports.getMaterialIdToLengthInInventory = async (materialObjectIds) => {
    const materialLengthsInInventory = await PurchaseOrderModel.aggregate([
        { 
            $match: { 
                $and: [ 
                    { material: { $in: materialObjectIds } }, 
                    { hasArrived: true } 
                ] 
            },
        },
        { 
            $group: {
                _id: '$material', 
                length: { $sum: { $multiply: [ "$totalRolls", "$feetPerRoll" ] } }
            } 
        }
    ]);

    const materialIdToLengthInInventory = {};

    materialLengthsInInventory.forEach((material) => {
        const {_id: materialId, length} = material;
        
        materialIdToLengthInInventory[materialId] = length;
    });

    return materialIdToLengthInInventory;
}

module.exports.getMaterialIdToLengthOrdered = async (materialObjectIds) => {
    const materialLengthsOrdered = await PurchaseOrderModel.aggregate([
        { 
            $match: { 
                material: { $in: materialObjectIds }
            },
        },
        {
            $group: {
                _id: '$material',
                length: { $sum: { $multiply: [ "$totalRolls", "$feetPerRoll" ] } }
            }
        }
    ]);

    const materialIdToLengthOrdered = {};

    materialLengthsOrdered.forEach((material) => {
        const {_id: materialId, length} = material;
        
        materialIdToLengthOrdered[materialId] = length;
    });

    return materialIdToLengthOrdered;
}
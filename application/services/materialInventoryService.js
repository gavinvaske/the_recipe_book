const purchaseOrderService = require('../services/purchaseOrderService');
const MaterialLengthAdjustmentModel = require('../models/materialLengthAdjustment');

/* 
  @See: 
    https://mongoplayground.net/
  
  @Returns: 
    A map where the key is the material _id which maps to the net length of that material found in the MaterialLengthAdjustment db table
  
  @Notes:
    type materialIdWithTotalLength = {
      _id: mongooseId,
      totalLength: number
    }
*/
module.exports.groupInventoryEntriesByMaterial = async () => {
    const materialIdsWithTotalLength = await MaterialLengthAdjustmentModel.aggregate([
        {
            $group: {
                _id: '$material',
                totalLength: {
                    $sum: {
                        '$toDouble': '$length'
                    }
                }
            }
        }
    ]);

    const materialIdToTotalLength = {};

    materialIdsWithTotalLength.forEach(({_id, totalLength}) => {
        materialIdToTotalLength[_id] = totalLength; 
    });

    return materialIdToTotalLength;
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

module.exports.buildMaterialInventory = (material, allPurchaseOrdersForMaterial, feetOfMaterialAlreadyUsedByTickets, materialLengthAdjustments) => {
    const purchaseOrdersThatHaveArrived = purchaseOrderService.findPurchaseOrdersThatHaveArrived(allPurchaseOrdersForMaterial);
    const purchaseOrdersThatHaveNotArrived = purchaseOrderService.findPurchaseOrdersThatHaveNotArrived(allPurchaseOrdersForMaterial);
    const lengthOfMaterialInStock = purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveArrived);

    return {
        material,
        lengthOfMaterialOrdered: purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveNotArrived),
        lengthOfMaterialInStock: lengthOfMaterialInStock,
        netLengthOfMaterialInStock: (lengthOfMaterialInStock - (feetOfMaterialAlreadyUsedByTickets + materialLengthAdjustments)),
        purchaseOrdersForMaterial: purchaseOrdersThatHaveNotArrived
    };
};

module.exports.computeNetLengthOfMaterialInInventory = (materialInventories) => {
    const initialValue = 0;

    return materialInventories.reduce((accumulator, currentMaterialInventory) => {
        return accumulator + currentMaterialInventory.netLengthOfMaterialInStock;
    }, initialValue);
};
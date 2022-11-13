const PurchaseOrderModel = require('../models/materialOrder');
const materialInventoryService = require('../services/materialInventoryService');

module.exports = function(io){
    console.log('Initializing Sockets...');

    PurchaseOrderModel.watch().on('change', async (change) => {
        console.log(`Change to a PurchaseOrder in database: ${JSON.stringify(change)}`);

        const purchaseOrder = await PurchaseOrderModel
            .findById(change.documentKey._id)
            .populate({path: 'material'})
            .lean()
            .exec();

        if (!purchaseOrder) {
            return;
        }

        const materialObjectId = purchaseOrder.material ? purchaseOrder.material._id : null;

        if (!materialObjectId) {
            return;
        }

        const allMaterials = await materialInventoryService.getAllMaterials();
        const distinctMaterialIds = materialInventoryService.getMaterialIds(allMaterials);

        const allPurchaseOrders = await materialInventoryService.getPurchaseOrdersForMaterials(distinctMaterialIds)
        
        const materialIdToPurchaseOrders = materialInventoryService.mapMaterialIdToPurchaseOrders(distinctMaterialIds, allPurchaseOrders);

        const allPurchaseOrdersForOneMaterial = materialIdToPurchaseOrders[materialObjectId];
        const allPurchaseOrdersThatHaveArrived = materialInventoryService.findPurchaseOrdersThatHaveArrived(allPurchaseOrders); 
        const allPurchaseOrdersThatHaveNotArrived = materialInventoryService.findPurchaseOrdersThatHaveNotArrived(allPurchaseOrders);

        const materialInventory = materialInventoryService.buildMaterialInventory(purchaseOrder.material, allPurchaseOrdersForOneMaterial)
        const lengthOfAllMaterialsInInventory = materialInventoryService.computeLengthOfMaterial(allPurchaseOrdersThatHaveArrived);
        const lengthOfAllMaterialsOrdered = materialInventoryService.computeLengthOfMaterial(allPurchaseOrdersThatHaveNotArrived);
        const totalPurchaseOrders = allPurchaseOrders.length;

        io.emit(materialObjectId, {
            lengthOfMaterialOrdered: materialInventory.lengthOfMaterialOrdered,
            lengthOfMaterialInStock: materialInventory.lengthOfMaterialInStock,
            lengthOfAllMaterialsInInventory: lengthOfAllMaterialsInInventory,
            lengthOfAllMaterialsOrdered: lengthOfAllMaterialsOrdered,
            totalPurchaseOrders: totalPurchaseOrders,
            purchaseOrder: purchaseOrder
        });
    });
};
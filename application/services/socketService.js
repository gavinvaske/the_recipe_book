const PurchaseOrderModel = require('../models/materialOrder');
const materialInventoryService = require('../services/materialInventoryService');
const purchaseOrderService = require('../services/purchaseOrderService');
const materialService = require('../services/materialService');

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

        const allMaterials = await materialService.getAllMaterials();
        const distinctMaterialIds = materialService.getMaterialIds(allMaterials);

        const allPurchaseOrders = await purchaseOrderService.getPurchaseOrdersForMaterials(distinctMaterialIds);
        
        const materialIdToPurchaseOrders = materialInventoryService.mapMaterialIdToPurchaseOrders(distinctMaterialIds, allPurchaseOrders);

        const allPurchaseOrdersForOneMaterial = materialIdToPurchaseOrders[materialObjectId];
        const allPurchaseOrdersThatHaveArrived = purchaseOrderService.findPurchaseOrdersThatHaveArrived(allPurchaseOrders); 
        const allPurchaseOrdersThatHaveNotArrived = purchaseOrderService.findPurchaseOrdersThatHaveNotArrived(allPurchaseOrders);

        const materialInventory = materialInventoryService.buildMaterialInventory(purchaseOrder.material, allPurchaseOrdersForOneMaterial);
        const lengthOfAllMaterialsInInventory = purchaseOrderService.computeLengthOfMaterial(allPurchaseOrdersThatHaveArrived);
        const lengthOfAllMaterialsOrdered = purchaseOrderService.computeLengthOfMaterial(allPurchaseOrdersThatHaveNotArrived);
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
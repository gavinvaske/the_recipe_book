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

        const materialInventoryData = await materialInventoryService.getAllMaterialInventoryData();

        const inventoryDataForOneMaterial = materialInventoryData.materialInventories.find((materialInventory) => {
            return String(materialInventory.material._id) === String(materialObjectId);
        });

        io.emit(materialObjectId, {
            lengthOfMaterialOrdered: inventoryDataForOneMaterial.lengthOfMaterialOrdered,
            lengthOfMaterialInStock: inventoryDataForOneMaterial.lengthOfMaterialInStock,
            lengthOfAllMaterialsInInventory: materialInventoryData.lengthOfAllMaterialsInInventory,
            lengthOfAllMaterialsOrdered: materialInventoryData.lengthOfAllMaterialsOrdered,
            totalPurchaseOrders: materialInventoryData.totalPurchaseOrders,
            purchaseOrder: purchaseOrder
        });
    });
};
const PurchaseOrderModel = require('../models/materialOrder');
const materialOrderService = require('../services/materialOrderService');

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

        const lengthOfMaterialOrdered = await materialOrderService.getLengthOfOneMaterialOrdered(materialObjectId);
        const lengthOfMaterialInStock = await materialOrderService.getLengthOfOneMaterialInInventory(materialObjectId);
        const lengthOfAllMaterialsInInventory = await materialOrderService.getLengthOfAllMaterialsInInventory();
        const lengthOfAllMaterialsOrdered = await materialOrderService.getLengthOfAllMaterialsOrdered();
        const totalPurchaseOrders = await materialOrderService.getNumberOfPurchaseOrders();

        io.emit(materialObjectId, {
            lengthOfMaterialOrdered,
            lengthOfMaterialInStock,
            lengthOfAllMaterialsInInventory,
            lengthOfAllMaterialsOrdered,
            totalPurchaseOrders
        });
    });
};
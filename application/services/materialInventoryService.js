const MaterialModel = require('../models/material');
const materialOrderService = require('../services/materialOrderService');

module.exports.getAllMaterialInventoryData = async () => {
    let materialInventories = [];
    const materials = await MaterialModel
        .find()
        .lean()
        .exec();

    for (let i = 0; i < materials.length; i++) {
        const material = materials[i];
        const materialId = material._id;

        const lengthOfMaterialOrdered = await materialOrderService.getLengthOfOneMaterialOrdered(materialId);
        const lengthOfMaterialInStock = await materialOrderService.getLengthOfOneMaterialInInventory(materialId);
        const purchaseOrdersForMaterial = await materialOrderService.findPurchaseOrdersByMaterialThatHaveNotArrived(materialId);

        materialInventories.push({
            material,
            lengthOfMaterialOrdered,
            lengthOfMaterialInStock,
            purchaseOrdersForMaterial
        });
    }

    return materialInventories;
};
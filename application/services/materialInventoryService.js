const MaterialModel = require('../models/material');
const PurchaseOrderModel  = require('../models/materialOrder');
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

        const searchQuery = {
            $and:[
                {material: materialId},
                {hasArrived: false},
            ]};
    
        const purchaseOrdersForMaterial = await PurchaseOrderModel
            .find(searchQuery)
            .exec();

        materialInventories.push({
            material,
            lengthOfMaterialOrdered,
            lengthOfMaterialInStock,
            purchaseOrdersForMaterial
        });
    }

    return materialInventories;
};
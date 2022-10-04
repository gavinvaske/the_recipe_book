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

        const lengthOfMaterialOrdered = await materialOrderService.getLengthOfOneMaterialOrdered(material._id);
        const lengthOfMaterialInStock = await materialOrderService.getLengthOfOneMaterialInInventory(material._id);

        materialInventories.push({
            ...material,
            lengthOfMaterialOrdered,
            lengthOfMaterialInStock
        });
    }

    return materialInventories;
};
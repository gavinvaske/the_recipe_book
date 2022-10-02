const MaterialOrderModel = require('../models/materialOrder');
const MaterialModel = require('../models/material');

async function computeTotalRollsPurchasedForAMaterial(materialId) {
    const searchQuery = {material: materialId};
    const materialPurchaseOrders = await MaterialOrderModel
        .find(searchQuery)
        .exec();
    
    let totalRollsPurchased = 0;

    materialPurchaseOrders.forEach((materialPurchaseOrder) => {
        totalRollsPurchased += materialPurchaseOrder.totalRolls;
    });

    return totalRollsPurchased;
}

module.exports.getAllMaterialInventoryData = async () => {
    let materialInventories = [];
    const materials = await MaterialModel.find().exec();

    for (let i = 0; i < materials.length; i++) {
        const material = materials[i];

        const totalRollsPurchased = await computeTotalRollsPurchasedForAMaterial(material._id);

        materialInventories.push({
            materialName: material.name,
            totalRollsPurchased
        });
    }

    return materialInventories;
};
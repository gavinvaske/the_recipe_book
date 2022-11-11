const MaterialModel = require('../models/material');
const PurchaseOrderModel = require('../models/materialOrder');
const materialOrderService = require('../services/materialOrderService');

module.exports.getAllMaterialInventoryData = async () => {
    let materialInventories = [];
    const materials = await MaterialModel
        .find()
        .lean()
        .exec();

    const materialIds = materials.map((material) => {
        return material._id;
    })

    console.log(`materials.length => ${materials.length}`)
    console.log(`materialIds.length => ${materialIds.length}`)

    const searchQuery = {
        material: {$in: materials}
    }
    const purchaseOrders = await PurchaseOrderModel
        .find(searchQuery)
        .exec();

    const materialIdToPurchaseOrders = {};

    materialIds.forEach((materialId) => {
        materialIdToPurchaseOrders[materialId] = [];
    });

    purchaseOrders.forEach((purchaseOrder) => {
        const materialId = purchaseOrder.material;
        
        materialIdToPurchaseOrders[materialId].push(purchaseOrder);
    });

    console.log(`materialIdToPurchaseOrders => ${JSON.stringify(materialIdToPurchaseOrders)}`);

    materials.forEach((material) => {
        const materialInventory = buildMaterialInventory(material, materialIdToPurchaseOrders);


    });

    // return materialInventories;
};

function buildMaterialInventory(material, materialIdToPurchaseOrders) {
    const materialId = material._id;
    const lengthOfMaterialOrdered = 69;
    const lengthOfMaterialInStock = 69;
    const purchaseOrdersForMaterial = 69;

    return {
        material,
        lengthOfMaterialOrdered,
        lengthOfMaterialInStock,
        purchaseOrdersForMaterial
    }
}

// module.exports.getAllMaterialInventoryData = async () => {
//     let materialInventories = [];
//     const materials = await MaterialModel
//         .find()
//         .lean()
//         .exec();

//     console.log(`materials.length => ${materials.length}`);

//     for (let i = 0; i < materials.length; i++) {
//         const material = materials[i];
//         const materialId = material._id;

//         const lengthOfMaterialOrdered = await materialOrderService.getLengthOfOneMaterialOrdered(materialId);
//         const lengthOfMaterialInStock = await materialOrderService.getLengthOfOneMaterialInInventory(materialId);
//         const purchaseOrdersForMaterial = await materialOrderService.findPurchaseOrdersByMaterialThatHaveNotArrived(materialId);

//         materialInventories.push({
//             material,
//             lengthOfMaterialOrdered,
//             lengthOfMaterialInStock,
//             purchaseOrdersForMaterial
//         });
//     }

//     return materialInventories;
// };
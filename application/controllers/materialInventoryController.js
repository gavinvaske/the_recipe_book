const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');

const materialInventoryService = require('../services/materialInventoryService');
const materialService = require('../services/materialService');
const purchaseOrderService = require('../services/purchaseOrderService');
const ticketService = require('../services/ticketService');
const mongooseService = require('../services/mongooseService');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    try {
        const allMaterials = await materialService.getAllMaterials();

        const distinctMaterialObjectIds = mongooseService.getObjectIds(allMaterials);
        const distinctMaterialIds = materialService.getMaterialIds(allMaterials);

        const materialIdToLengthInInventory = await purchaseOrderService.getMaterialIdToLengthInInventory(distinctMaterialObjectIds);
        const materialIdToLengthUsedByTickets = await ticketService.getMaterialIdToLengthUsedByTickets(distinctMaterialIds);
        const materialIdToLengthOrdered = await purchaseOrderService.getMaterialIdToLengthOrdered(distinctMaterialObjectIds)

        // TODO (3-11-2023): The problem is that some database tables refer to the materialId as link to a specific material (i.e. purchaseOrders) while other database tables refer to the materialId (i.e. 9111, 2413) as the link to a specific material
        // This makes this current approach difficult. Is there a problem with this approach, or is there a problem with how the data is being stored. I.e. should I refer to a material ONLY ever using objectIds or ONLY ever using materialIds. Good luck future self. May the force be with you.
        response.send(`materialIdToLengthInInventory => ${JSON.stringify(materialIdToLengthInInventory)} 
            \n\n materialIdToLengthUsedByTickets => ${JSON.stringify(materialIdToLengthUsedByTickets)}
            \n\n materialIdToLengthOrdered => ${JSON.stringify(materialIdToLengthOrdered)}
            `);

    } catch (error) {
        console.log(`An error occurred while attempting to load /material-inventory: ${error}`);

        request.flash('errors', [`The following error occurred: ${error}`]);
        return response.redirect('back');
    }
});

// router.get('/', async (request, response) => {
//     try {
//         const allMaterials = await materialService.getAllMaterials();

//         const distinctMaterialObjectIds = mongooseService.getObjectIds(allMaterials);
//         const distinctMaterialIds = materialService.getMaterialIds(allMaterials);

//         const allPurchaseOrders = await purchaseOrderService.getPurchaseOrdersForMaterials(distinctMaterialObjectIds);
//         const materialIdToPurchaseOrders = materialInventoryService.mapMaterialIdToPurchaseOrders(distinctMaterialObjectIds, allPurchaseOrders);

//         const purchaseOrdersThatHaveArrived = purchaseOrderService.findPurchaseOrdersThatHaveArrived(allPurchaseOrders);
//         const purchaseOrdersThatHaveNotArrived = purchaseOrderService.findPurchaseOrdersThatHaveNotArrived(allPurchaseOrders);

//         const lengthOfAllMaterialsInInventory = purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveArrived);
//         const lengthOfAllMaterialsOrdered = purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveNotArrived);

//         const materialObjectIdToLengthUsedByTickets = await ticketService.getLengthOfEachMaterialUsedByTickets(distinctMaterialIds);

//         const materialInventories = allMaterials.map((material) => {
//             const feetOfMaterialAlreadyUsedByTickets = materialObjectIdToLengthUsedByTickets[material.materialId] || 0;
//             const purchaseOrdersForMaterial = materialIdToPurchaseOrders[material._id];

//             return materialInventoryService.buildMaterialInventory(material, purchaseOrdersForMaterial, feetOfMaterialAlreadyUsedByTickets);
//         });

//         const netLengthOfMaterialInInventory = materialInventoryService.computeNetLengthOfMaterialInInventory(materialInventories);

//         return response.render('viewMaterialInventory', {
//             materialInventories,
//             lengthOfAllMaterialsInInventory,
//             lengthOfAllMaterialsOrdered,
//             netLengthOfMaterialInInventory,
//             totalPurchaseOrders: allPurchaseOrders.length
//         });

//     } catch (error) {
//         console.log(`An error occurred while attempting to load /material-inventory: ${error}`);

//         request.flash('errors', [`The following error occurred: ${error}`]);
//         return response.redirect('back');
//     }
// });

module.exports = router;
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

        const allPurchaseOrders = await purchaseOrderService.getPurchaseOrdersForMaterials(distinctMaterialObjectIds);
        const materialIdToPurchaseOrders = materialInventoryService.mapMaterialIdToPurchaseOrders(distinctMaterialObjectIds, allPurchaseOrders);

        const purchaseOrdersThatHaveArrived = purchaseOrderService.findPurchaseOrdersThatHaveArrived(allPurchaseOrders);
        const purchaseOrdersThatHaveNotArrived = purchaseOrderService.findPurchaseOrdersThatHaveNotArrived(allPurchaseOrders);

        const lengthOfAllMaterialsInInventory = purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveArrived);
        const lengthOfAllMaterialsOrdered = purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveNotArrived);

        const materialObjectIdToLengthUsedByTickets = await ticketService.getLengthOfEachMaterialUsedByTickets(distinctMaterialIds);

        const materialInventories = allMaterials.map((material) => {
            const feetOfMaterialAlreadyUsedByTickets = materialObjectIdToLengthUsedByTickets[material.materialId] || 0;
            const purchaseOrdersForMaterial = materialIdToPurchaseOrders[material._id];

            return materialInventoryService.buildMaterialInventory(material, purchaseOrdersForMaterial, feetOfMaterialAlreadyUsedByTickets);
        });

        const netLengthOfMaterialInInventory = materialInventoryService.computeNetLengthOfMaterialInInventory(materialInventories);

        return response.render('viewMaterialInventory', {
            materialInventories,
            lengthOfAllMaterialsInInventory,
            lengthOfAllMaterialsOrdered,
            netLengthOfMaterialInInventory,
            totalPurchaseOrders: allPurchaseOrders.length
        });

    } catch (error) {
        console.log(`An error occurred while attempting to load /material-inventory: ${error}`);

        request.flash('errors', [`The following error occurred: ${error}`]);
        return response.redirect('back');
    }
});

module.exports = router;
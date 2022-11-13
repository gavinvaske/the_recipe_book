const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');

const materialInventoryService = require('../services/materialInventoryService');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    try {
        const allMaterials = await materialInventoryService.getAllMaterials();
        const distinctMaterialIds = materialInventoryService.getMaterialIds(allMaterials);

        const allPurchaseOrders = await materialInventoryService.getPurchaseOrdersForMaterials(distinctMaterialIds);

        const materialIdToPurchaseOrders = materialInventoryService.mapMaterialIdToPurchaseOrders(distinctMaterialIds, allPurchaseOrders);

        const purchaseOrdersThatHaveArrived = materialInventoryService.findPurchaseOrdersThatHaveArrived(allPurchaseOrders);
        const purchaseOrdersThatHaveNotArrived = materialInventoryService.findPurchaseOrdersThatHaveNotArrived(allPurchaseOrders);

        const lengthOfAllMaterialsInInventory = materialInventoryService.computeLengthOfMaterial(purchaseOrdersThatHaveArrived);
        const lengthOfAllMaterialsOrdered = materialInventoryService.computeLengthOfMaterial(purchaseOrdersThatHaveNotArrived);

        const materialInventories = allMaterials.map((material) => {
            const purchaseOrdersForMaterial = materialIdToPurchaseOrders[material._id];
            return materialInventoryService.buildMaterialInventory(material, purchaseOrdersForMaterial);
        })

        return response.render('viewMaterialInventory', {
            materialInventories,
            lengthOfAllMaterialsInInventory,
            lengthOfAllMaterialsOrdered,
            totalPurchaseOrders: allPurchaseOrders.length
        });

    } catch (error) {
        console.log(`An error occurred while attempting to load /material-inventory: ${error}`);

        request.flash('errors', [`The following error occurred: ${error}`]);
        return response.redirect('back');
    }
});

module.exports = router;
const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');

const materialInventoryService = require('../services/materialInventoryService');
const materialService = require('../services/materialService');
const purchaseOrderService = require('../services/purchaseOrderService');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    try {
        const allMaterials = await materialService.getAllMaterials();
        const distinctMaterialIds = materialService.getMaterialIds(allMaterials);

        const allPurchaseOrders = await purchaseOrderService.getPurchaseOrdersForMaterials(distinctMaterialIds);

        const materialIdToPurchaseOrders = materialInventoryService.mapMaterialIdToPurchaseOrders(distinctMaterialIds, allPurchaseOrders);

        const purchaseOrdersThatHaveArrived = purchaseOrderService.findPurchaseOrdersThatHaveArrived(allPurchaseOrders);
        const purchaseOrdersThatHaveNotArrived = purchaseOrderService.findPurchaseOrdersThatHaveNotArrived(allPurchaseOrders);

        const lengthOfAllMaterialsInInventory = purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveArrived);
        const lengthOfAllMaterialsOrdered = purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveNotArrived);

        const materialInventories = allMaterials.map((material) => {
            const purchaseOrdersForMaterial = materialIdToPurchaseOrders[material._id];
            return materialInventoryService.buildMaterialInventory(material, purchaseOrdersForMaterial);
        });

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
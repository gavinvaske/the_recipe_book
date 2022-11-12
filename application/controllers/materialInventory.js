const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');

const materialInventoryService = require('../services/materialInventoryService');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    try {
        const materialInventoryData = await materialInventoryService.getAllMaterialInventoryData();

        return response.render('viewMaterialInventory', {
            materialInventories: materialInventoryData.materialInventories,
            lengthOfAllMaterialsInInventory: materialInventoryData.lengthOfAllMaterialsInInventory,
            lengthOfAllMaterialsOrdered: materialInventoryData.lengthOfAllMaterialsOrdered,
            totalPurchaseOrders: materialInventoryData.totalPurchaseOrders
        });

    } catch (error) {
        console.log(`An error occurred while attempting to load /material-inventory: ${error}`);

        request.flash('errors', [`The following error occurred: ${error}`]);
        return response.redirect('back');
    }
});

module.exports = router;
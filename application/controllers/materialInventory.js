const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const materialOrderService = require('../services/materialOrderService');

const MaterialInventoryService = require('../services/materialInventoryService');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    try {
        const materialInventories = await MaterialInventoryService.getAllMaterialInventoryData();
        const lengthOfAllMaterialsInInventory = await materialOrderService.getLengthOfAllMaterialsInInventory();
        const lengthOfAllMaterialsOrdered = await materialOrderService.getLengthOfAllMaterialsOrdered();
        const totalPurchaseOrders = await materialOrderService.getNumberOfPurchaseOrders();
        
        return response.render('viewMaterialInventory', {
            materialInventories,
            lengthOfAllMaterialsInInventory,
            lengthOfAllMaterialsOrdered,
            totalPurchaseOrders
        });

    } catch (error) {
        console.log(`An error occurred while attempting to load /material-inventory: ${error}`);

        request.flash('errors', ['The following error(s) occurred:', error]);
        return response.redirect('back');
    }
});

module.exports = router;
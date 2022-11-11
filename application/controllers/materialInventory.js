const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const materialOrderService = require('../services/materialOrderService');

const materialInventoryService = require('../services/materialInventoryService');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    try {
        const start1 = new Date();
        const materialInventories = await materialInventoryService.getAllMaterialInventoryData();
        const start2 = new Date();
        const lengthOfAllMaterialsInInventory = await materialOrderService.getLengthOfAllMaterialsInInventory();
        const start3 = new Date();
        const lengthOfAllMaterialsOrdered = await materialOrderService.getLengthOfAllMaterialsOrdered();
        const start4 = new Date();
        const totalPurchaseOrders = await materialOrderService.getNumberOfPurchaseOrders();
        
        const stop = new Date();

        console.log(`Time Taken to execute start1 = ${(stop - start1)} ms`); // 1433 ms
        console.log(`Time Taken to execute start2 = ${(stop - start2)} ms`); // 163 msg
        console.log(`Time Taken to execute start3 = ${(stop - start3)} ms`); // 109 ms
        console.log(`Time Taken to execute start4 = ${(stop - start4)} ms`); // 55 ms

        return response.json('Performance upgrades incoming')

        // return response.render('viewMaterialInventory', {
        //     materialInventories,
        //     lengthOfAllMaterialsInInventory,
        //     lengthOfAllMaterialsOrdered,
        //     totalPurchaseOrders
        // });

    } catch (error) {
        console.log(`An error occurred while attempting to load /material-inventory: ${error}`);

        request.flash('errors', [`The following error occurred: ${error}`]);
        return response.redirect('back');
    }
});

module.exports = router;
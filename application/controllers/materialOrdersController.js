const router = require('express').Router();
const MaterialOrderModel = require('../models/materialOrder');
const MaterialModel = require('../models/material');
const VendorModel = require('../models/vendor');
const {verifyJwtToken} = require('../middleware/authorize');

router.get('/', verifyJwtToken, async (request, response) => {
    const materialOrders = await MaterialOrderModel
        .find()
        .populate({path: 'author'})
        .populate({path: 'vendor'})
        .populate({path: 'material'})
        .exec();

    console.log(materialOrders);

    return response.render('viewMaterialOrders', {
        materialOrders
    });
});

router.get('/create', verifyJwtToken, async (request, response) => {
    const materials = await MaterialModel.find().exec();
    const vendors = await VendorModel.find().exec();

    return response.render('createMaterialOrder', {
        materials,
        vendors,
        user: request.user
    });
});

router.post('/create', verifyJwtToken, async (request, response) => {
    try {
        await MaterialOrderModel.create(request.body);
    } catch (error) {
        console.log(`The request: ${JSON.stringify(request.body)} resulted in the following errors: ${JSON.stringify(error)}`);
        request.flash('errors', ['Unable to create the Material Order, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }

    request.flash('alerts', ['Material Order created successfully']);

    return response.redirect(`/material-orders`);
});

module.exports = router;
const router = require('express').Router();
const MaterialOrderModel = require('../models/materialOrder');
const MaterialModel = require('../models/material');
const VendorModel = require('../models/vendor');
const {verifyJwtToken} = require('../middleware/authorize');

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_RESULTS_PER_PAGE = 2;

router.get('/', verifyJwtToken, async (request, response) => {
    try {
        const queryParams = request.query;
        const pageNumber = queryParams.pageNumber || DEFAULT_PAGE_NUMBER;
        const numberOfResultsToSkip = (pageNumber - 1) * DEFAULT_RESULTS_PER_PAGE;

        const numberOfRecordsInDatabase = await MaterialOrderModel.countDocuments({});
        const totalNumberOfPages = Math.ceil(numberOfRecordsInDatabase / DEFAULT_RESULTS_PER_PAGE);

        const materialOrders = await MaterialOrderModel
            .find()
            .populate({path: 'author'})
            .populate({path: 'vendor'})
            .populate({path: 'material'})
            .skip(numberOfResultsToSkip)
            .limit(DEFAULT_RESULTS_PER_PAGE)
            .exec();

        return response.render('viewMaterialOrders', {
            materialOrders,
            pageNumber,
            totalNumberOfPages
        });
    } catch (error) {
        request.flash('errors', ['Unable to load Material Orders, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }
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

    return response.redirect('/material-orders');
});

router.get('/update/:id', verifyJwtToken, async (request, response) => {
    try {
        const vendors = await VendorModel.find().exec();
        const materials = await MaterialModel.find().exec();
        const materialOrder = await MaterialOrderModel
            .findById(request.params.id)
            .populate({path: 'author'})
            .populate({path: 'vendor'})
            .populate({path: 'material'})
            .exec();
        const user = request.user;

        return response.render('updateMaterialOrder', {
            vendors,
            materials,
            materialOrder,
            user
        });
    } catch (error) {
        console.log(error);
        request.flash('errors', [error.message]);

        return response.redirect('back');
    }
});

router.post('/update/:id', verifyJwtToken, async (request, response) => {
    try {
        await MaterialOrderModel.findByIdAndUpdate(request.params.id, request.body).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect('/material-orders');
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

router.get('/delete/:id', verifyJwtToken, async (request, response) => {
    try {
        await MaterialOrderModel.findByIdAndDelete(request.params.id).exec();

        request.flash('alerts', 'Deletion was successful');
        return response.redirect('back');
    } catch (error) {
        console.log(error);
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

module.exports = router;
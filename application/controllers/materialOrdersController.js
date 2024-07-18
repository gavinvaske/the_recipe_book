const router = require('express').Router();
const MaterialOrderModel = require('../models/materialOrder');
const MaterialModel = require('../models/material');
const VendorModel = require('../models/vendor');
const {verifyJwtToken} = require('../middleware/authorize');
const { CREATED_SUCCESSFULLY, BAD_REQUEST, SERVER_ERROR, SUCCESS } = require('../enums/httpStatusCodes');
const { descending } = require('../enums/mongooseSortMethods');

router.use(verifyJwtToken);

router.delete('/:mongooseId', async (request, response) => {
    try {
        const deletedMaterialOrder = await MaterialOrderModel.findByIdAndDelete(request.params.mongooseId).exec();
        return response.status(SUCCESS).json(deletedMaterialOrder);
    } catch (error) {
        console.error('Failed to delete materialOrder: ', error);

        return response.status(SERVER_ERROR).send(error.message);
    }
});

router.post('/query', async (request, response) => {
    const {query, pageNumber, resultsPerPage} = request.body;

    const searchCriteria = {
        $or:[
            {purchaseOrderNumber: {$regex: query, $options: 'i'}},
            {notes: {$regex: query, $options: 'i'}}
        ]};
    const numberOfResultsToSkip = (pageNumber - 1) * resultsPerPage;

    try {
        const searchResults = await MaterialOrderModel
            .find(searchCriteria)
            .populate({path: 'author', select: 'fullName email'})
            .populate({path: 'vendor'})
            .populate({path: 'material'})
            .skip(numberOfResultsToSkip)
            .limit(resultsPerPage)
            .exec();

        return response.send(searchResults);
    } catch (error) {
        console.log(error);
        request.flash('errors', ['A problem occurred while performing your search:', error.message]);
        return response.json({
            error
        });
    }
});

router.patch('/:mongooseId', async (request, response) => {
    try {
        const updatedMaterialOrder = await MaterialOrderModel.findOneAndUpdate(
            { _id: request.params.mongooseId }, 
            { $set: request.body }, 
            { runValidators: true, new: true }
        ).exec();

        return response.json(updatedMaterialOrder);
    } catch (error) {
        console.error('Failed to update materialOrder: ', error);

        response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.get('/', async (_, response) => {
    try {
        const materialOrders = await MaterialOrderModel.find().sort({ createdAt: descending }).exec();

        return response.json(materialOrders);
    } catch (error) {
        console.error('Error loading materialOrders', error);
        return response.status(SERVER_ERROR).send(error.message);
    }
});

// @deprecated
router.get('/create', async (request, response) => {
    const materials = await MaterialModel.find().exec();
    const vendors = await VendorModel.find().exec();

    return response.render('createMaterialOrder', {
        materials,
        vendors,
        user: request.user
    });
});

router.post('/', async (request, response) => {
    try {
        const savedMaterialOrder = await MaterialOrderModel.create(request.body);

        return response
            .status(CREATED_SUCCESSFULLY)
            .json(savedMaterialOrder);
    } catch (error) {
        console.error('Failed to create materialOrder', error);

        return response.status(BAD_REQUEST).send(error.message);
    }
});

// @deprecated
router.post('/create', async (request, response) => {
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

router.get('/update/:id', async (request, response) => {
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

router.post('/update/:id', async (request, response) => {
    try {
        if (!request.body.hasArrived) {
            request.body.hasArrived = false;
        }

        await MaterialOrderModel.findByIdAndUpdate(request.params.id, request.body, { runValidators: true }).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect('/material-orders');
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

router.get('/delete/:id', async (request, response) => {
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

router.get('/:mongooseId', async (request, response) => {
    try {
        const materialOrder = await MaterialOrderModel.findById(request.params.mongooseId);
        console.log('this is test: ', typeof materialOrder.createdAt);
        return response.json(materialOrder);
    } catch (error) {
        console.error('Error searching for materialOrder: ', error);

        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

module.exports = router;
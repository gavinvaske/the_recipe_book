const express = require('express');
const router = express.Router();
const VendorModel = require('../models/vendor');
const {verifyJwtToken} = require('../middleware/authorize');
const { SERVER_ERROR } = require('../enums/httpStatusCodes'); 

router.use(verifyJwtToken);

const SHOW_ALL_VENDORS_ENDPOINT = '/vendors';

router.get('/', async (_, response) => {
    try {
        const vendors = await VendorModel.find().exec();
        
        return response.json(vendors);
    } catch (error) {
        console.error('Error fetching vendors: ', error);
        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.get('/create', (request, response) => {
    return response.render('createVendor');
});

router.post('/create', async (request, response) => {
    const {name} = request.body;
    try {
        await VendorModel.create({name});
    } catch (error) {
        request.flash('errors', ['Unable to save the Vendor, the following error(s) occurred:', error.message]);

        return response.redirect('back');
    }
    request.flash('alerts', ['Vendor created successfully']);

    return response.redirect(SHOW_ALL_VENDORS_ENDPOINT);
});

router.get('/all', async (request, response) => {
    try {
        
        const vendors = await VendorModel.find().exec();
        
        return response.send(vendors);

    } catch (error) {
        request.flash('errors', ['Unable to search Vendors, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }
});

router.get('/update/:id', async (request, response) => {
    try {
        const vendor = await VendorModel.findById(request.params.id).exec();

        return response.render('updateVendor', {
            vendor
        });
    } catch (error) {
        request.flash('errors', error.message);
        
        return response.redirect('back');
    }
});

router.post('/update/:id', async (request, response) => {
    try {
        await VendorModel.findByIdAndUpdate(request.params.id, request.body,{ runValidators: true }).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect(SHOW_ALL_VENDORS_ENDPOINT);
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

router.get('/delete/:id', async (request, response) => {
    try {
        await VendorModel.findByIdAndDelete(request.params.id).exec();

        request.flash('alerts', 'Deletion was successful');
    } catch (error) {
        request.flash('errors', error.message);
    }

    return response.redirect('back');
});

module.exports = router;
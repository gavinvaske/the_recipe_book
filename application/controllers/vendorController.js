const express = require('express');
const router = express.Router();
const VendorModel = require('../models/vendor');
const {verifyJwtToken} = require('../middleware/authorize');

const SHOW_ALL_VENDORS_ENDPOINT = '/vendors';

router.get('/', verifyJwtToken, async (request, response) => {
    try {
        const vendors = await VendorModel.find().exec();
        
        return response.render('viewVendors', {
            vendors: vendors
        });

    } catch (error) {
        request.flash('errors', ['Unable to load Vendors, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }
});

router.get('/create', verifyJwtToken, (request, response) => {
    return response.render('createVendor');
});

router.post('/create', verifyJwtToken, async (request, response) => {
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

router.get('/all', verifyJwtToken, async (request, response) => {
    try {
        
        const vendors = await VendorModel.find().exec();
        
        return response.send(vendors);

    } catch (error) {
        request.flash('errors', ['Unable to search Vendors, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }
});

module.exports = router;
const router = require('express').Router();
const MaterialModel = require('../models/material');
const { verifyJwtToken } = require('../middleware/authorize');
const VendorModel = require('../models/vendor');
const MaterialCategoryModel = require('../models/materialCategory');

const SHOW_ALL_MATERIALS_ENDPOINT = '/materials';

router.use(verifyJwtToken);

router.get('/all', async (request, response) => {
    try {
        
        const materials = await MaterialModel.find().exec();
        
        return response.send(materials);

    } catch (error) {
        request.flash('errors', ['Unable to search Materials, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }
});

router.get('/', async (request, response) => {
    try {
        const materials = await MaterialModel.find().exec();
        
        return response.render('viewMaterials', {
            materials: materials
        });

    } catch (error) {
        request.flash('errors', ['Unable to load Materials, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }
});

router.get('/form', async (request, response) => {
    const vendors = await VendorModel.find().exec();
    const materialCategories = await MaterialCategoryModel.find().exec();

    return response.render('createMaterial', { vendors, materialCategories });
});

router.post('/form', async (request, response) => {
    try {
        await MaterialModel.create(request.body);
    } catch (error) {
        request.flash('errors', ['Unable to save the Material, the following error(s) occurred:', error.message]);

        return response.redirect('back');
    }
    request.flash('alerts', ['Material created successfully']);

    return response.redirect(SHOW_ALL_MATERIALS_ENDPOINT);
});

router.get('/update/:id', async (request, response) => {
    try {
        const material = await MaterialModel.findById(request.params.id);
        const vendors = await VendorModel.find().exec();
        const materialCategories = await MaterialCategoryModel.find().exec();

        return response.render('updateMaterial', {
            material, 
            vendors,
            materialCategories 
        });
    } catch (error) {
        console.log(error);
        request.flash('errors', [error.message]);

        return response.redirect('back');
    }
});

router.post('/update/:id', async (request, response) => {
    try {
        await MaterialModel.findByIdAndUpdate(request.params.id, request.body, { runValidators: true }).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect(SHOW_ALL_MATERIALS_ENDPOINT);
    } catch (error) {
        console.log(error);
        request.flash('errors', error.message);

        return response.redirect('back');
    }
});

router.get('/delete/:id', async (request, response) => {
    try {
        await MaterialModel.findByIdAndDelete(request.params.id).exec();

        request.flash('alerts', 'Deletion was successful');
    } catch (error) {
        console.log(error);
        request.flash('errors', error.message);
    }

    return response.redirect('back');
});

module.exports = router;
const router = require('express').Router();
const MaterialModel = require('../models/material');
const {verifyJwtToken} = require('../middleware/authorize');

router.get('/', verifyJwtToken, async (request, response) => {
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

router.get('/create', verifyJwtToken, (request, response) => {
    return response.render('createMaterial')
});

router.post('/create', verifyJwtToken, async (request, response) => {
    const {name} = request.body;
    try {
        await MaterialModel.create({name});
    } catch (error) {
        request.flash('errors', ['Unable to save the Material, the following error(s) occurred:', error.message]);

        return response.redirect('back');
    }
    request.flash('alerts', ['Material created successfully']);

    return response.redirect('/materials');
});

module.exports = router;
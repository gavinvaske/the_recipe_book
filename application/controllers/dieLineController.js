const router = require('express').Router();
const DieLineModel = require('../models/dieLine');

router.get('/', (request, response) => {
    return response.render('viewRequests');
});

router.get('/form', (request, response) => {
    return response.render('createDieLine');
});

router.post('/', async (request, response) => {
    try {
        await DieLineModel.create(request.body);

        return response.redirect('/die-lines');
    } catch (error) {
        console.log(`Error creating die-line: ${error.message}`);
        request.flash('errors', ['The following error(s) occurred while creating the die-line:', ...mongooseService.parseHumanReadableMessages(error)]);

        return response.redirect('back');
    }
});

module.exports = router;
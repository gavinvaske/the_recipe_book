const router = require('express').Router();
const CardModel = require('../models/card');
const cardService = require('../services/cardService');

router.get('/form', (request, response) => {
    return response.render('createDieLine');
});

router.post('/', async (request, response) => {
    const card = cardService.buildDieLineCard(request.body);

    await CardModel.create(card);

    return response.redirect('/tickets');
});

module.exports = router;
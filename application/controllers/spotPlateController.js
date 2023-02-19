const router = require('express').Router();
const CardModel = require('../models/card');
const cardService = require('../services/cardService');

router.get('/form', (request, response) => {
    return response.render('createSpotPlate');
});

router.post('/', async (request, response) => {
    const card = cardService.buildSpotPlateCard(request.body);

    await CardModel.create(card);

    return response.redirect('/tickets');
});

module.exports = router;
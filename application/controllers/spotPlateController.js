const router = require('express').Router();
const CardModel = require('../models/card');
const cardService = require('../services/cardService');

router.get('/form', (request, response) => {
    return response.render('createSpotPlate');
});

router.post('/', async (request, response) => {
    const spotPlateCard = cardService.buildSpotPlateCard(request.body);

    await CardModel.create(spotPlateCard);

    return response.redirect('/tickets');
});

module.exports = router;
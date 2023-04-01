const router = require('express').Router();
const SpotPlateModel = require('../models/spotPlate');
const DieLineModel = require('../models/dieLine');
const destinationService = require('../services/destinationService');

router.get('/', async (request, response) => {
    const dieLineRequestPromises = DieLineModel.find({}).exec();
    const spotPlateRequestPromises = SpotPlateModel.find({}).exec();

    const requests = (await Promise.all([dieLineRequestPromises, spotPlateRequestPromises])).flat();

    const requestsGroupedByDestination = destinationService.groupItemsByDestination(requests);

    return response.render('viewRequests', {
        requestsGroupedByDestination
    });
});

module.exports = router;
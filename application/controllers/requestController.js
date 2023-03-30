const router = require('express').Router();
const SpotPlateModel = require('../models/spotPlate');
const DieLineModel = require('../models/dieLine');
const destinationService = require('../services/destinationService');

router.get('/', async (request, response) => {
    const dieLineRequests = await DieLineModel.find({}).exec();
    const spotPlateRequests = await SpotPlateModel.find({}).exec();

    const requests = [
        ...dieLineRequests,
        ...spotPlateRequests
    ];

    const requestsGroupedByDestination = destinationService.groupItemsByDestination(requests);

    return response.render('viewRequests', {
        requestsGroupedByDestination
    });
});

module.exports = router;
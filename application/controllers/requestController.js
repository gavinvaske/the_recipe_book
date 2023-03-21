const router = require('express').Router();
const SpotPlateModel = require('../models/spotPlate');
const DieLineModel = require('../models/dieLine');

router.get('/', async (request, response) => {
    const spotPlateRequests = await SpotPlateModel.find().exec();
    const dieLineRequests = await DieLineModel.find().exec();

    console.log(`spotPlateRequests => ${spotPlateRequests.length}`);
    console.log(`dieLineRequests => ${dieLineRequests.length}`);

    return response.render('viewRequests', {
        spotPlateRequests,
        dieLineRequests
    });
});

module.exports = router;
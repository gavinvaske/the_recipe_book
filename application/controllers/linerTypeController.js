const router = require('express').Router();
const LinerTypeModel = require('../models/linerType');
const { verifyJwtToken } = require('../middleware/authorize');

router.use(verifyJwtToken);

const HTTP_SERVER_ERROR = 500;

router.get('/', async (_, response) => {
    try {
        const linerTypes = await LinerTypeModel.find().exec();
    
        return response.send(linerTypes);
    } catch (error) {
        console.log('Error fetching liner types: ', error);
        return response.status(HTTP_SERVER_ERROR).send(error.message);
    }
});

router.post('/', async (request, response) => {
    try {
        const linerType = await LinerTypeModel.create(request.body);

        return response.json(linerType);
    } catch (error) {
        console.log('Error creating LinerType: ', error);
        return response.status(HTTP_SERVER_ERROR).send(error.message);
    }
});

module.exports = router;
const router = require('express').Router();
const LinerTypeModel = require('../models/linerType');
const { verifyJwtToken } = require('../middleware/authorize');
const { CREATED_SUCCESSFULLY, SERVER_ERROR } = require('../enums/httpStatusCodes');

router.use(verifyJwtToken);

router.get('/', async (_, response) => {
    try {
        const linerTypes = await LinerTypeModel.find().exec();
    
        return response.json(linerTypes);
    } catch (error) {
        console.error('Error fetching Liner Types: ', error);
        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.post('/', async (request, response) => {
    try {
        const linerType = await LinerTypeModel.create(request.body);

        return response
            .status(CREATED_SUCCESSFULLY)
            .json(linerType);
    } catch (error) {
        console.error('Error creating LinerType: ', error);
        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

module.exports = router;
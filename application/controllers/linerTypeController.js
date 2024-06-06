const router = require('express').Router();
const LinerTypeModel = require('../models/linerType');
const { verifyJwtToken } = require('../middleware/authorize');

router.use(verifyJwtToken);

const HTTP_SERVER_ERROR = 500;

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
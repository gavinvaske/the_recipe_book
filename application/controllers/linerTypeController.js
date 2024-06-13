const router = require('express').Router();
const LinerTypeModel = require('../models/linerType');
const { verifyJwtToken } = require('../middleware/authorize');

router.use(verifyJwtToken);

const HTTP_SERVER_ERROR = 500;
const SUCCESS_HTTP_STATUS = 200;

router.delete('/:mongooseId', async (request, response) => {
  try {
    await LinerTypeModel.findByIdAndDelete(request.params.mongooseId).exec();

    return response.status(SUCCESS_HTTP_STATUS);
} catch (error) {
    return response.status(HTTP_SERVER_ERROR).send(error.message);
}
});

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
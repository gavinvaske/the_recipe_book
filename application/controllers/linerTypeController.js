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
        console.log('Error getting linertypes: ', error.message);
        return response.status(HTTP_SERVER_ERROR).send(error.message);
    }
});

router.get('/:mongooseId', async (request, response) => {
    try {
        const linerType = await LinerTypeModel.findById(request.params.mongooseId);

        return response.json(linerType);
    } catch (error) {
        console.log('Error searching for linerType: ', error.message);
        return response.status(HTTP_SERVER_ERROR).send(error.message);
    }
});

router.patch('/:mongooseId', async (request, response) => {
    try {
        const updatedLinerType = await LinerTypeModel.findOneAndUpdate(
            {_id: request.params.mongooseId}, 
            {$set: request.body}, 
            {runValidators: true, new: true}
        ).exec();

        return response.json(updatedLinerType);
    } catch (error) {
        console.log('Failed to update linerType: ', error.message, '\nThe attributes used were: ', JSON.stringify(request.body));

        response.status(HTTP_SERVER_ERROR).send(error.message);
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
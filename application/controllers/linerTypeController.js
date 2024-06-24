const router = require('express').Router();
const LinerTypeModel = require('../models/linerType');
const { verifyJwtToken } = require('../middleware/authorize');
const { CREATED_SUCCESSFULLY, SERVER_ERROR } = require('../enums/httpStatusCodes');

router.use(verifyJwtToken);

router.delete('/:mongooseId', async (request, response) => {
    try {
        await LinerTypeModel.findByIdAndDelete(request.params.mongooseId).exec();

        return response.status(CREATED_SUCCESSFULLY);
    } catch (error) {
        return response.status(SERVER_ERROR).send(error.message);
    }
});

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

router.get('/:mongooseId', async (request, response) => {
    try {
        const linerType = await LinerTypeModel.findById(request.params.mongooseId);

        return response.json(linerType);
    } catch (error) {
        console.log('Error searching for linerType: ', error.message);
        return response
          .status(SERVER_ERROR)
          .send(error.message);
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
        console.log('Failed to update linerType: ', error.message);

        response
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
import { Router } from 'express'
const router = Router();
const LinerTypeModel = require('../models/linerType');
import { verifyJwtToken }from '../middleware/authorize.js'
const { CREATED_SUCCESSFULLY, SERVER_ERROR, SUCCESS } = require('../enums/httpStatusCodes');

router.use(verifyJwtToken);

router.delete('/:mongooseId', async (request, response) => {
    try {
        const deletedLinerType = await LinerTypeModel.findByIdAndDelete(request.params.mongooseId).exec();

        return response.status(SUCCESS).json(deletedLinerType);
    } catch (error) {
        console.error('Failed to delete LinerType: ', error);

        return response.status(SERVER_ERROR).send(error.message);
    }
});

router.get('/', async (_, response) => {
    try {
        const linerTypes = await LinerTypeModel.find().exec();
    
        return response.json(linerTypes);
    } catch (error) {
        console.error('Error fetching LinerTypes: ', error);
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
        console.log('Failed to update LinerType: ', error);

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
        console.error('Failed to create LinerType: ', error);
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
        console.error('Error searching for linerType: ', error);

        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

module.exports = router;
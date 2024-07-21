import { Router } from 'express'
const router = Router();
const { CREATED_SUCCESSFULLY, SERVER_ERROR } = require('../enums/httpStatusCodes');
import { verifyJwtToken }from '../middleware/authorize.js'
const MaterialLengthAdjustmentModel = require('../models/materialLengthAdjustment');

router.use(verifyJwtToken);

router.post('/', async (request, response) => {
    try {
        const savedMaterialLengthAdjustment = await MaterialLengthAdjustmentModel.create(request.body);

        return response
            .status(CREATED_SUCCESSFULLY)
            .send(savedMaterialLengthAdjustment);
    } catch (error) {
        console.error('Error creating materialLengthAdjustment: ', error);
        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

module.exports = router;
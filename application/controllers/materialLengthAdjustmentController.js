import { Router } from 'express'
const router = Router();
import { CREATED_SUCCESSFULLY, SERVER_ERROR } from '../enums/httpStatusCodes.js';
import { verifyJwtToken }from '../middleware/authorize.js'
import MaterialLengthAdjustmentModel from '../models/materialLengthAdjustment.js';

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
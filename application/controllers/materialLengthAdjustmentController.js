const router = require('express').Router();
const { CREATED_SUCCESSFULLY, SERVER_ERROR } = require('../enums/httpStatusCodes');
const { verifyJwtToken } = require('../middleware/authorize');
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
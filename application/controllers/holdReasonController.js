const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const HoldReasonModel = require('../models/holdReason');

router.use(verifyJwtToken);

const INVALID_REQUEST_ERROR_CODE = 400;
const SERVER_ERROR_CODE = 500;

router.post('/', async (request, response) => {
    try {
        const holdReason = new HoldReasonModel(request.body);

        const doc = await HoldReasonModel.create(holdReason);
    
        return response.send(doc);
    } catch (error) {
        console.log(`Error creating a HoldReason Object: ${error.message}`);
        return response.status(INVALID_REQUEST_ERROR_CODE).send(error.message);
    }
});

router.delete('/:id', async (request, response) => {
    const {id} = request.params;

    try {
        await HoldReasonModel.deleteById(id);
        return response.send(id);
    } catch (error) {
        return response.status(SERVER_ERROR_CODE).send(error.message);
    }
});

module.exports = router;
const router = require('express').Router();
const { CREATED_SUCCESSFULLY, SERVER_ERROR } = require('../enums/httpStatusCodes');
const { verifyJwtToken } = require('../middleware/authorize');
const MaterialInventoryEntryModel = require('../models/materialInventoryEntry');

router.use(verifyJwtToken);

router.post('/', async (request, response) => {
    try {
        const savedMaterialInventoryEntry = await MaterialInventoryEntryModel.create(request.body);

        return response
            .status(CREATED_SUCCESSFULLY)
            .send(savedMaterialInventoryEntry);
    } catch (error) {
        console.error('Error creating materialInventoryEntry: ', error);
        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

module.exports = router;
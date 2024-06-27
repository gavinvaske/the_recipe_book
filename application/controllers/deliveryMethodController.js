const router = require('express').Router();
const { verifyJwtToken } = require('../middleware/authorize');
const DeliveryMethodModel = require('../models/deliveryMethod');
const { SERVER_ERROR, BAD_REQUEST, CREATED_SUCCESSFULLY } = require('../enums/httpStatusCodes');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    try {
        const deliveryMethods = await DeliveryMethodModel.find().exec();

        return response.send(deliveryMethods);
    } catch (error) {
        return response.status(SERVER_ERROR).send(error.message);
    }
});

router.post('/', async (request, response) => {
    let savedDeliveryMethod;

    try {
        savedDeliveryMethod = await DeliveryMethodModel.create(request.body);

        return response.status(CREATED_SUCCESSFULLY).send(savedDeliveryMethod);
    } catch (error) {
        console.error('Failed to create deliveryMethod', error);

        return response.status(BAD_REQUEST).send(error.message);
    }
});

router.delete('/:mongooseId', async (request, response) => {
    try {
        await DeliveryMethodModel.findByIdAndDelete(request.params.mongooseId).exec();

        return response.status(SUCCESS);
    } catch (error) {
        console.error('Failed to delete deliveryMethod: ', error);

        return response.status(SERVER_ERROR).send(error.message);
    }
});

module.exports = router;
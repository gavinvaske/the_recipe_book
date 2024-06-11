const router = require('express').Router();
const { verifyJwtToken } = require('../middleware/authorize');
const DeliveryMethodModel = require('../models/deliveryMethod');

router.use(verifyJwtToken);

const SUCCESSFULLY_CREATED_STATUS_CODE = 201;
const BAD_REQUEST_STATUS_CODE = 400;
const SERVER_ERROR_STATUS_CODE = 500;

router.get('/', async (request, response) => {
  try {
    const deliveryMethods = await DeliveryMethodModel.find().exec();

    return response.send(deliveryMethods);
  } catch (error) {
    return response.status(SERVER_ERROR_STATUS_CODE).send(error.message)
  }
});

router.post('/', async (request, response) => {
    let savedDeliveryMethod;

    try {
        savedDeliveryMethod = await DeliveryMethodModel.create(request.body);
        response.status(SUCCESSFULLY_CREATED_STATUS_CODE).send(savedDeliveryMethod);
    } catch (error) {
        console.log(error);
        return response.status(BAD_REQUEST_STATUS_CODE).send(error.message);
    }
});

module.exports = router;
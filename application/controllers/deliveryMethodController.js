const router = require('express').Router();
const { verifyJwtToken } = require('../middleware/authorize');
const deliveryMethodModel = require('../models/deliveryMethod');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
  return response.render('viewDeliveryMethods');
})

router.get('/form', async (request, response) => {
    return response.render('createDeliveryMethod');
});

router.post('/', async (request, response) => {
  let savedDeliveryMethod;

  try {
    savedDeliveryMethod = await deliveryMethodModel.create(request.body);
  } catch (error) {
    console.log(error);
    return response.status(400).send(error.message);
  }

  return response.status(200).send(savedDeliveryMethod);
});

module.exports = router;
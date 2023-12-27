const router = require('express').Router();
const { verifyJwtToken } = require('../middleware/authorize');
const DeliveryMethodModel = require('../models/deliveryMethod');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
  const { responseDataType } = request.query;
  
  const shouldRenderHtmlPage = !responseDataType || responseDataType.toUpperCase() !== 'JSON';

  if (shouldRenderHtmlPage) {
    return response.render('viewDeliveryMethods');
  }

  const deliveryMethods = await DeliveryMethodModel.find().exec();

  return response.send(deliveryMethods);
})

router.get('/form', async (request, response) => {
    return response.render('createDeliveryMethod');
});

router.post('/', async (request, response) => {
  let savedDeliveryMethod;

  try {
    savedDeliveryMethod = await DeliveryMethodModel.create(request.body);
  } catch (error) {
    console.log(error);
    return response.status(400).send(error.message);
  }

  return response.status(200).send(savedDeliveryMethod);
});

module.exports = router;
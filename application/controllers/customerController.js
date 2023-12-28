const router = require('express').Router();
const { verifyJwtToken } = require('../middleware/authorize');
const CustomerModel = require('../models/customer');

router.use(verifyJwtToken);

router.get('/form', async (request, response) => {
    return response.render('createCustomer');
});

router.post('/', async (request, response) => {
  try {
    const customer = await CustomerModel.create(request.body);
    return response.status(201).json(customer);
  } catch (error) {
    console.log('Error creating customer: ', error);
    return response.status(400).send(error.message);
  }
})

module.exports = router;
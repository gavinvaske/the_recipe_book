const router = require('express').Router();
const { verifyJwtToken } = require('../middleware/authorize');
const CustomerModel = require('../models/customer');

router.use(verifyJwtToken);

const SUCCESSFULLY_CREATED_STATUS_CODE = 201;
const BAD_REQUEST_STATUS_CODE = 400;

router.get('/form', async (request, response) => {
    return response.render('createCustomer');
});

router.post('/', async (request, response) => {
    try {
        const customer = await CustomerModel.create(request.body);
        return response.status(SUCCESSFULLY_CREATED_STATUS_CODE).json(customer);
    } catch (error) {
        console.log('Error creating customer: ', error);
        return response.status(BAD_REQUEST_STATUS_CODE).send(error.message);
    }
});

module.exports = router;
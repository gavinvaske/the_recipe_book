const router = require('express').Router();
const { verifyJwtToken } = require('../middleware/authorize');
const CreditTermModel = require('../models/creditTerm');

router.use(verifyJwtToken);

const SUCCESSFULLY_CREATED_STATUS_CODE = 201;
const BAD_REQUEST_STATUS_CODE = 400;

router.get('/', async (request, response) => {
    const { responseDataType } = request.query;
  
    const shouldRenderHtmlPage = !responseDataType || responseDataType.toUpperCase() !== 'JSON';

    if (shouldRenderHtmlPage) {
        return response.render('viewCreditTerms');
    }

    const creditTerms = await CreditTermModel.find().exec();

    return response.send(creditTerms);
});

router.get('/form', async (request, response) => {
    return response.render('createCreditTerms');
});

router.post('/', async (request, response) => {
    let savedCreditTerm;

    try {
        savedCreditTerm = await CreditTermModel.create(request.body);
    } catch (error) {
        console.log(error);
        return response.status(BAD_REQUEST_STATUS_CODE).send(error.message);
    }

    return response.status(SUCCESSFULLY_CREATED_STATUS_CODE).send(savedCreditTerm);
});

module.exports = router;
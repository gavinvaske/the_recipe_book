const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const quoteService = require('../services/quoteService');

router.use(verifyJwtToken);

const BAD_REQUEST_STATUS = 400;

router.post('/', async (request, response) => {
    const labelQuantities = request.body.labelQuantities;
    delete request.body.labelQuantities;
    const quoteInputs = request.body;
    
    try {
        const quotes = await quoteService.createQuotes(labelQuantities, quoteInputs);
        return response.send(quotes);
    } catch (error) {
        console.log('Error creating quotes: ', error);
        return response.status(BAD_REQUEST_STATUS).send(error.message);
    }
});

module.exports = router;
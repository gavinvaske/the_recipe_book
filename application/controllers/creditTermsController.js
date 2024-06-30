const router = require('express').Router();
const { SUCCESS, SERVER_ERROR, BAD_REQUEST, CREATED_SUCCESSFULLY } = require('../enums/httpStatusCodes');
const { verifyJwtToken } = require('../middleware/authorize');
const CreditTermModel = require('../models/creditTerm');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    const creditTerms = await CreditTermModel.find().exec();

    return response.send(creditTerms);
});

router.post('/', async (request, response) => {
    let savedCreditTerm;

    try {
        savedCreditTerm = await CreditTermModel.create(request.body);
    } catch (error) {
        console.log(error);
        return response.status(BAD_REQUEST).send(error.message);
    }

    return response.status(CREATED_SUCCESSFULLY).send(savedCreditTerm);
});

router.delete('/:mongooseId', async (request, response) => {
    try { 
        await CreditTermModel.findByIdAndDelete(request.params.mongooseId).exec();

        return response.status(SUCCESS);
    } catch (error) {
        console.error('Failed to delete creditTerm: ', error);

        return response.status(SERVER_ERROR).send(error.message);
    }
});

router.patch('/:mongooseId', async (request, response) => {
    try {
        const updatedCreditTerm = await CreditTermModel.findOneAndUpdate(
            {_id: request.params.mongooseId}, 
            {$set: request.body}, 
            {runValidators: true, new: true}
        ).exec();

        return response.json(updatedCreditTerm);
    } catch (error) {
        console.error('Failed to update creditTerm: ', error.message);

        response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

module.exports = router;
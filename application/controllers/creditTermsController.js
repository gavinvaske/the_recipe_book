import { Router } from 'express'
const router = Router();
import { SUCCESS, SERVER_ERROR, BAD_REQUEST, CREATED_SUCCESSFULLY } from '../enums/httpStatusCodes.js';
import { verifyJwtToken }from '../middleware/authorize.js'
const CreditTermModel = require('../models/creditTerm');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    try {
        const creditTerms = await CreditTermModel.find().exec();

        return response.send(creditTerms);
    } catch (error) {
        console.error('Error fetching creditTerms: ', error);

        return response.status(SERVER_ERROR).send(error.message);
    }
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
        const deletedCreditTerm = await CreditTermModel.findByIdAndDelete(request.params.mongooseId).exec();

        return response.status(SUCCESS).json(deletedCreditTerm);
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
        console.error('Failed to update creditTerm: ', error);

        response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.get('/:mongooseId', async (request, response) => {
    try {
        const creditTerm = await CreditTermModel.findById(request.params.mongooseId);

        return response.json(creditTerm);
    } catch (error) {
        console.error('Error searching for creditTerm: ', error);

        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

module.exports = router;
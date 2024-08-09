import { Router } from 'express';
const router = Router();
import { SERVER_ERROR, CREATED_SUCCESSFULLY, SUCCESS } from '../enums/httpStatusCodes.ts';
import { verifyBearerToken } from '../middleware/authorize.ts';
import { CustomerModel } from '../models/customer.ts';

router.use(verifyBearerToken);

router.get('/', async (_, response) => {
    try {
        const customers = await CustomerModel.find().exec();

        return response.json(customers);
    } catch (error) {
        console.error('Error fetching customers: ', error);

        return response.status(SERVER_ERROR).send(error.message);
    }
});

router.delete('/:mongooseId', async (request, response) => {
    try {
        const customer = await CustomerModel.findByIdAndDelete(request.params.mongooseId).exec();
      
        return response.status(SUCCESS).json(customer);
    } catch (error) {
        console.error('Failed to delete customer: ', error);

        return response.status(SERVER_ERROR).send(error.message);
    }
});

router.post('/', async (request, response) => {
    try {
        const customer = await CustomerModel.create(request.body);
        return response.status(CREATED_SUCCESSFULLY).json(customer);
    } catch (error) {
        console.log('Error creating customer: ', error);
        return response.status(SERVER_ERROR).send(error.message);
    }
});

router.patch('/:mongooseId', async (request, response) => {
    try {
        const updatedCustomer = await CustomerModel.findOneAndUpdate(
            { _id: request.params.mongooseId }, 
            { $set: request.body }, 
            { runValidators: true, new: true }
        ).exec();

        return response.json(updatedCustomer);
    } catch (error) {
        console.error('Failed to update customer: ', error);

        response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.get('/:mongooseId', async (request, response) => {
    try {
        const customer = await CustomerModel.findById(request.params.mongooseId);

        return response.json(customer);
    } catch (error) {
        console.error('Error searching for customer: ', error);

        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

export default router;
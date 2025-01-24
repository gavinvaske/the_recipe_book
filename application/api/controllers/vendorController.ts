import express from 'express';
const router = express.Router();
import { VendorModel } from '../models/vendor.ts';
import { verifyBearerToken } from '../middleware/authorize.ts';
import { CREATED_SUCCESSFULLY, SERVER_ERROR, SUCCESS } from '../enums/httpStatusCodes.ts'; 

router.use(verifyBearerToken);

router.get('/', async (_, response) => {
    try {
        const vendors = await VendorModel.find().exec();
        return response.json(vendors);
    } catch (error) {
        console.error('Error fetching vendors: ', error);
        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.post('/', async (request, response) => {
    try {
        const vendor = await VendorModel.create(request.body);
        return response.status(CREATED_SUCCESSFULLY).json(vendor);
    } catch (error) {
        console.log('Error creating vendor: ', error.message);
        return response.status(SERVER_ERROR).send(error.message);
    }
});

router.patch('/:mongooseId', async (request, response) => {
    try {
        const updatedVendor = await VendorModel.findOneAndUpdate(
            { _id: request.params.mongooseId }, 
            { $set: request.body }, 
            { runValidators: true, new: true }
        ).exec();

        return response.json(updatedVendor);
    } catch (error) {
        console.error('Failed to update vendor: ', error.message);

        response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.get('/:mongooseId', async (request, response) => {
    try {
        const vendors = await VendorModel.findById(request.params.mongooseId)
        return response.json(vendors);
    } catch (error) {
        console.error('Error fetching vendors: ', error);
        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.delete('/:mongooseId', async (request, response) => {
    try {
        const deletedAdhesiveCategory = await VendorModel.findByIdAndDelete(request.params.mongooseId).exec();
    
        return response.status(SUCCESS).json(deletedAdhesiveCategory);
    } catch (error) {
        console.error('Failed to delete vendor: ', error);

        return response.status(SERVER_ERROR).send(error.message);
    }
});

export default router;
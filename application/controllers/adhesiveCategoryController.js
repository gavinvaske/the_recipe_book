import { Router } from 'express';
const router = Router();
import { verifyJwtToken } from '../middleware/authorize';
import AdhesiveCategoryModel from '../models/adhesiveCategory';
import { CREATED_SUCCESSFULLY, SERVER_ERROR, SUCCESS } from '../enums/httpStatusCodes';

router.use(verifyJwtToken);

router.delete('/:mongooseId', async (request, response) => {
    try {
        const deletedAdhesiveCategory = await AdhesiveCategoryModel.findByIdAndDelete(request.params.mongooseId).exec();
    
        return response.status(SUCCESS).json(deletedAdhesiveCategory);
    } catch (error) {
        console.error('Failed to delete adhesiveCategory: ', error);

        return response.status(SERVER_ERROR).send(error.message);
    }
});

router.get('/', async (_, response) => {
    try {
        const adhesiveCategories = await AdhesiveCategoryModel.find().exec();

        return response.json(adhesiveCategories);
    } catch (error) {
        console.error('Error fetching adhesive category: ', error);
        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.patch('/:mongooseId', async (request, response) => {
    try {
        const updatedAdhesiveCategory = await AdhesiveCategoryModel.findOneAndUpdate(
            { _id: request.params.mongooseId }, 
            { $set: request.body }, 
            { runValidators: true, new: true }
        ).exec();

        return response.json(updatedAdhesiveCategory);
    } catch (error) {
        console.error('Failed to update adhesiveCategory: ', error);

        response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.post('/', async (request, response) => {
    let savedAdhesiveCategory;

    try {
        savedAdhesiveCategory = await AdhesiveCategoryModel.create(request.body);

        return response
            .status(CREATED_SUCCESSFULLY)
            .send(savedAdhesiveCategory);
    } catch (error) {
        console.error('Error creating adhesive category: ', error);
        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.get('/:mongooseId', async (request, response) => {
    try {
        const adhesiveCategory = await AdhesiveCategoryModel.findById(request.params.mongooseId);

        return response.json(adhesiveCategory);
    } catch (error) {
        console.error('Error searching for adhesiveCategory: ', error);

        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});


export default router;
const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const AdhesiveCategoryModel = require('../models/adhesiveCategory');
const { CREATED_SUCCESSFULLY, SERVER_ERROR } = require('../enums/httpStatusCodes');

router.use(verifyJwtToken);

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


module.exports = router;
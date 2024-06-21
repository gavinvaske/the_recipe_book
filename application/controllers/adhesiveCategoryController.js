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

router.post('/', async (request, response) => {
    let savedAdhesiveCategory;

    try {
        savedAdhesiveCategory = await AdhesiveCategoryModel.create(request.body);
    } catch (error) {
        console.error('Error creating adhesive category: ', error);
        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }

    return response
        .status(CREATED_SUCCESSFULLY)
        .send(savedAdhesiveCategory);
});


module.exports = router;
const express = require('express');
const router = express.Router();
const {verifyJwtToken} = require('../middleware/authorize');
const RecipeModel = require('../models/recipe');

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_RESULTS_PER_PAGE = 2;
const DEFAULT_SORT_METHOD = 'ascending';
const MONGOOSE_SORT_METHODS = {
    'ascending': 1,
    'descending': -1
};

router.use(verifyJwtToken);

router.post('/query', async (request, response) => {
    const {query, pageNumber, resultsPerPage} = request.body;

    const searchCriteria = {
        $or:[
            {designNumber: {$regex: query, $options: 'i'}},
            {dieNumber: {$regex: query, $options: 'i'}},
            {notes: {$regex: query, $options: 'i'}},
            {howToVideo: {$regex: query, $options: 'i'}}
        ]};
    const numberOfResultsToSkip = (pageNumber - 1) * resultsPerPage;

    try {
        const searchResults = await RecipeModel
            .find(searchCriteria)
            .populate({
                path: 'author',
                select: 'email'
            })
            .skip(numberOfResultsToSkip)
            .limit(resultsPerPage)
            .exec();

        return response.send(searchResults);
    } catch (error) {
        request.flash('errors', ['A problem occurred while performing your search:', error.message]);
        return response.json({
            error
        });
    }
});

router.get('/delete/:id', async (request, response) => {
    try {
        await RecipeModel.findByIdAndDelete(request.params.id).exec();

        request.flash('alerts', 'Deletion was successful');
        response.redirect('/recipes');
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

router.post('/update/:id', async (request, response) => {
    try {
        await RecipeModel.findByIdAndUpdate(request.params.id, request.body, { runValidators: true }).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect('/recipes');
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

router.get('/update/:id', async (request, response) => {
    try {
        const recipe = await RecipeModel.findById(request.params.id).exec();

        return response.render('updateRecipe', {recipe});
    } catch (error) {
        request.flash('errors', error.message);
        
        return response.redirect('back');
    }
});

router.get('/', async (request, response) => {
    const queryParams = request.query;
    const pageNumber = queryParams.pageNumber || DEFAULT_PAGE_NUMBER;
    const sortBy = queryParams.sortBy;
    const sortMethod = Object.keys(MONGOOSE_SORT_METHODS).includes(queryParams.sortMethod) ? queryParams.sortMethod : DEFAULT_SORT_METHOD;
    let sortQuery = {};

    if (sortBy && sortMethod) {
        sortQuery = {
            [sortBy]: MONGOOSE_SORT_METHODS[sortMethod]
        };
    }

    const numberOfResultsToSkip = (pageNumber - 1) * DEFAULT_RESULTS_PER_PAGE;

    const numberOfRecordsInDatabase = await RecipeModel.countDocuments({});
    const totalNumberOfPages = Math.ceil(numberOfRecordsInDatabase / DEFAULT_RESULTS_PER_PAGE);

    try {
        const recipes = await RecipeModel
            .find()
            .sort(sortQuery)
            .populate({
                path: 'author',
                select: 'email userType profilePicture'
            })
            .skip(numberOfResultsToSkip)
            .limit(DEFAULT_RESULTS_PER_PAGE)
            .exec();
        
        return response.render('viewRecipes', {
            recipes,
            pageNumber,
            totalNumberOfPages,
            sortBy,
            sortMethod
        });
    } catch (error) {
        request.flash('errors', ['Unable to load recipes, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }
});

router.get('/create', (request, response) => {
    response.render('createRecipe', {
        user: request.user
    });
});

router.post('/create', async (request, response) => {
    const {designNumber, dieNumber, notes, howToVideo, authorId} = request.body;
    try {
        await RecipeModel.create({
            designNumber,
            dieNumber,
            notes,
            howToVideo,
            author: authorId
        });
    } catch (error) {
        request.flash('errors', ['Unable to save the recipe, the following error(s) occurred:', error.message]);

        return response.redirect('back');
    }
    request.flash('alerts', ['Recipe created successfully']);

    return response.redirect('/recipes');
});

module.exports = router;
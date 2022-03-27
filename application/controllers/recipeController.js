const express = require('express');
const router = express.Router();
const {verifyJwtToken} = require('../middleware/authorize');
const RecipeModel = require('../models/recipe');

router.post('/query', verifyJwtToken, async (request, response) => {
    const {query, pageNumber, resultsPerPage} = request.body;

    const searchCriteria = {
        $or:[
            {designNumber: {$regex: query, $options: 'i'}},
            {dieNumber: {$regex: query, $options: 'i'}},
            {notes: {$regex: query, $options: 'i'}},
            {howToVideo: {$regex: query, $options: 'i'}}
        ]};
    const numberOfResultsToSkip = [(pageNumber - 1) * resultsPerPage];

    try {
        const searchResults = await RecipeModel
            .find(searchCriteria)
            .skip(numberOfResultsToSkip)
            .limit(resultsPerPage)
            .exec();
            
        return response.send(searchResults);
    } catch (error) {
        request.flash('errors', ['A problem occurred while performing your search:', error.message]);
    }
});

router.get('/delete/:id', verifyJwtToken, async (request, response) => {
    try {
        await RecipeModel.findByIdAndDelete(request.params.id).exec();

        request.flash('alerts', 'Deletion was successful');
        response.redirect('/recipes');
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

router.post('/update/:id', verifyJwtToken, async (request, response) => {
    try {
        await RecipeModel.findByIdAndUpdate(request.params.id, request.body).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect('/recipes');
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

router.get('/update/:id', verifyJwtToken, async (request, response) => {
    try {
        const recipe = await RecipeModel.findById(request.params.id).exec();

        return response.render('updateRecipe', {recipe});
    } catch (error) {
        request.flash('errors', error.message);
        
        return response.redirect('back');
    }
});

router.get('/', verifyJwtToken, verifyJwtToken, async (request, response) => {
    try {
        const recipes = await RecipeModel.find()
            .populate({
                path: 'author',
                select: 'email userType profilePicture'
            }).exec();
        
        return response.render('allRecipes', {
            recipes
        });

    } catch (error) {
        request.flash('errors', ['Unable to load recipes, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }
});

router.get('/create', verifyJwtToken, (request, response) => {
    response.render('createRecipe', {
        user: request.user
    });
});

router.post('/create', verifyJwtToken, async (request, response) => {
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
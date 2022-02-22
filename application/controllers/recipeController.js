const express = require('express');
const router = express.Router();
const {verifyJwtToken} = require('../middleware/authorize');
const RecipeModel = require('../models/recipe');


router.get('/', verifyJwtToken, async (request, response) => {
    try {
        const recipes = await RecipeModel.find()
            .populate({
                path: 'author',
                select: 'email userType'
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
const router = require('express').Router();
const RecipeModel = require('../models/recipe');
const {verifyJwtToken} = require('../middleware/authorize');

router.use(verifyJwtToken);

router.get('/:id', async (request, response) => {
    const recipe = await RecipeModel.findById(request.params.id).exec();

    response.render('setupSelection', {
        recipe
    });
});

module.exports = router;
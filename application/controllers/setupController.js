import { Router } from 'express'
const router = Router();
import RecipeModel from '../models/recipe.js';
import { verifyJwtToken } from '../middleware/authorize.js'

router.use(verifyJwtToken);

router.get('/:id', async (request, response) => {
    const recipe = await RecipeModel.findById(request.params.id).exec();

    response.render('setupSelection', {
        recipe
    });
});

module.exports = router;
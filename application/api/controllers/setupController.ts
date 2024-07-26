import { Router } from 'express';
const router = Router();
import { RecipeModel } from '../models/recipe.ts';
import { verifyJwtToken } from '../middleware/authorize.ts';

router.use(verifyJwtToken);

router.get('/:id', async (request, response) => {
    const recipe = await RecipeModel.findById(request.params.id).exec();

    response.render('setupSelection', {
        recipe
    });
});

export default router;
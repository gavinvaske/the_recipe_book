import { Router } from 'express';
const router = Router();
import { RecipeModel } from '../models/recipe.ts';
import { verifyBearerToken } from '../middleware/authorize.ts';

router.use(verifyBearerToken);

router.get('/:id', async (request, response) => {
    const recipe = await RecipeModel.findById(request.params.id).exec();

    response.render('setupSelection', {
        recipe
    });
});

export default router;
import { Router } from 'express';
const router = Router();
import { verifyJwtToken } from '../middleware/authorize.ts';
import { DieModel } from '../models/Die.ts';

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    const dies = await DieModel.find({}).exec();

    return response.send(dies);
});

export default router;
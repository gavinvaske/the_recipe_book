import { Router } from 'express'
const router = Router();
import { verifyJwtToken } from '../middleware/authorize.js'
import DieModel from '../models/Die.js';

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    const dies = await DieModel.find({}).exec();

    return response.send(dies);
});

export default router;
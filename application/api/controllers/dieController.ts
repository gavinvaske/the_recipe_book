import { Router, Request, Response } from 'express';
const router = Router();
import { verifyBearerToken } from '../middleware/authorize.ts';
import { DieModel } from '../models/Die.ts';
import { SERVER_ERROR } from '../enums/httpStatusCodes.ts';

router.use(verifyBearerToken);

router.get('/', async (_: Request, response: Response) => {
  try {
    const dies = await DieModel.find().exec();

    return response.json(dies);
  } catch (error) {
    console.error(error);
    return response.status(SERVER_ERROR).send(error.message);
  }
});

export default router;
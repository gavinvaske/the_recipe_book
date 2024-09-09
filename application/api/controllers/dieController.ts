import { Router, Request, Response } from 'express';
const router = Router();
import { verifyBearerToken } from '../middleware/authorize.ts';
import { DieModel } from '../models/die.ts';
import { CREATED_SUCCESSFULLY, SERVER_ERROR } from '../enums/httpStatusCodes.ts';

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

router.post('/', async (request: Request, response: Response) => {
  try {
    await DieModel.create(request.body);

    return response.status(CREATED_SUCCESSFULLY).send();
  } catch (error) {
    console.error('Failed to create die:', error.message);
    return response.status(SERVER_ERROR).send(error.message);
  }
});

export default router;
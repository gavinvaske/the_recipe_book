import { Router, Request, Response } from 'express';
const router = Router();
import { verifyBearerToken } from '../middleware/authorize.ts';
import { DieModel } from '../models/die.ts';
import { BAD_REQUEST, CREATED_SUCCESSFULLY, SERVER_ERROR, SUCCESS } from '../enums/httpStatusCodes.ts';

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

router.patch('/:mongooseId', async (request: Request, response: Response) => {
  try {
    const updatedDie = await DieModel.findByIdAndUpdate(
      { _id: request.params.mongooseId },
      { $set: request.body },
      { runValidators: true, new: true }
    ).exec();
    
    return response.json(updatedDie);
  } catch (error) {
    console.error('Failed to update die:', error.message);
    return response.status(BAD_REQUEST).send(error.message);
  }
})

router.get('/:mongooseId', async (request: Request, response: Response) => {
  try {
    const die = await DieModel.findById(request.params.mongooseId);

    if (!die) throw new Error('Die not found');

    return response.json(die);
  } catch (error) {
    console.error('Error fetching die: ', error.message);
    return response.status(BAD_REQUEST).send(error.message);
  }
});

router.delete('/:mongooseId', async (request: Request, response: Response) => {
  try {
    const deletedDie = await DieModel.findByIdAndDelete(request.params.mongooseId).exec();

    if (!deletedDie) throw new Error('Die not found')

    return response.status(SUCCESS).json(deletedDie);
  } catch (error) {
    console.error('Failed to delete die: ', error);

    return response.status(SERVER_ERROR).send(error.message);
  }
});

export default router;
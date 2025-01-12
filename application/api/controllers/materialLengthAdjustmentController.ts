import { Router } from 'express';
const router = Router();
import { CREATED_SUCCESSFULLY, SERVER_ERROR, SUCCESS } from '../enums/httpStatusCodes.ts';
import { verifyBearerToken } from '../middleware/authorize.ts';
import { MaterialLengthAdjustmentModel } from '../models/materialLengthAdjustment.ts';
import { DESCENDING } from '../enums/mongooseSortMethods.ts';

router.use(verifyBearerToken);

router.post('/', async (request, response) => {
    try {
        const savedMaterialLengthAdjustment = await MaterialLengthAdjustmentModel.create(request.body);

        return response
            .status(CREATED_SUCCESSFULLY)
            .send(savedMaterialLengthAdjustment);
    } catch (error) {
        console.error('Error creating materialLengthAdjustment: ', error);
        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.get('/', async (request, response) => {
  try {
    const materialLengthAdjustments = await MaterialLengthAdjustmentModel.find().sort({ updatedAt: DESCENDING }).exec();

    return response.json(materialLengthAdjustments);
  } catch (error) {
      console.error('Error fetching material length adjustments: ', error);

      return response
          .status(SERVER_ERROR)
          .send(error.message);
  }
})

router.get('/:mongooseId', async (request, response) => {
  try {
    const materialLengthAdjustment = await MaterialLengthAdjustmentModel.findById(request.params.mongooseId);

    return response.json(materialLengthAdjustment);
  } catch (error) {
      console.error('Error searching for materialLengthAdjustment: ', error);

      return response
          .status(SERVER_ERROR)
          .send(error.message);
  }
})

router.patch('/:mongooseId', async (request, response) => {
  try {
      const updatedMaterialLengthAdjustment = await MaterialLengthAdjustmentModel.findOneAndUpdate(
          { _id: request.params.mongooseId }, 
          { $set: request.body }, 
          { runValidators: true, new: true }
      ).exec();

      return response.json(updatedMaterialLengthAdjustment);
  } catch (error) {
      console.error('Failed to update materialLengthAdjustment: ', error);

      response
          .status(SERVER_ERROR)
          .send(error.message);
  }
});

router.delete('/:mongooseId', async (request, response) => {
  try { 
      const deletedMaterialLengthAdjustment = await MaterialLengthAdjustmentModel.findByIdAndDelete(request.params.mongooseId).exec();

      return response.status(SUCCESS).json(deletedMaterialLengthAdjustment);
  } catch (error) {
      console.error('Failed to delete materialLengthAdjustment: ', error);

      return response.status(SERVER_ERROR).send(error.message);
  }
});

export default router;
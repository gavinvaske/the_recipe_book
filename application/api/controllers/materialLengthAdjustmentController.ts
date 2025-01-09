import { Router } from 'express';
const router = Router();
import { CREATED_SUCCESSFULLY, SERVER_ERROR } from '../enums/httpStatusCodes.ts';
import { verifyBearerToken } from '../middleware/authorize.ts';
import { MaterialLengthAdjustmentModel } from '../models/materialLengthAdjustment.ts';

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
    const materialLengthAdjustments = await MaterialLengthAdjustmentModel.find().exec();

    console.log('materialLengthAdjustments', materialLengthAdjustments)

    return response.json(materialLengthAdjustments);
} catch (error) {
    console.error('Error fetching material length adjustments: ', error);

    return response
        .status(SERVER_ERROR)
        .send(error.message);
}
})

export default router;
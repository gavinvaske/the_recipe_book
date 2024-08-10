import { Router } from 'express';
const router = Router();
import { SpotPlateModel } from '../models/spotPlate.ts';
import { DieLineModel } from '../models/dieLine.ts';
import * as destinationService from '../services/destinationService.ts';
import { verifyBearerToken } from '../middleware/authorize.ts';

router.use(verifyBearerToken);

router.get('/', async (request, response) => {
    const dieLineRequestPromises = DieLineModel.find({}).exec();
    const spotPlateRequestPromises = SpotPlateModel.find({}).exec();

    const requests = (await Promise.all([dieLineRequestPromises, spotPlateRequestPromises])).flat();

    const requestsGroupedByDestination = destinationService.groupItemsByDestination(requests);

    return response.render('viewRequests', {
        requestsGroupedByDestination
    });
});

export default router;
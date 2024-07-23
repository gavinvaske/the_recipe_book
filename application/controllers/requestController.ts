import { Router } from 'express';
const router = Router();
import SpotPlateModel from '../models/spotPlate';
import DieLineModel from '../models/dieLine';
import * as destinationService from '../services/destinationService';
import { verifyJwtToken } from '../middleware/authorize';

router.use(verifyJwtToken);

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
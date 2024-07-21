import { Router } from 'express'
const router = Router();
import SpotPlateModel from '../models/spotPlate.js';
import DieLineModel from '../models/dieLine.js';
import * as destinationService from '../services/destinationService.js';
import { verifyJwtToken } from '../middleware/authorize.js'

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

module.exports = router;
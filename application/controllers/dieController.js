import { Router } from 'express'
const router = Router();
import { verifyJwtToken } from '../middleware/authorize.js'
const DieModel = require('../models/Die');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    const dies = await DieModel.find({}).exec();

    return response.send(dies);
});

module.exports = router;
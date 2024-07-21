import { Router } from 'express'
const router = Router();
const {verifyJwtToken} = require('../middleware/authorize');
const DieModel = require('../models/Die');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    const dies = await DieModel.find({}).exec();

    return response.send(dies);
});

module.exports = router;
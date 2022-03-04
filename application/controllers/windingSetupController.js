const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const WindingSetupModel = require('../models/windingSetup');
const UserModel = require('../models/user');
const MachineModel = require('../models/machine');
const MaterialModel = require('../models/material');
const FinishModel = require('../models/finish');

router.get('/all/:recipeId', verifyJwtToken, async (request, response) => {
    const windingSetups = await WindingSetupModel
                            .find({recipe: request.params.recipeId})
                            .populate({path: 'author'})
                            .populate({path: 'machine'})
                            .populate({path: 'defaultMachine'})
                            .exec();

    return response.render('viewWindingSetups', {
        recipeId: request.params.recipeId,
        windingSetups
    });
});

router.get('/create/:recipeId', verifyJwtToken, async (request, response) => {
    const users = await UserModel.find().exec();
    const machines = await MachineModel.find().exec();
    const materials = await MaterialModel.find().exec();
    const finishes = await FinishModel.find().exec();

    return response.render('createWindingSetup', {
        recipeId: request.params.recipeId,
        users,
        machines,
        materials,
        finishes
    });
});

router.post('/create', verifyJwtToken, async (request, response) => {
    try {
        await WindingSetupModel.create(request.body);
    } catch(error) {
        console.log(error);
        request.flash('errors', ['Unable to create the Winding Setup, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }

    request.flash('alerts', ['Winding Setup created successfully']);

    return response.redirect(`/winding-setups/all/${request.body.recipe}`);
});

module.exports = router;
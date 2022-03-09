const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const CuttingSetupModel = require('../models/cuttingSetup');
const UserModel = require('../models/user');
const MachineModel = require('../models/machine');
const MaterialModel = require('../models/material');
const FinishModel = require('../models/finish');

router.get('/create/:recipeId', verifyJwtToken, async (request, response) => {
    const users = await UserModel.find().exec();
    const machines = await MachineModel.find().exec();
    const materials = await MaterialModel.find().exec();
    const finishes = await FinishModel.find().exec();

    return response.render('createCuttingSetup', {
        recipeId: request.params.recipeId,
        users,
        machines,
        materials,
        finishes
    });
});

router.get('/all/:recipeId', verifyJwtToken, async (request, response) => {
    const cuttingSetups = await CuttingSetupModel
        .find({recipe: request.params.recipeId})
        .populate({path: 'author'})
        .populate({path: 'finish'})
        .populate({path: 'machine'})
        .populate({path: 'defaultMachine'})
        .exec();

    return response.render('viewCuttingSetups', {
        recipeId: request.params.recipeId,
        cuttingSetups
    });
});

router.post('/create', verifyJwtToken, async (request, response) => {
    try {
        await CuttingSetupModel.create(request.body);
    } catch (error) {
        console.log(error);
        request.flash('errors', ['Unable to create the Cutting Setup, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }

    request.flash('alerts', ['Cutting Setup created successfully']);

    return response.redirect(`/cutting-setups/all/${request.body.recipe}`);
});

router.get('/delete/:id', verifyJwtToken, async (request, response) => {
    try {
        await CuttingSetupModel.findByIdAndDelete(request.params.id).exec();

        request.flash('alerts', 'Deletion was successful');
        return response.redirect('back');
    } catch (error) {
        console.log(error);
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

router.get('/update/:id', verifyJwtToken, async (request, response) => {
    try {
        const users = await UserModel.find().exec();
        const machines = await MachineModel.find().exec();
        const finishes = await FinishModel.find().exec();

        const cuttingSetup = await CuttingSetupModel.findById(request.params.id)
            .populate({path: 'author'})
            .populate({path: 'machine'})
            .populate({path: 'finish'})
            .populate({path: 'defaultMachine'})
            .exec();

        return response.render('updateCuttingSetup', {
            cuttingSetup,
            users,
            machines,
            finishes
        });
    } catch (error) {
        console.log(error);
        request.flash('errors', [error.message]);

        return response.redirect('back');
    }
});

router.post('/update/:id', verifyJwtToken, async (request, response) => {
    try {
        await CuttingSetupModel.findByIdAndUpdate(request.params.id, request.body).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect(`/cutting-setups/all/${request.body.recipe}`);
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

module.exports = router;
const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const UserModel = require('../models/user');
const MachineModel = require('../models/machine');
const MaterialModel = require('../models/material');
const PrintingSetupModel = require('../models/printingSetup');

router.get('/all/:recipeId', verifyJwtToken, async (request, response) => {
    const printingSetups = await PrintingSetupModel
                            .find({recipe: request.params.recipeId})
                            .populate({path: 'author'})
                            .populate({path: 'machine'})
                            .populate({path: 'material'})
                            .populate({path: 'defaultMachine'})
                            .exec();
    return response.render('viewPrintingSetups', {
        recipeId: request.params.recipeId,
        printingSetups
    });
});

router.get('/create/:recipeId', verifyJwtToken, async (request, response) => {
    const users = await UserModel.find().exec();
    const machines = await MachineModel.find().exec();
    const materials = await MaterialModel.find().exec();

    return response.render('createPrintingSetup', {
        recipeId: request.params.recipeId,
        users,
        machines,
        materials
    });
});

router.post('/create', verifyJwtToken, async (request, response) => {
    try {
        await PrintingSetupModel.create(request.body);
    } catch(error) {
        console.log(error);
        request.flash('errors', ['Unable to create the Printing Setup, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }

    request.flash('alerts', ['Printing Setup created successfully']);

    return response.redirect(`/printing-setups/all/${request.body.recipe}`);
});

router.get('/delete/:id', verifyJwtToken, async (request, response) => {
    try {
        await PrintingSetupModel.findByIdAndDelete(request.params.id).exec();

        request.flash('alerts', 'Deletion was successful');
        return response.redirect('back');
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

module.exports = router;
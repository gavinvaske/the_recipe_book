const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const UserModel = require('../models/user');
const MachineModel = require('../models/machine');
const MaterialModel = require('../models/material');
const PrintingSetupModel = require('../models/printingSetup');

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_RESULTS_PER_PAGE = 2;

router.get('/all/:recipeId', verifyJwtToken, async (request, response) => {
    const searchQuery = {recipe: request.params.recipeId};
    let pageNumber = request.query.pageNumber || DEFAULT_PAGE_NUMBER;
    const numberOfResultsToSkip = (pageNumber - 1) * DEFAULT_RESULTS_PER_PAGE;

    const numberOfRecordsInDatabase = await PrintingSetupModel.countDocuments(searchQuery);
    const totalNumberOfPages = Math.ceil(numberOfRecordsInDatabase / DEFAULT_RESULTS_PER_PAGE);

    const printingSetups = await PrintingSetupModel
        .find(searchQuery)
        .populate({path: 'author'})
        .populate({path: 'machine'})
        .populate({path: 'material'})
        .populate({path: 'defaultMachine'})
        .skip(numberOfResultsToSkip)
        .limit(DEFAULT_RESULTS_PER_PAGE)
        .exec();
    return response.render('viewPrintingSetups', {
        recipeId: request.params.recipeId,
        printingSetups,
        pageNumber,
        totalNumberOfPages
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
    } catch (error) {
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
        console.log(error);
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

router.get('/update/:id', verifyJwtToken, async (request, response) => {
    try {
        const users = await UserModel.find().exec();
        const machines = await MachineModel.find().exec();
        const materials = await MaterialModel.find().exec();

        const printingSetup = await PrintingSetupModel.findById(request.params.id)
            .populate({path: 'author'})
            .populate({path: 'machine'})
            .populate({path: 'material'})
            .populate({path: 'defaultMachine'})
            .exec();

        return response.render('updatePrintingSetup', {
            printingSetup,
            users,
            machines,
            materials
        });
    } catch (error) {
        console.log(error);
        request.flash('errors', [error.message]);

        return response.redirect('back');
    }
});

router.post('/update/:id', verifyJwtToken, async (request, response) => {
    try {
        await PrintingSetupModel.findByIdAndUpdate(request.params.id, request.body).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect(`/printing-setups/all/${request.body.recipe}`);
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

module.exports = router;
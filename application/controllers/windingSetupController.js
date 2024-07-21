import { Router } from 'express'
const router = Router();
import { verifyJwtToken } from '../middleware/authorize.js'
const WindingSetupModel = require('../models/windingSetup');
import UserModel from '../models/user';
import MachineModel from '../models/machine.js'
const MaterialModel = require('../models/material');
import FinishModel from '../models/finish.js'

router.use(verifyJwtToken);

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_RESULTS_PER_PAGE = 2;
const DEFAULT_SORT_METHOD = 'ascending';
const MONGOOSE_SORT_METHODS = {
    'ascending': 1,
    'descending': -1
};

router.post('/:recipeId/query', async (request, response) => {
    const hardCodedSearchResults = [{}, {}, {}];

    return response.send(hardCodedSearchResults);
});

router.get('/:windingSetupId', async (request, response) => {
    try {
        const windingSetup = await WindingSetupModel
            .findById(request.params.windingSetupId)
            .populate({path: 'author'})
            .populate({path: 'machine'})
            .populate({path: 'defaultMachine'})
            .exec();

        return response.render('viewOneWindingSetup', {windingSetup});
    } catch (error) {
        console.log(error);
        request.flash('errors', 'Unable to find an object using the ID provided');

        return response.redirect('back');
    }
});

router.get('/all/:recipeId', async (request, response) => {
    const queryParams = request.query;
    const sortBy = queryParams.sortBy;
    const sortMethod = Object.keys(MONGOOSE_SORT_METHODS).includes(queryParams.sortMethod) ? queryParams.sortMethod : DEFAULT_SORT_METHOD;
    let sortQuery = {};

    if (sortBy && sortMethod) {
        sortQuery = {
            [sortBy]: MONGOOSE_SORT_METHODS[sortMethod]
        };
    }

    const searchQuery = {recipe: request.params.recipeId};
    let pageNumber = queryParams.pageNumber || DEFAULT_PAGE_NUMBER;
    const numberOfResultsToSkip = (pageNumber - 1) * DEFAULT_RESULTS_PER_PAGE;

    const numberOfRecordsInDatabase = await WindingSetupModel.countDocuments(searchQuery);
    const totalNumberOfPages = Math.ceil(numberOfRecordsInDatabase / DEFAULT_RESULTS_PER_PAGE);

    const windingSetups = await WindingSetupModel
        .find({recipe: request.params.recipeId})
        .sort(sortQuery)
        .populate({path: 'author'})
        .populate({path: 'machine'})
        .populate({path: 'defaultMachine'})
        .skip(numberOfResultsToSkip)
        .limit(DEFAULT_RESULTS_PER_PAGE)
        .exec();

    return response.render('viewWindingSetups', {
        recipeId: request.params.recipeId,
        windingSetups,
        pageNumber,
        totalNumberOfPages,
        sortBy,
        sortMethod
    });
});

router.get('/create/:recipeId', async (request, response) => {
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

router.post('/create', async (request, response) => {
    try {
        await WindingSetupModel.create(request.body);
    } catch (error) {
        console.log(error);
        request.flash('errors', ['Unable to create the Winding Setup, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }

    request.flash('alerts', ['Winding Setup created successfully']);

    return response.redirect(`/winding-setups/all/${request.body.recipe}`);
});

router.get('/delete/:id', async (request, response) => {
    try {
        await WindingSetupModel.findByIdAndDelete(request.params.id).exec();

        request.flash('alerts', 'Deletion was successful');
        return response.redirect('back');
    } catch (error) {
        console.log(error);
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

router.get('/update/:id', async (request, response) => {
    try {
        const users = await UserModel.find().exec();
        const machines = await MachineModel.find().exec();

        const windingSetup = await WindingSetupModel.findById(request.params.id)
            .populate({path: 'author'})
            .populate({path: 'machine'})
            .populate({path: 'defaultMachine'})
            .exec();

        return response.render('updateWindingSetup', {
            windingSetup,
            users,
            machines
        });
    } catch (error) {
        console.log(error);
        request.flash('errors', [error.message]);

        return response.redirect('back');
    }
});

router.post('/update/:id', async (request, response) => {
    try {
        await WindingSetupModel.findByIdAndUpdate(request.params.id, request.body, { runValidators: true }).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect(`/winding-setups/all/${request.body.recipe}`);
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

module.exports = router;
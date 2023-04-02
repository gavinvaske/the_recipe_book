const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const CuttingSetupModel = require('../models/cuttingSetup');
const UserModel = require('../models/user');
const MachineModel = require('../models/machine');
const MaterialModel = require('../models/material');
const FinishModel = require('../models/finish');

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_RESULTS_PER_PAGE = 2;
const DEFAULT_SORT_METHOD = 'ascending';
const MONGOOSE_SORT_METHODS = {
    'ascending': 1,
    'descending': -1
};

router.use(verifyJwtToken);

router.post('/:recipeId/query', async (request, response) => {
    const hardCodedSearchResults = [{}, {}, {}];

    return response.send(hardCodedSearchResults);
});

router.get('/:cuttingSetupId', async (request, response) => {
    try {
        const cuttingSetup = await CuttingSetupModel
            .findById(request.params.cuttingSetupId)
            .populate({path: 'author'})
            .populate({path: 'finish'})
            .populate({path: 'machine'})
            .populate({path: 'defaultMachine'})
            .exec();

        return response.render('viewOneCuttingSetup', {cuttingSetup});
    } catch (error) {
        console.log(error);
        request.flash('errors', 'Unable to load the object using the ID which was provided');
    }
});

router.get('/create/:recipeId', async (request, response) => {
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

    const numberOfRecordsInDatabase = await CuttingSetupModel.countDocuments(searchQuery);
    const totalNumberOfPages = Math.ceil(numberOfRecordsInDatabase / DEFAULT_RESULTS_PER_PAGE);

    const cuttingSetups = await CuttingSetupModel
        .find(searchQuery)
        .sort(sortQuery)
        .populate({path: 'author'})
        .populate({path: 'finish'})
        .populate({path: 'machine'})
        .populate({path: 'defaultMachine'})
        .skip(numberOfResultsToSkip)
        .limit(DEFAULT_RESULTS_PER_PAGE)
        .exec();

    return response.render('viewCuttingSetups', {
        recipeId: request.params.recipeId,
        cuttingSetups,
        pageNumber,
        totalNumberOfPages,
        sortBy,
        sortMethod
    });
});

router.post('/create', async (request, response) => {
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

router.get('/delete/:id', async (request, response) => {
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

router.get('/update/:id', async (request, response) => {
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

router.post('/update/:id', async (request, response) => {
    try {
        await CuttingSetupModel.findByIdAndUpdate(request.params.id, request.body, { runValidators: true }).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect(`/cutting-setups/all/${request.body.recipe}`);
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

module.exports = router;
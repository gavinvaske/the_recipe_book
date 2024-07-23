import { Router } from 'express';
const router = Router();
import { verifyJwtToken } from '../middleware/authorize';
import UserModel from '../models/user';
import MachineModel from '../models/machine';
import MaterialModel from '../models/material';
import PrintingSetupModel from '../models/printingSetup';

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

router.get('/:printingSetupId', async (request, response) => {
    try {
        const printingSetup = await PrintingSetupModel
            .findById(request.params.printingSetupId)
            .populate({path: 'author'})
            .populate({path: 'machine'})
            .populate({path: 'material'})
            .populate({path: 'defaultMachine'})
            .exec();

        return response.render('viewOnePrintingSetup', {printingSetup});
    } catch (error) {
        console.log(error);
        request.flash('errors', 'Unable to find object using the ID which was provided');

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

    const numberOfRecordsInDatabase = await PrintingSetupModel.countDocuments(searchQuery);
    const totalNumberOfPages = Math.ceil(numberOfRecordsInDatabase / DEFAULT_RESULTS_PER_PAGE);

    const printingSetups = await PrintingSetupModel
        .find(searchQuery)
        .sort(sortQuery)
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
        totalNumberOfPages,
        sortBy,
        sortMethod
    });
});

router.get('/create/:recipeId', async (request, response) => {
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

router.post('/create', async (request, response) => {
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

router.get('/delete/:id', async (request, response) => {
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

router.get('/update/:id', async (request, response) => {
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

router.post('/update/:id', async (request, response) => {
    try {
        await PrintingSetupModel.findByIdAndUpdate(request.params.id, request.body, { runValidators: true }).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect(`/printing-setups/all/${request.body.recipe}`);
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

export default router;
import { Router } from 'express';
const router = Router();
import { FinishModel } from '../models/finish.ts';
import { verifyJwtToken } from '../middleware/authorize.ts';

const SHOW_ALL_FINISHES_ENDPOINT = '/finishes';

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
    try {
        const finishes = await FinishModel.find().exec();
        
        return response.render('viewFinishes', {
            finishes: finishes
        });

    } catch (error) {
        request.flash('errors', ['Unable to load Finishes, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }
});

router.get('/create', (request, response) => {
    return response.render('createFinish');
});

router.post('/create', async (request, response) => {
    const {name} = request.body;
    try {
        await FinishModel.create({name});
    } catch (error) {
        request.flash('errors', ['Unable to save the Finish, the following error(s) occurred:', error.message]);

        return response.redirect('back');
    }
    request.flash('alerts', ['Finish created successfully']);

    return response.redirect(SHOW_ALL_FINISHES_ENDPOINT);
});

router.get('/update/:id', async (request, response) => {
    try {
        const finish = await FinishModel.findById(request.params.id).exec();

        return response.render('updateFinish', {finish});
    } catch (error) {
        request.flash('errors', error.message);
        
        return response.redirect('back');
    }
});

router.post('/update/:id', async (request, response) => {
    try {
        await FinishModel.findByIdAndUpdate(request.params.id, request.body, { runValidators: true }).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect(SHOW_ALL_FINISHES_ENDPOINT);
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

router.get('/delete/:id', async (request, response) => {
    try {
        await FinishModel.findByIdAndDelete(request.params.id).exec();

        request.flash('alerts', 'Deletion was successful');
    } catch (error) {
        request.flash('errors', error.message);
    }

    return response.redirect('back');
});

export default router;
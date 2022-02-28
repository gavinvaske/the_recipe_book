const router = require('express').Router();
const FinishModel = require('../models/finish');
const {verifyJwtToken} = require('../middleware/authorize');

router.get('/', verifyJwtToken, async (request, response) => {
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

router.get('/create', verifyJwtToken, (request, response) => {
    return response.render('createFinish');
});

router.post('/create', verifyJwtToken, async (request, response) => {
    const {name} = request.body;
    try {
        await FinishModel.create({name});
    } catch (error) {
        request.flash('errors', ['Unable to save the Finish, the following error(s) occurred:', error.message]);

        return response.redirect('back');
    }
    request.flash('alerts', ['Finish created successfully']);

    return response.redirect('/finishes');
});

module.exports = router;
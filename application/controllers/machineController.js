const router = require('express').Router();
const MachineModel = require('../models/machine');
const {verifyJwtToken} = require('../middleware/authorize');

router.get('/', verifyJwtToken, async (request, response) => {
    try {
        const machines = await MachineModel.find().exec();
        
        return response.render('viewMachines', {
            machines: machines
        });

    } catch (error) {
        request.flash('errors', ['Unable to load Machines, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }
});

router.get('/create', verifyJwtToken, (request, response) => {
    return response.render('createMachine');
});

router.post('/create', verifyJwtToken, async (request, response) => {
    const {name} = request.body;
    try {
        await MachineModel.create({name});
    } catch (error) {
        request.flash('errors', ['Unable to save the Machine, the following error(s) occurred:', error.message]);

        return response.redirect('back');
    }
    request.flash('alerts', ['Machine created successfully']);

    return response.redirect('/machines');
});

module.exports = router;
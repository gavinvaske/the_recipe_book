const router = require('express').Router();
const MachineModel = require('../models/machine');
const {verifyJwtToken} = require('../middleware/authorize');

const SHOW_ALL_MACHINES_ENDPOINT = '/machines';

router.use(verifyJwtToken);

router.get('/all', async (request, response) => {
    try {
        
        const machines = await MachineModel.find().exec();
        
        return response.send(machines);

    } catch (error) {
        request.flash('errors', ['Unable to search Machines, the following error(s) occurred:', error.message]);
        return response.redirect('back');
    }
});

router.get('/', async (request, response) => {
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

router.get('/create', (request, response) => {
    return response.render('createMachine');
});

router.post('/create', async (request, response) => {
    const {name} = request.body;
    try {
        await MachineModel.create({name});
    } catch (error) {
        request.flash('errors', ['Unable to save the Machine, the following error(s) occurred:', error.message]);

        return response.redirect('back');
    }
    request.flash('alerts', ['Machine created successfully']);

    return response.redirect(SHOW_ALL_MACHINES_ENDPOINT);
});

router.get('/update/:id', async (request, response) => {
    try {
        const machine = await MachineModel.findById(request.params.id);

        return response.render('updateMachine', {machine});
    } catch (error) {
        console.log(error);
        request.flash('errors', [error.message]);

        return response.redirect('back');
    }
});

router.post('/update/:id', async (request, response) => {
    try {
        await MachineModel.findByIdAndUpdate(request.params.id, request.body, { runValidators: true }).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect(SHOW_ALL_MACHINES_ENDPOINT);
    } catch (error) {
        console.log(error);
        request.flash('errors', error.message);

        return response.redirect('back');
    }
});

router.get('/delete/:id', async (request, response) => {
    try {
        await MachineModel.findByIdAndDelete(request.params.id).exec();

        request.flash('alerts', 'Deletion was successful');
    } catch (error) {
        console.log(error);
        request.flash('errors', error.message);
    }
    
    return response.redirect('back');
});

module.exports = router;
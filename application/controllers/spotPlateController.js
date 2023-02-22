const router = require('express').Router();
const SpotPlateModel = require('../models/spotPlate');

router.get('/', (request, response) => {
    return response.render('viewRequests');
});

router.get('/form', (request, response) => {
    return response.render('createSpotPlate');
});

router.post('/', async (request, response) => {
    try {
        await SpotPlateModel.create(request.body);

        return response.redirect('/spot-plates');
    } catch (error) {
        console.log(`Error creating spot-plate: ${error.message}`);
        request.flash('errors', ['The following error(s) occurred while creating the spot-plate:', ...mongooseService.parseHumanReadableMessages(error)]);
        
        return response.redirect('back');
    }

});

module.exports = router;
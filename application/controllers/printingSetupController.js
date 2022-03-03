const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');

router.get('/all/:recipeId', verifyJwtToken, (request, response) => {
    return response.render('viewPrintingSetups', {
        recipeId: request.params.recipeId
    });
});

router.get('/create/:recipeId', verifyJwtToken, (request, response) => {
    return response.render('createPrintingSetup', {
        recipeId: request.params.recipeId,
        user: request.user
    });
});

router.post('/create', verifyJwtToken, (request, response) => {
    response.send('TODO: POST /printing-setups/create');
});

module.exports = router;
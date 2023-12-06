const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');

router.use(verifyJwtToken);

router.get('/form', async (request, response) => {
    return response.render('createQuote');
});

router.post('/', async (request, response) => {
    console.log(request.body);

    return response.send('Response from POST /quote');
})

module.exports = router;
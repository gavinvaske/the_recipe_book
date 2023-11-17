const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');

router.use(verifyJwtToken);

router.get('/form', async (request, response) => {
    return response.render('createQuote');
});

module.exports = router;
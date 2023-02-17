const router = require('express').Router();

router.get('/form', (request, response) => {
    return response.render('createDieLine');
});

module.exports = router;
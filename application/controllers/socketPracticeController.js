const router = require('express').Router();

router.get('/', (request, response) => {
    return response.render('socketPractice');
});

module.exports = router;
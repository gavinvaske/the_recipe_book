const router = require('express').Router();

router.get('/', (request, response) => {
    console.log('yeerup')

    return response.render('socketPractice');
});

module.exports = router;
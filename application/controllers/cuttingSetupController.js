const router = require('express').Router();

router.get('/:id', (request, response) => {
    response.render('viewCuttingSetups');
});

module.exports = router;
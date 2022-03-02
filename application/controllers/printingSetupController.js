const router = require('express').Router();

router.get('/:id', (request, response) => {
    response.render('viewPrintingSetups');
});

module.exports = router;
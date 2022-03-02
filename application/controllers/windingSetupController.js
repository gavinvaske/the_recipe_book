const router = require('express').Router();

router.get('/:id', (request, response) => {
    response.render('viewWindingSetups');
});

module.exports = router;
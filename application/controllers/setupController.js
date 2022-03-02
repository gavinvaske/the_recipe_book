const router = require('express').Router();

router.get('/:id', (request, response) => {
    response.render('setupSelection', {
        recipeId: request.params.id
    });
});

module.exports = router;
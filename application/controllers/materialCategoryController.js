const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');

router.use(verifyJwtToken);

router.get('/', (request, response) => {
    response.render('viewMaterialCategories.ejs');
});

module.exports = router;
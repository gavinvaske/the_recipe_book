const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');

router.use(verifyJwtToken);

router.get('/', (request, response) => {
    return response.render('adminPanel');

});
module.exports = router;
const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');

router.get('/', verifyJwtToken, (request, response) => {
    return response.render('adminPanel')
});

module.exports = router;
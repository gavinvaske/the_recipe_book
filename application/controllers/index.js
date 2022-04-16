const express = require('express');
const router = express.Router();
const {isUserLoggedIn} = require('../services/userService');

router.get('/', (request, response) => {
    if (isUserLoggedIn(request.cookies.jwtToken, process.env.JWT_SECRET)) {
        return response.redirect('/users/profile');
    }

    return response.render('login');
});

module.exports = router;
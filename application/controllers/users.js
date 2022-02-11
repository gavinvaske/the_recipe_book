const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.get('/login', (request, response) => {
    response.render('login');
});

router.post('/login', (request, response) => {
    response.json('TODO: Build this endpoint');
});

router.get('/register', (request, response) => {
    response.render('register');
});

router.post('/register', (request, response) => {
    const {email, password, repeatPassword} = request.body;
    const user = {
        email,
        password
    }

    userService.createUser(user).then((result) => {
        response.json(result)
    }).catch((error) => {
        console.log(JSON.stringify(error));
        response.json(error);
    })
});

module.exports = router;
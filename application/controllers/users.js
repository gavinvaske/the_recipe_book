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

router.post('/register', async (request, response) => {
    const {email, password, repeatPassword} = request.body;
    const userAttributes = {
        email,
        password
    }

    try {
        const user = await userService.createUser(userAttributes);
        response.json(user);
    } catch(error) {
        response.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;
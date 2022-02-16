const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');

const BAD_REQUEST_STATUS = 400;
const MONGODB_DUPLICATE_KEY_ERROR_CODE = 11000;
const MIN_PASSWORD_LENGTH = 8;
const BCRYPT_SALT_LENGTH = 10;

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
    const {email, password: plainTextPassword, repeatPassword} = request.body;

    if (plainTextPassword !== repeatPassword) {
        return response.status(BAD_REQUEST_STATUS).send('passwords222 do not match');
    }

    if (plainTextPassword.length < MIN_PASSWORD_LENGTH) {
        return response.status(BAD_REQUEST_STATUS).send(`password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    const encryptedPassword = await bcrypt.hash(plainTextPassword, BCRYPT_SALT_LENGTH);

    try {
        await UserModel.create({
            email,
            password: encryptedPassword
        });
    } catch (error) {
        if (error.code === MONGODB_DUPLICATE_KEY_ERROR_CODE) {
            return response.status(BAD_REQUEST_STATUS).send('Username already exists');
        }
        console.log('Error creating user: ', error);
        throw error;
    }

    return response.send('User was registered successfully');
});

module.exports = router;
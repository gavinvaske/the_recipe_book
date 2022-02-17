const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {verifyJwtToken} = require('../middleware/authorize');

const BAD_REQUEST_STATUS = 400;

const MONGODB_DUPLICATE_KEY_ERROR_CODE = 11000;
const MIN_PASSWORD_LENGTH = 8;
const BCRYPT_SALT_LENGTH = 10;

const INVALID_USERNAME_PASSWORD_MESSAGE = 'Invalid username/password combination';

router.get('/profile', verifyJwtToken, (request, response) => {
    response.render('profile', {
        user: request.user
    });
});

router.get('/change-password', verifyJwtToken, (request, response) => {
    response.render('changePassword');
});

router.post('/change-password', verifyJwtToken, async (request, response) => {
    const {newPassword, repeatPassword} = request.body;

    if (newPassword !== repeatPassword) {
        return response.json({
            error: 'passwords do not match'
        });
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
        return response.json({
            error: `password must be at least ${MIN_PASSWORD_LENGTH} characters`
        });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_LENGTH);
    
    const user = request.user;

    await UserModel.updateOne({
        _id: user.id, 
    }, {
        $set: { password: encryptedPassword}
    });

    response.clearCookie('jwtToken');

    return response.redirect('/users/login');
});

router.get('/login', (request, response) => {
    response.render('login');
});

router.post('/login', async (request, response) => {
    const {email, password} = request.body;

    const user = await UserModel.findOne({email}).lean();

    if (!user) {
        return response.json({
            error: INVALID_USERNAME_PASSWORD_MESSAGE
        });
    }

    const isPasswordCorrectForUser = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrectForUser) {
        return response.json({
            error: INVALID_USERNAME_PASSWORD_MESSAGE
        });
    }

    const jwtToken = jwt.sign({
        id: user._id,
        email: user.email,
        userType: user.userType
    }, process.env.JWT_SECRET);

    response.cookie('jwtToken', jwtToken, {
        httpOnly: true
    });

    return response.redirect('/users/profile');
});

router.get('/register', (request, response) => {
    response.render('register');
});

router.post('/register', async (request, response) => {
    const {email, password: plainTextPassword, repeatPassword} = request.body;

    if (plainTextPassword !== repeatPassword) {
        return response.status(BAD_REQUEST_STATUS).send('passwords do not match');
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

    return response.redirect('/users/login');
});

module.exports = router;
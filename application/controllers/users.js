const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {verifyJwtToken} = require('../middleware/authorize');
const {sendPasswordResetEmail} = require('../services/emailService');

const MONGODB_DUPLICATE_KEY_ERROR_CODE = 11000;
const MIN_PASSWORD_LENGTH = 8;
const BCRYPT_SALT_LENGTH = 10;

const INVALID_USERNAME_PASSWORD_MESSAGE = 'Invalid username/password combination';

router.get('/forgot-password', (request, response) => {
    response.render('forgotPassword');
});

router.post('/forgot-password', (request, response) => {
    const {email} = request.body;

    const user = undefined; // TODO: Find the user from the database based on their email
    
    if (user) {
        const secret = process.env.JWT_SECRET + user.password;
        const payload = {
            email: user.email,
            id: user._id
        };
        const token = jwt.sign(payload, secret, {expiresIn: '15m'});
        const link = `http://localhost:8080/reset-password/${user.id}/${token}`;

        sendPasswordResetEmail(email, link);
    }


    request.flash('alerts', ['If an account with that email exists, you will receive an email to reset your password']);

    response.redirect('back');
});

router.get('/reset-password', (request, response) => {
    response.send('TODO: Build this route');
});

router.post('/reset-password', (request, response) => {
    response.send('TODO: Build this route');
});


router.get('/logout', verifyJwtToken, (request, response) => {
    response.clearCookie('jwtToken');

    return response.redirect('/');
});

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
        request.flash('errors', ['passwords do not match']);
        
        return response.redirect('back');
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
        request.flash('errors', [`password must be at least ${MIN_PASSWORD_LENGTH} characters`]);
        
        return response.redirect('back');
    }

    const encryptedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_LENGTH);
    
    const user = request.user;

    await UserModel.updateOne({
        _id: user.id, 
    }, {
        $set: { password: encryptedPassword}
    });

    response.clearCookie('jwtToken');

    request.flash('alerts', ['Password change was successful, please login']);

    return response.redirect('/users/login');
});

router.get('/login', (request, response) => {
    response.render('login');
});

router.post('/login', async (request, response) => {
    const {email, password} = request.body;

    const user = await UserModel.findOne({email}).lean();

    if (!user) {
        request.flash('errors', [INVALID_USERNAME_PASSWORD_MESSAGE]);

        return response.redirect('back');
    }

    const isPasswordCorrectForUser = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrectForUser) {
        request.flash('errors', [INVALID_USERNAME_PASSWORD_MESSAGE]);
        
        return response.redirect('back');
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
        request.flash('errors', ['passwords do not match']);
        
        return response.redirect('back');
    }

    if (plainTextPassword.length < MIN_PASSWORD_LENGTH) {
        request.flash('errors', [`password must be at least ${MIN_PASSWORD_LENGTH} characters`]);
        
        return response.redirect('back');
    }

    const encryptedPassword = await bcrypt.hash(plainTextPassword, BCRYPT_SALT_LENGTH);

    try {
        await UserModel.create({
            email,
            password: encryptedPassword
        });
    } catch (error) {
        if (error.code === MONGODB_DUPLICATE_KEY_ERROR_CODE) {
            request.flash('errors', ['Username already exists']);
        
            return response.redirect('back');
        }
        console.log('Unknown error occurred while creating user: ', error);
        throw error;
    }

    request.flash('alerts', ['Registration was successful, please login']);

    return response.redirect('/users/login');
});

module.exports = router;
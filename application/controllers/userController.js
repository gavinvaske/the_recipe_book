const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {verifyJwtToken} = require('../middleware/authorize');
const {sendPasswordResetEmail} = require('../services/emailService');
const {upload} = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const {isUserLoggedIn} = require('../services/userService');

// router.use(verifyJwtToken);

const MONGODB_DUPLICATE_KEY_ERROR_CODE = 11000;
const MIN_PASSWORD_LENGTH = 8;
const BCRYPT_SALT_LENGTH = 10;
const INVALID_USERNAME_PASSWORD_MESSAGE = 'Invalid username/password combination';

function deleteFileFromFileSystem(path) {
    fs.unlinkSync(path);
}

router.get('/logged-in-user-details', verifyJwtToken, async (request, response) => {
    const user = await UserModel.findById(request.user.id, 'email username fullName userType jobRole');
    delete user.profilePicture.data;

    return response.json(user);
});

router.post('/profile', verifyJwtToken, async (request, response) => {
    const {userName, fullUserName, jobRole, birthDate, cellPhone} = request.body;
    const user = await UserModel.findById(request.user.id);
    user.username = userName;
    user.fullName = fullUserName;
    user.jobRole = jobRole;
    user.birthDate = birthDate;
    user.phoneNumber = cellPhone;
    
    try {
        await user.save();
        request.flash('alerts', ['Profile updated successfully']);

        return response.redirect('/users/profile');
    } catch (error) {
        request.flash('errors', ['The following error occurred while attempting to update your profile', error.message]);
        return response.redirect('back');
    }
});

router.get('/profile-picture', verifyJwtToken, async (request, response) => {
    const user = await UserModel.findById(request.user.id);

    return response.json({
        imageType: user.profilePicture.contentType,
        imageData: user.profilePicture.data.toString('base64')
    });
});

router.post('/profile-picture', verifyJwtToken, upload.single('image'), async (request, response) => {
    const maxImageSizeInBytes = 3500000;
    const imageFilePath = path.join(path.resolve(__dirname, '../../') + '/uploads/' + request.file.filename);
  
    try {
        const base64EncodedImage = fs.readFileSync(imageFilePath);

        if (request.file.size > maxImageSizeInBytes) {
            request.flash('errors', ['File size is too big', 'Please use an image that is less than 3.5MB']);
            return response.redirect('back');
        }

        const user = await UserModel.findById(request.user.id);
        user.profilePicture = {
            data: base64EncodedImage,
            contentType: request.file.mimetype
        };

        await user.save();

        request.flash('alerts', ['Profile picture updated successfully']);

        return response.redirect('/users/profile');
    } catch (error) {
        request.flash('errors', ['The following error occurred while attempting to update your profile picture', error.message]);

        return response.redirect('back');
    } finally {
        deleteFileFromFileSystem(imageFilePath);
    }
});

router.get('/forgot-password', (request, response) => {
    response.render('forgotPassword');
});

router.post('/forgot-password', async (request, response) => {
    const {email} = request.body;

    const user = await UserModel.findOne({email}).lean();
    
    if (user) {
        const secret = process.env.JWT_SECRET + user.password;
        const payload = {
            email: user.email,
            id: user._id
        };
        const token = jwt.sign(payload, secret, {expiresIn: '15m'});
        const link = `${process.env.BASE_URL}/users/reset-password/${user._id}/${token}`;

        sendPasswordResetEmail(email, link);
    }


    request.flash('alerts', ['If an account with that email exists, you will receive an email to reset your password']);

    response.redirect('back');
});

router.get('/reset-password/:id/:token', async (request, response) => {
    const {id, token} = request.params;

    const user = await UserModel.findById(id);

    if (id !== user.id) {
        request.flash('errors', ['Invalid user ID']);
        return response.redirect('back');
    }

    const secret = process.env.JWT_SECRET + user.password;

    try {
        jwt.verify(token, secret);
        response.render('resetPassword', {
            email: user.email
        });
    } catch (error) {
        console.log(error);
        request.flash('errors', ['error occurred while attempting to verify your account, please try again.']);
        response.redirect('back');
    }
});

router.post('/reset-password/:id/:token', async (request, response) => {
    const {id, token} = request.params;
    const {password, repeatPassword} = request.body;

    const user = await UserModel.findById(id);

    if (id !== user.id) {
        request.flash('errors', ['Invalid user ID']);
        return response.redirect('back');
    }

    const secret = process.env.JWT_SECRET + user.password;

    try {
        jwt.verify(token, secret);

        if (password !== repeatPassword) {
            request.flash('errors', ['passwords do not match']);
            
            return response.redirect('back');
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            request.flash('errors', [`password must be at least ${MIN_PASSWORD_LENGTH} characters`]);
            
            return response.redirect('back');
        }

        const encryptedPassword = await bcrypt.hash(password, BCRYPT_SALT_LENGTH);

        await UserModel.updateOne({
            _id: user.id, 
        }, {
            $set: {password: encryptedPassword}
        });
    
        response.clearCookie('jwtToken');
    
        request.flash('alerts', ['Password change was successful, please login']);
    
        return response.redirect('/users/login');
    } catch (error) {
        console.log(error);
        request.flash('errors', ['The URL you requested is no longer valid, please try again.']);
        response.redirect('back');
    }
});

router.get('/logout', verifyJwtToken, (request, response) => {
    response.clearCookie('jwtToken');

    return response.redirect('/');
});

router.get('/profile', verifyJwtToken, verifyJwtToken, async (request, response) => {
    const user = await UserModel.findById(request.user.id);

    delete user.password;
    delete user.profilePicture;

    response.render('profile', {
        user
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
    if (isUserLoggedIn(request.cookies.jwtToken, process.env.JWT_SECRET)) {
        return response.redirect('/users/profile');
    }

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
const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const USER = 'USER';
const ADMIN = 'ADMIN';
const EMAIL_VALIDATION_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PHONE_VALIDATION_REGEX = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

const validatePhone = function(phoneNumber) {
    if (!phoneNumber) {
        return true;
    }
    return PHONE_VALIDATION_REGEX.test(phoneNumber);
};

const validateEmail = function(email) {
    return EMAIL_VALIDATION_REGEX.test(email);
};

const checkForSpaces = function(text) {
    if (!text) {
        return true;
    }
    const isValid = !text.includes(' ');

    return isValid;
};

const userSchema = new Schema({
    email: {
        type: String,
        uppercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [EMAIL_VALIDATION_REGEX, 'Please fill a valid email address']
    },
    password: {
        type: String,
        minLength: 8,
        required: true
    },
    userType: {
        type: String,
        enum: [USER, ADMIN],
        default: USER
    },
    profilePicture: {
        data: {
            type: Buffer
        },
        contentType: {
            type: String,
            enum: ['image/png', 'image/jpeg', 'image/jpg']
        }
    },
    username: {
        type: String,
        unique: true,
        validate: [{
            validator: checkForSpaces, 
            msg: 'Your username must not contain spaces'
        }],
        sparse: true
    },
    fullName: {
        type: String
    },
    jobRole: {
        type: String
    },
    phoneNumber: {
        type: String,
        validate: [validatePhone, 'Your phone number must be 10 digits and/or formatted correctly']
    },
    birthDate: {
        type: Date
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

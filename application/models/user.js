const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const { validatePhoneNumber, validateEmail } = require('../services/dataValidationService');
const { AVAILABLE_USER_TYPES, DEFAULT_USER_TYPE } = require('../../application/enums/userTypesEnum');

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
    },
    password: {
        type: String,
        minLength: 8,
        required: true,
        select: false
    },
    userType: {
        type: String,
        enum: AVAILABLE_USER_TYPES,
        default: DEFAULT_USER_TYPE
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
        validate: [validatePhoneNumber, 'The provided phone number "{VALUE}" is not a valid phone number']
    },
    birthDate: {
        type: Date
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

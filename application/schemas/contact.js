const mongoose = require('mongoose');
const addressSchema = require('./address');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const PHONE_VALIDATION_REGEX = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
const EMAIL_VALIDATION_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validatePhoneNumber = function (phoneNumber) {
    if (!phoneNumber) {
        return true;
    }
    return PHONE_VALIDATION_REGEX.test(phoneNumber);
};

const validateEmail = function (email) {
    return EMAIL_VALIDATION_REGEX.test(email);
};

const contactSchema = new Schema({
    fullName: {
        type: String,
        uppercase: true,
        required: true,
    },
    phoneNumber: {
        type: String,
        validate: [validatePhoneNumber, 'The provided phone number "{VALUE}" is not a valid phone number']
    },
    phoneExtension: {
        type: Number
    },
    email: {
        type: String,
        uppercase: true,
        validate: [validateEmail, 'The provided email "{VALUE}" is not a valid email']
    },
    contactStatus: {
        type: String,
        uppercase: true,
        required: true
    },
    notes: {
        type: String
    },
    position: {
        type: String
    },
    location: {
        type: addressSchema
    }
}, { timestamps: true });

module.exports = contactSchema;
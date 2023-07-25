const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const { validatePhoneNumber, validateEmail } = require('../services/dataValidationService');

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        validate: [validatePhoneNumber, 'The provided phone number "{VALUE}" is not a valid phone number']
    },
    email: {
        type: String,
        required: false,
        validate: [validateEmail, 'The provided email "{VALUE}" is not a valid email address']
    },
    notes: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    // address: {   // TOOD: Add address attribute and validate using google maps API
    //     type: String,
    //     required: true
    // },
    primaryContactName: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Vendor = mongoose.model('Vendor', schema);

module.exports = Vendor;
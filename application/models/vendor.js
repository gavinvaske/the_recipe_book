import mongoose from 'mongoose'
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const { validatePhoneNumber, validateEmail } = require('../services/dataValidationService');
const addressSchema = require('../schemas/address');

mongoose.plugin(require('mongoose-delete'), {overrideMethods: true});

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
    address: {
        type: addressSchema,
        required: true
    },
    primaryContactName: {
        type: String,
        required: true
    },
    primaryContactPhoneNumber: {
        type: String,
        required: true,
        validate: [validatePhoneNumber, 'Invalid attribute "primaryContactPhoneNumber": The provided phone number "{VALUE}" is not a valid phone number']
    },
    primaryContactEmail: {
        type: String,
        required: true,
        validate: [validateEmail, 'Invalid attribute "primaryContactEmail": The provided email "{VALUE}" is not a valid email address']
    },
    mfgSpecNumber: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Vendor = mongoose.model('Vendor', schema);

module.exports = Vendor;
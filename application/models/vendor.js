const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const { validatePhoneNumber } = require('../services/dataValidationService');

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        validate: [validatePhoneNumber, 'The provided phone number "{VALUE}" is not a valid phone number']
    }
}, { timestamps: true });

const Vendor = mongoose.model('Vendor', schema);

module.exports = Vendor;
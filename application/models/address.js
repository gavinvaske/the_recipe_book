const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

ZIP_CODE_REGEX = /(^\d{5}(?:[-\s]\d{4})?$)/;

function validateZipCode(zipCode) {
    return ZIP_CODE_REGEX.test(zipCode);
}

const schema = new Schema({
    name: {
        type: String,
        required: true, 
    },
    street: {
        type: String,
        uppercase: true,
        required: true
    },
    unitOrSuite: {
        type: String,
        uppercase: true,
        required: false
    },
    city: {
        type: String,
        uppercase: true,
        required: true
    },
    state: {
        type: String,
        uppercase: true,
        required: true
    },
    zipCode: {
        type: String,
        required: true,
        validate: [validateZipCode, 'The provided zip code of "{VALUE}" is not a correctly formatted zip code']
    },
}, { timestamps: true });

const Address = mongoose.model('Address', schema);

module.exports = Address;
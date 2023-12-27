const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

ZIP_CODE_REGEX = /(^\d{5}(?:[-\s]\d{4})?$)/;

function validateZipCode(zipCode) {
    return ZIP_CODE_REGEX.test(zipCode);
}
// TODO (12-26-2023): Why aren't all of these fields required?
const addressSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    street: {
        type: String,
        uppercase: true
    },
    unitOrSuite: {
        type: String,
        uppercase: true
    },
    city: {
        type: String,
        uppercase: true
    },
    state: {
        type: String,
        uppercase: true
    },
    zipCode: {
        type: String,
        validate: [validateZipCode, 'The provided zip code of "{VALUE}" is not a correctly formatted zip code']
    },
}, { timestamps: true });

module.exports = addressSchema;
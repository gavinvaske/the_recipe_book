const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const DIE_NUMBER_REGEX = /(^[A-Z]*-\d*$)/

function validateDieNumberFormat(dieNumber) {
    dieNumber = dieNumber.toUpperCase();

    return DIE_NUMBER_REGEX.test(dieNumber)
}

function convertStringToNumberAndRemoveNonDigits(stringContainingNumbersAndCharacters) {
    const stringContainingOnlyDigitsAndTheDecimalPoint = String(stringContainingNumbersAndCharacters).replace(/[^0-9.,]/g, '');
    
    return Number(stringContainingOnlyDigitsAndTheDecimalPoint);
}

const schema = new Schema({
    dieNumber: {    // all characters (uppercase) - all numbers
        type: String,
        required: true,
        validate: [validateDieNumberFormat, 'The provided dieNumber "{VALUE}" must be in the following format: characters followed a dash followed by numbers'],
        uppercase: true
    },
    pitch: {
        type: Number,
        required: true,
        set: convertStringToNumberAndRemoveNonDigits
    },
    gear: {
        type: Number,
        required: true,
        min: 0
    },
    shape: {
        type: String,
        required: true
    },
    // TODO Future Self: Finsih Post-TDDing the attributes below
    
    // sizeAcross: {
    //     type: Number,
    //     required: true
    // },
    // sizeAround: {
    //     type: Number,
    //     required: true
    // },
    // matrixAround: {
    //     type: Number,
    //     min: 0,
    //     required: true
    // },
    // labelsAcross: {
    //     type: Number,
    //     min: 0,
    //     required: true
    // },
    // labelsAround: {
    //     type: Number,
    //     min: 0,
    //     required: true
    // },
    // size: {
    //     type: Number,
    //     min: 0,
    //     required: true
    // },
    // notes: {
    //     type: Number,
    //     required: false
    // }
}, { timestamps: true });

const Die = mongoose.model('Die', schema);

module.exports = Die;
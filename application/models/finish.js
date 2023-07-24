const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const NUMBER_OF_PENNIES_IN_A_DOLLAR = 100;
const NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY = 2;


function convertPenniesToDollars(amountInPennies) {
    return Number((amountInPennies / NUMBER_OF_PENNIES_IN_A_DOLLAR).toFixed(NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY));
}

function convertDollarsToPennies(dollarAmount) {
    return parseInt(dollarAmount * NUMBER_OF_PENNIES_IN_A_DOLLAR);
}

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    finishId: {
        type: String,
        required: true
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'MaterialCategory',
        required: true
    },
    thickness: {
        type: Number,
        required: true,
        min: 0
    },
    weight: {
        type: Number,
        required: true,
        min: 0
    },
    finishCost: {
        type: Number,
        required: true,
        min: 0,
        get: convertPenniesToDollars,
        set: convertDollarsToPennies,
    },
    freightCost: {
        type: Number,
        required: true,
        min: 0,
        get: convertPenniesToDollars,
        set: convertDollarsToPennies,
    },
    width: {
        type: Number,
        required: true,
        min: 0
    },
    quotePrice: {
        type: Number,
        required: true,
        min: 0,
        get: convertPenniesToDollars,
        set: convertDollarsToPennies,
    },
    description: {
        type: String,
        required: true
    },
    whenToUse: {
        type: String,
        required: true
    },
    alternativeFinish: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Finish = mongoose.model('Finish', schema);

module.exports = Finish;
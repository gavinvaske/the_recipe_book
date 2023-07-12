const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const NUMBER_OF_PENNIES_IN_A_DOLLAR = 100;
const NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY = 2;

function convertDollarsToPennies(numberAsString) {
    const currencyWithoutCommas = String(numberAsString).split(',').join('');

    if (currencyWithoutCommas === undefined || currencyWithoutCommas === '') throw new Error('Cannot save an undefined currency amount');

    return parseInt(Number(currencyWithoutCommas * NUMBER_OF_PENNIES_IN_A_DOLLAR));
}

const schema = new Schema({
    name: { // TODO: Automatically generate it? Talk to storm (Maybe if its not provided, automatically generate it)
        type: String,
        required: true,
        uppercase: true
    },
    materialId: {
        type: String,
        required: true
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    materialCategory: {
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
    materialCost: {
        type: Number,
        required: true,
        min: 0,
        get: amountInPennies => Number((amountInPennies / NUMBER_OF_PENNIES_IN_A_DOLLAR).toFixed(NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY)),
        set: convertDollarsToPennies,

    },
    freightCost: {
        type: Number,
        required: true,
        min: 0,
        get: amountInPennies => Number((amountInPennies / NUMBER_OF_PENNIES_IN_A_DOLLAR).toFixed(NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY)),
        set: convertDollarsToPennies
    },
    // width: {},
    // faceColor: {},
    // adhesive: {},
    // adhesiveCategory: {},
    // quotePrice: {},
    // description: {},
    // whenToUse: {},
    // alternativeStock: {}

}, { timestamps: true });

const Material = mongoose.model('Material', schema);

module.exports = Material;
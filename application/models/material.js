const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const { convertDollarsToPennies, convertPenniesToDollars } = require('../services/currencyService');
const Decimal = require('decimal.js');

mongoose.plugin(require('mongoose-delete'), {overrideMethods: true});

const FOUR_DECIMAL_PLACES = 4;

function roundNumberToNthDecimalPlace(nthDecimalPlaces) {
    return function (number) {
        const moreAccurateNumber = new Decimal(number);

        return moreAccurateNumber.toFixed(nthDecimalPlaces);
    };
}

const weightPerMsiAttribute = {
    type: Number,
    min: 0,
    set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES),
}

const schema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true
    },
    materialId: {
        type: String,
        required: true,
        uppercase: true
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
    faceColor: {
        type: String,
        required: true
    },
    adhesive: {
        type: String,
        required: true
    },
    adhesiveCategory: {
        type: Schema.Types.ObjectId,
        ref: 'AdhesiveCategory',
        required: true
    },
    quotePrice: {
        type: Number,
        required: true,
        get: convertPenniesToDollars,
        set: convertDollarsToPennies,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    whenToUse: {
        type: String,
        required: true
    },
    alternativeStock: {
        type: String,
        required: false
    },
    length: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message: '{VALUE} is not an integer'
        },
        min: 0
    },
    facesheetWeightPerMsi: {
        ...weightPerMsiAttribute,
        required: true
    },
    adhesiveWeightPerMsi: {
        ...weightPerMsiAttribute,
        required: true
    },
    linerWeightPerMsi: {
        ...weightPerMsiAttribute,
        required: true
    },
}, {
    timestamps: true,
    strict: 'throw'
});

const Material = mongoose.model('Material', schema);

module.exports = Material;
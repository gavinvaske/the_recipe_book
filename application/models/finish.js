const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const { convertDollarsToPennies, convertPenniesToDollars } = require('../services/currencyService');

mongoose.plugin(require('mongoose-delete'), {overrideMethods: true});

const schema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true
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
    costPerMsi: {
        type: Number,
        required: true,
        min: 0,
        get: convertPenniesToDollars,
        set: convertDollarsToPennies,
    },
    freightCostPerMsi: {
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
    quotePricePerMsi: {
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
}, {
    timestamps: true,
    strict: 'throw'
});

const Finish = mongoose.model('Finish', schema);

module.exports = Finish;
const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const { convertDollarsToPennies, convertPenniesToDollars } = require('../services/currencyService');

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
            message   : '"material.length" must be an integer. The provided value was: \'{VALUE}\''
        },
        min: 0
    }

}, { timestamps: true });

const Material = mongoose.model('Material', schema);

module.exports = Material;
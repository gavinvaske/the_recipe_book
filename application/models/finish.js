import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import Decimal from 'decimal.js';

import mongooseDelete from 'mongoose-delete';
mongoose.plugin(mongooseDelete, { overrideMethods: true });

const FOUR_DECIMAL_PLACES = 4;

function roundNumberToNthDecimalPlace(nthDecimalPlaces) {
    return function (number) {
        const moreAccurateNumber = new Decimal(number);

        return moreAccurateNumber.toFixed(nthDecimalPlaces);
    };
}

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
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
    },
    freightCostPerMsi: {
        type: Number,
        required: true,
        min: 0,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
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
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
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

export default Finish;
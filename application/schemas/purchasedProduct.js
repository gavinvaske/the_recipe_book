const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

// TODO (10-7-2023): I think all of this can be removed. It was an old requirement... I think. Double Check.
const purchasedProductSchema = new Schema({
    baseProduct: {
        type: Schema.Types.ObjectId,
        ref: 'BaseProduct',
        required: true
    },
    labelQuantity: {
        type: Number,
        min: 0
    },
    numberOfFinishedRolls: {
        type: Number,
        min: 0,
        default: 0
    },
    finishedLabelQuantity: {
        type: Number,
        min: 0,
        default: 0
    }
}, { timestamps: true });

module.exports = purchasedProductSchema;

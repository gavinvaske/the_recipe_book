import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

export const purchasedProductSchema = new Schema({
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


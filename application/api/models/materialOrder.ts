import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const TOTAL_ROLLS_MIN = 1;
const TOTAL_ROLLS_MAX = 100;

const TOTAL_COST_MIN = 1;
const TOTAL_COST_MAX = 500000;

const ONLY_NUMBERS_REGEX = /^[0-9]*$/;

const validatePurchaseOrderNumber = function(text) {
    if (!text) {
        return false;
    }
    return ONLY_NUMBERS_REGEX.test(text);
};

const schema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'AUTHOR could not be determined']
    },
    material: {
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: [true, 'MATERIAL is required']
    },
    purchaseOrderNumber: {
        type: String,
        required: [true, 'P.O. NUMBER is required'],
        validate : {
            validator : validatePurchaseOrderNumber,
            message   : 'P.O Number must ONLY contain numbers'
        }
    },
    orderDate: {
        type: Date,
        required: [true, 'ORDER DATE is required'],
    },
    arrivalDate: {
        type: Date,
        required: [true, 'ARRIVAL DATE is required'],
    },
    feetPerRoll: {
        type: Number,
        required: [true, 'FEET PER ROLL is required'],
        min: 0
    },
    totalRolls: {
        type: Number,
        required: [true, 'TOTAL ROLLS is required'],
        min: [TOTAL_ROLLS_MIN, 'Total Rolls cannot be less than 1'],
        max: [TOTAL_ROLLS_MAX, 'Total Rolls cannot be greater than 100'],
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer'
        }
    },
    totalCost: {
        type: Number,
        required: [true, 'TOTAL COST is required'],
        min: [TOTAL_COST_MIN, 'Total Cost must be more than $1'],
        max: [TOTAL_COST_MAX, 'Total Cost must be less than $500,000']
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: [true, 'VENDOR is required'],
    },
    hasArrived: {
        type: Boolean,
        required: false
    },
    notes: {
        type: String,
        required: false
    }
}, { timestamps: true });

export const MaterialOrderModel = mongoose.model('MaterialOrders', schema);

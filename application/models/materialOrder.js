const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    material: {
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    },
    purchaseOrderNumber: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer'
        }
    },
    orderDate: {
        type: Date,
        required: true
    },
    arrivalDate: {
        type: Date,
        required: true
    },
    feetPerRoll: {
        type: Number,
        required: true,
        min: 0
    },
    totalRolls: {
        type: Number,
        required: true,
        min: [1, 'Total Rolls cannot be less than 1'],
        max: [100, 'Total Rolls cannot be greater than 100'],
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer'
        }
    },
    totalCost: {
        type: Number,
        required: true,
        min: [1, 'Total Cost must be more than $1'],
        max: [500000, 'Total Cost must be less than $500,000']
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    hasArrived: {
        type: Boolean,
        required: false
    },
    notes: {
        type: String,
        required: false,
        trim: true
    }
}, { timestamps: true });

const MaterialOrder = mongoose.model('materialOrders', schema);

module.exports = MaterialOrder;
import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import { dieShapes } from '../enums/dieShapesEnum.js';
import { toolTypes } from '../enums/toolTypesEnum.js';
import { dieVendors } from '../enums/dieVendorsEnum.js';
import { dieMagCylinders } from '../enums/dieMagCylindersEnum.js';
import { dieStatuses, ORDERED_DIE_STATUS, IN_STOCK_DIE_STATUS } from '../enums/dieStatusesEnum.js';
import { convertDollarsToPennies, convertPenniesToDollars } from '../services/currencyService.js';

import mongooseDelete from 'mongoose-delete';
mongoose.plugin(mongooseDelete, { overrideMethods: true });

const DIE_NUMBER_PREFIXES = ['DC', 'DR', 'DRC' , 'DO', 'DS', 'XLDR', 'DSS', 'DB'];
const DIE_NUMBER_REGEX = /^(\d{4})$/;

function validateDieNumberFormat(dieNumber) {
    dieNumber = dieNumber.toUpperCase();
    const dieNumberParts = dieNumber.split('-');

    if (dieNumberParts.length !== 2) {
        return false;
    }

    const [prefix, number] = dieNumberParts;

    if (!prefix || !number) {
        return false;
    }

    const isValidPrefix = DIE_NUMBER_PREFIXES.includes(prefix);
    const isValidNumber = DIE_NUMBER_REGEX.test(number);

    return isValidPrefix && isValidNumber;
}

function setDieStatus(newStatus) {
    const previousStatus = this.status;
    const statusHasNotChanged = previousStatus === newStatus;

    if (statusHasNotChanged) return newStatus;

    if (newStatus === ORDERED_DIE_STATUS) this.orderDate = new Date();

    if (newStatus === IN_STOCK_DIE_STATUS) this.arrivalDate = new Date();

    return newStatus;
}

const schema = new Schema({
    shape: {
        type: String,
        required: true,
        enum: [...dieShapes],
        uppercase: true
    },
    sizeAcross: {
        type: Number,
        required: true,
        min: 0
    },
    sizeAround: {
        type: Number,
        required: true,
        min: 0
    },
    dieNumber: {
        type: String,
        required: true,
        validate: [validateDieNumberFormat, 'The provided dieNumber "{VALUE}" must be in the following format: characters followed a dash followed by numbers'],
        uppercase: true
    },
    numberAcross: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message: '{VALUE} is not an integer'
        },
        min: 0
    },
    numberAround: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message: '{VALUE} is not an integer'
        },
        min: 0
    },
    gear: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message: '{VALUE} is not an integer'
        },
        min: 0
    },
    toolType: {
        type: String,
        required: true,
        uppercase: true,
        enum: [...toolTypes],
    },
    notes: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true,
        min: 0,
        get: convertPenniesToDollars,
        set: convertDollarsToPennies,
    },
    vendor: {
        type: String,
        required: true,
        uppercase: true,
        enum: [...dieVendors]
    },
    magCylinder: {
        type: Number,
        required: true,
        enum: [...dieMagCylinders]
    },
    cornerRadius: {
        type: Number,
        required: true,
        min: 0
    },
    topAndBottom: {
        type: Number,
        required: true
    },
    leftAndRight: {
        type: Number,
        required: true
    },
    spaceAcross: { // also known as "Col Space"
        type: Number,
        required: true,
        set: function (spaceAcross) {
            this.topAndBottom = spaceAcross / 2;
            return spaceAcross;
        },
        min: 0
    }, 
    spaceAround: { // also known as "Row Space"
        type: Number,
        required: true,
        set: function (spaceAround) {
            this.leftAndRight = spaceAround / 2;
            return spaceAround;
        },
        min: 0
    },
    facestock: {
        type: String,
        required: true
    },
    liner: {
        type: String,
        required: true
    },
    specialType: {
        type: String,
        required: false
    },
    serialNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        uppercase: true,
        enum: [...dieStatuses],
        set: setDieStatus
    },
    quantity: {
        type: Number,
        validate : {
            validator : Number.isInteger,
            message: '{VALUE} is not an integer'
        },
        default: 1,
        min: 0
    },
    orderDate: {
        type: Date,
        required: false
    },
    arrivalDate: {
        type: Date,
        required: false
    },
}, { timestamps: true });

const Die = mongoose.model('Die', schema);

export default Die;
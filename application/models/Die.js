const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const { dieShapes } = require('../enums/dieShapesEnum');
const { toolTypes } = require('../enums/toolTypesEnum');
const { dieVendors } = require('../enums/dieVendorsEnum');
const { dieMagCylinders } = require('../enums/dieMagCylindersEnum');
const { dieStatuses, ORDERED_DIE_STATUS, IN_STOCK_DIE_STATUS } = require('../enums/dieStatusesEnum');

const DIE_NUMBER_PREFIXES = ['DC', 'DR', 'DRC' , 'DO', 'DS', 'XLDR', 'DSS', 'DB'];
const DIE_NUMBER_REGEX = /^(\d{4})$/;
const NUMBER_OF_PENNIES_IN_A_DOLLAR = 100;
const NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY = 2;

function convertDollarsToPennies(dollarAmount) {
    return parseInt(dollarAmount * NUMBER_OF_PENNIES_IN_A_DOLLAR);
}

function validateDieNumberFormat(dieNumber) {
    dieNumber = dieNumber.toUpperCase();
    const dieNumberParts = dieNumber.split('-');

    if (dieNumberParts.length !== 2) {
        return false;
    }

    [prefix, number] = dieNumberParts;

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
    dieShape: {
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
            message   : 'numberAcross: \'{VALUE}\' must be a whole number'
        },
        min: 0
    },
    numberAround: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : 'numberAround: \'{VALUE}\' must be a whole number'
        },
        min: 0
    },
    gear: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : 'gear: \'{VALUE}\' must be a whole number'
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
        get: amountInPennies => Number((amountInPennies / NUMBER_OF_PENNIES_IN_A_DOLLAR).toFixed(NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY)),
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
        required: true
    },
    spaceAcross: {
        type: Number,
        required: true
    },
    spaceAround: {
        type: Number,
        required: true
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
            message   : '\'quantity\' must be an integer, but the value provided was: \'{VALUE}\''
        },
        default: 1,
        min: 0
    },
    // rotations: {},
    // uses: {},
    // lastUse: {},
    orderDate: {
        type: Date,
        required: false
    },
    arrivalDate: {
        type: Date,
        required: false
    },
    // iterations: {},


    // dieNumber: {    // all characters (uppercase) - all numbers
    //     type: String,
    //     required: true,
    //     validate: [validateDieNumberFormat, 'The provided dieNumber "{VALUE}" must be in the following format: characters followed a dash followed by numbers'],
    //     uppercase: true
    // },
    // pitch: {
    //     type: Number,
    //     required: true,
    //     set: convertStringToNumberAndRemoveNonDigits
    // },
    // gear: {
    //     type: Number,
    //     required: true,
    //     min: 0
    // },
    // shape: {
    //     type: String,
    //     required: true
    // },
    // TODO Future Self: Finsih Post-TDDing the attributes below
    
    // sizeAcross: {
    //     type: Number,
    //     required: true
    // },
    // sizeAround: {
    //     type: Number,
    //     required: true
    // },
    // matrixAround: {
    //     type: Number,
    //     min: 0,
    //     required: true
    // },
    // labelsAcross: {
    //     type: Number,
    //     min: 0,
    //     required: true
    // },
    // labelsAround: {
    //     type: Number,
    //     min: 0,
    //     required: true
    // },
    // size: {
    //     type: Number,
    //     min: 0,
    //     required: true
    // },
    // notes: {
    //     type: Number,
    //     required: false
    // }
}, { timestamps: true });

const Die = mongoose.model('Die', schema);

module.exports = Die;
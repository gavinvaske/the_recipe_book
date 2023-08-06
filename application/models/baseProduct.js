const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const CustomerModel = require('./Customer');
const DieModel = require('./Die');
const MaterialModel = require('./Material');
const { unwindDirections, defaultUnwindDirection } = require('../enums/unwindDirectionsEnum');
const { finishTypes, defaultFinishType } = require('../enums/finishTypesEnum');
const { MAX_FRAME_LENGTH_INCHES } = require('../enums/constantsEnum');

async function generateUniqueProductNumber() {
    const customer = await CustomerModel.findById(this.customerId);
    const howManyProductsDoesThisCustomerHave = await ProductModel.countDocuments({ customerId: this.customerId });

    const nextProductId = howManyProductsDoesThisCustomerHave + 1;
    const numberOfDigitsInProductId = 3;
    const nextProductIdWithLeadingZero = nextProductId.toString().padStart(numberOfDigitsInProductId, '0');

    productNumber = `${customer.customerId}-${nextProductIdWithLeadingZero}`;

    this.productNumber = productNumber;
}

async function calculatePressCount() {
    const die = await DieModel.findById(this.dieId);
    const pressCount = (die.sizeAround + die.spaceAround) * (this.labelsPerRoll / 10); // eslint-disable-line no-magic-numbers

    this.pressCount = pressCount;
}

async function calculateOverrun() {
    const valueWasExplicitlySetToZero = this.overrun === 0;

    if (valueWasExplicitlySetToZero) return;

    const customer = await CustomerModel.findById(this.customerId);

    this.overrun = customer.overrun;
}

async function calculateDefaultValueForFrameNumberAcross() {
    const valueWasOverriddenByUser = Boolean(this.frameNumberAcross);

    if (valueWasOverriddenByUser) return;

    const material = await MaterialModel.findById(this.primaryMaterialId);
    const die = await DieModel.findById(this.dieId);
    const frameNumberAcross = Math.floor((die.sizeAcross + die.spaceAcross) / material.width);

    this.frameNumberAcross = frameNumberAcross;
}

function convertInchesToMillimeters(inches) {
    const MILLIMETERS_PER_INCH = 25.4;

    return inches * MILLIMETERS_PER_INCH;
}

function roundDownToNearestEvenWholeNumber(value) {
    return Math.floor(value / 2) * 2;
}

async function calculateDefaultValueForFrameNumberAround() {
    const valueWasOverriddenByUser = Boolean(this.frameNumberAround);

    if (valueWasOverriddenByUser) return;

    const die = await DieModel.findById(this.dieId);

    const frameNumberAround = Math.floor(MAX_FRAME_LENGTH_INCHES / (die.sizeAround + die.spaceAround));
    const isSizeAroundLessThanOrEqualToOne = die.sizeAround <= 1;

    if (isSizeAroundLessThanOrEqualToOne) {
        this.frameNumberAround = roundDownToNearestEvenWholeNumber(frameNumberAround);
    } else {
        this.frameNumberAround = frameNumberAround;
    };
}

async function calculateFrameRepeat() {
    const die = await DieModel.findById(this.dieId);
    const frameRepeatInInches = Math.floor(MAX_FRAME_LENGTH_INCHES / (die.sizeAround + die.spaceAround)) * (die.sizeAround + die.spaceAround);
    const frameRepeatInMillimeters = convertInchesToMillimeters(frameRepeatInInches);

    this.frameRepeat = frameRepeatInMillimeters;
}

const productSchema = new Schema({
    productNumber: {
        type: String,
        unique: true
    },
    productDescription: {
        type: String,
        required: true
    },
    dieId: {
        type: Schema.Types.ObjectId,
        ref: 'Die',
        required: true
    },
    unwindDirection: {
        type: String,
        enum: unwindDirections,
        default: defaultUnwindDirection
    },
    frameNumberAcross: {
        type: Number
    },
    frameNumberAround: {
        type: Number
    },
    frameRepeat: {
        type: Number,
    },
    ovOrEpm: {
        type: String,
        uppercase: true,
        enum: ['NO', 'OV', 'EPM'],
        default: 'NO'
    },
    artNotes: {
        type: String
    },
    primaryMaterialId: {
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    },
    secondaryMaterial: {
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: false
    },
    finish: {
        type: Schema.Types.ObjectId,
        ref: 'Finish',
        required: true
    },
    pressNotes: {
        type: String,
        required: false
    },
    finishType: {
        type: String,
        uppercase: true,
        enum: finishTypes,
        default: defaultFinishType
    },
    coreDiameter: {
        type: Number,
        default: 3,
        min: 0
    },
    labelsPerRoll: {
        type: Number,
        default: 1000,
        min: 0,
        validate : {
            validator : Number.isInteger,
            message   : 'labelsPerRoll must be an integer. The provided value was: \'{VALUE}\''
        },
    },
    dieCuttingNotes: {
        type: String
    },
    pressCount: {
        type: Number
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    overrun: { // TODO: Clarify this with Storm
        type: Number,
        required: false
    },
    authorUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

productSchema.pre('save', generateUniqueProductNumber);
productSchema.pre('save', calculatePressCount);
productSchema.pre('save', calculateOverrun);
productSchema.pre('save', calculateDefaultValueForFrameNumberAcross);
productSchema.pre('save', calculateDefaultValueForFrameNumberAround);
productSchema.pre('save', calculateFrameRepeat);

const ProductModel = mongoose.model('BaseProduct', productSchema);

module.exports = ProductModel;

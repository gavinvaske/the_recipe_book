const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const { unwindDirections, defaultUnwindDirection } = require('../enums/unwindDirectionsEnum');
const { finishTypes, defaultFinishType } = require('../enums/finishTypesEnum');
const { MAX_FRAME_LENGTH_INCHES } = require('../enums/constantsEnum');

async function generateUniqueProductNumber() {
    await this.populate('customer');
    const howManyProductsDoesThisCustomerHave = await ProductModel.countDocuments({ customer: this.customer._id });

    const nextProductId = howManyProductsDoesThisCustomerHave + 1;
    const numberOfDigitsInProductId = 3;
    const nextProductIdWithLeadingZero = nextProductId.toString().padStart(numberOfDigitsInProductId, '0');

    productNumber = `${this.customer.customerId}-${nextProductIdWithLeadingZero}`;

    this.productNumber = productNumber;
}

async function calculatePressCount() {
    await this.populate('die');
    const pressCount = (this.die.sizeAround + this.die.spaceAround) * (this.labelsPerRoll / 10); // eslint-disable-line no-magic-numbers

    this.pressCount = pressCount;
}

function convertInchesToMillimeters(inches) {
    const MILLIMETERS_PER_INCH = 25.4;

    return inches * MILLIMETERS_PER_INCH;
}

function roundDownToNearestEvenWholeNumber(value) {
    return Math.floor(value / 2) * 2;
}

async function setDefaultOverun() {
    if (this.overun !== undefined) return;
    
    await this.populate('customer');

    this.overun = this.customer.overun;
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
    die: {
        type: Schema.Types.ObjectId,
        ref: 'Die',
        required: true
    },
    unwindDirection: {
        type: String,
        enum: unwindDirections,
        default: defaultUnwindDirection,
        required: true
    },
    userDefinedFrameNumberAcross: { // Don't use this value. Use the virtual frameNumberAcrossAsync
        type: Number,
        required: false
    },
    userDefinedFrameNumberAround: { // Don't use this value. Use the virtual frameNumberAroundAsync
        type: Number,
        required: false
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
    primaryMaterial: {
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
        required: false
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
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    overun: {
        type: Number,
        required: false // This attribute is defaulted to customer.overun on-save of this object if not specified
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    spotPlate: {
        type: Boolean,
        default: false
    },
    numberOfColors: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : 'numberOfColors must be an integer. The provided value was: \'{VALUE}\''
        },
        min: 0
    }
}, { timestamps: true });

productSchema.pre('save', generateUniqueProductNumber);
productSchema.pre('save', calculatePressCount);
productSchema.pre('save', setDefaultOverun);

productSchema.virtual('frameNumberAcrossAsync').get(async function() {
    if (this.userDefinedFrameNumberAcross !== undefined) return this.userDefinedFrameNumberAcross;
    
    await this.populate(['primaryMaterial', 'die']);

    return Math.floor((this.die.sizeAcross + this.die.spaceAcross) / this.primaryMaterial.width);
});

productSchema.virtual('frameNumberAroundAsync').get(async function () {
    if (this.userDefinedFrameNumberAround !== undefined) return this.userDefinedFrameNumberAround;

    await this.populate('die');

    const frameNumberAround = Math.floor(MAX_FRAME_LENGTH_INCHES / (this.die.sizeAround + this.die.spaceAround));
    const isSizeAroundLessThanOrEqualToOne = this.die.sizeAround <= 1;

    if (isSizeAroundLessThanOrEqualToOne) {
        return roundDownToNearestEvenWholeNumber(frameNumberAround);
    } else {
        return frameNumberAround;
    };
});

productSchema.virtual('frameRepeatAsync').get(async function () {
    await this.populate('die');

    const { sizeAround, spaceAround } = this.die;
    const frameRepeatInInches = Math.floor(MAX_FRAME_LENGTH_INCHES / (sizeAround + spaceAround)) * (sizeAround + spaceAround);
    const frameRepeatInMillimeters = convertInchesToMillimeters(frameRepeatInInches);

    return frameRepeatInMillimeters;
});

productSchema.virtual('labelsPerFrameAsync').get(async function () {
    const frameNumberAcross = await this.frameNumberAcrossAsync;
    const frameNumberAround = await this.frameNumberAroundAsync;

    return frameNumberAcross * frameNumberAround;
});

productSchema.virtual('coreHeightAsync').get(async function () {
    await this.populate('die');
    const extraHeight = 0.125;

    return this.die.sizeAcross + extraHeight;
});

productSchema.virtual('pressCountAsync').get(async function () {
    await this.populate('die');

    const { sizeAround, spaceAround } = this.die;
    return (sizeAround + spaceAround) * (this.labelsPerRoll / 10); // eslint-disable-line no-magic-numbers
});

productSchema.virtual('labelCellAcrossAsync').get(async function () {
    await this.populate('die');
    return this.die.sizeAcross + this.die.spaceAcross;
});

productSchema.virtual('labelCellAroundAsync').get(async function () {
    await this.populate('die');
    return this.die.sizeAround + this.die.spaceAround;
});

productSchema.virtual('frameSizeAsync').get(async function () {
    const labelCellAround = await this.labelCellAroundAsync;
    const frameNumberAround = await this.frameNumberAroundAsync;

    return labelCellAround * frameNumberAround;
});

const ProductModel = mongoose.model('BaseProduct', productSchema);

module.exports = ProductModel;

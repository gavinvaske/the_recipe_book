const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const CustomerModel = require('./Customer');
const DieModel = require('./Die');
const { unwindDirections, defaultUnwindDirection } = require('../enums/unwindDirectionsEnum');
const { finishTypes, defaultFinishType } = require('../enums/finishTypesEnum');

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

const productSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
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
    // numberAround: {  // TODO: Clarify these with Storm
    //     type: Number,
    //     required: true
    // },
    // topToBottom: {
    //     type: Number,
    //     required: true,
    // },
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

const ProductModel = mongoose.model('BaseProduct', productSchema);

module.exports = ProductModel;

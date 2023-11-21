const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const addressSchema = require('../schemas/address');
const { FACTORY_ADDRESS } = require('../enums/constantsEnum');
const { validatePhoneNumber } = require('../services/dataValidationService');
const { convertDollarsToPennies, convertPenniesToDollars } = require('../services/currencyService');

mongoose.plugin(require('mongoose-delete'), { overrideMethods: true });

async function generatePackingSlipNumber() {
    const numberOfPackingSlipsInDatabase = await PackingSlip.countDocuments({});
    const startingPackingSlipNumber = 7000;

    this.packingSlipNumber = startingPackingSlipNumber + numberOfPackingSlipsInDatabase;
}

const DEFAULT_NAME_OF_SENDER = 'The Label Advantage';


const packingSlipSchema = new Schema({
    packingSlipNumber: {
        type: Number,
        index: true
    },
    nameOfSender: {
        type: String,
        default: DEFAULT_NAME_OF_SENDER
    },
    senderAddress: {
        type: addressSchema,
        default: FACTORY_ADDRESS
    },
    senderPhoneNumber: {
        type: String,
        validate: [validatePhoneNumber, '{VALUE} is not a valid phone number']
    },
    nameOfReceiver: {
        type: String
    },
    receiverAddress: {
        type: addressSchema,
    },
    deliveryMethod: {
        type: Schema.Types.ObjectId,
        ref: 'DeliveryMethod'
    },
    shippingCarrier: {
        type: String,
        uppercase: true
    },
    numberOfBoxes: {
        type: Number,
        validate: [Number.isInteger, '{VALUE} must be an integer'],
        min: 0,
    },
    weight: {
        type: Number,
        min: 0
    },
    freightCost: {
        type: Number,
        min: 0,
        get: convertPenniesToDollars,
        set: convertDollarsToPennies,
    },
    trackingNumber: {
        type: String
    },
    packingSlipDateTime: {
        type: Date,
        default: Date.now
    },
    freightAccountNumber: {
        type: String
    },
}, { timestamps: true });

packingSlipSchema.pre('save', generatePackingSlipNumber);

const PackingSlip = mongoose.model('PackingSlip', packingSlipSchema);

module.exports = PackingSlip;


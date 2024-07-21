import mongoose from 'mongoose'
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const DieModel = require('./Die');
const MaterialModel = require('./material');
const FinishModel = require('./finish');
const CustomerModel = require('./customer');
const UserModel = require('./user');

import mongooseDelete from 'mongoose-delete'
mongoose.plugin(mongooseDelete, { overrideMethods: true });

const { MAX_FRAME_LENGTH_INCHES } = require('../enums/constantsEnum');
import { sharedBaseProductMongooseAttributes } from '../enums/sharedBaseProductAttributesEnum.js';

function roundDownToNearestEvenWholeNumber(value) {
    return Math.floor(value / 2) * 2;
}

function convertInchesToMillimeters(inches) {
    const MILLIMETERS_PER_INCH = 25.4;
    return inches * MILLIMETERS_PER_INCH;
}

// TODO (8-21-2023): Gavin do I need this anymore after Storm deleted purchasedProduct?
const baseProductSnapshotSchema = new Schema({
    ...sharedBaseProductMongooseAttributes,
    die: {
        type: DieModel.schema,
        required: true
    },
    primaryMaterial: {
        type: MaterialModel.schema,
        required: true
    },
    secondaryMaterial: {
        type: MaterialModel.schema,
        required: true
    },
    finish: {
        type: FinishModel.schema,
        required: true
    },
    customer: {
        type: CustomerModel.schema,
        required: true
    },
    author: {
        type: UserModel.schema,
        required: true
    },
    frameNumberAcross: {
        type: Number,
        default: function () {
            return Math.floor((this.die.sizeAcross + this.die.spaceAcross) / this.primaryMaterial.width);
        },
        required: true
    },
    frameNumberAround: {
        type: Number,
        default: function () {
            const frameNumberAround = Math.floor(MAX_FRAME_LENGTH_INCHES / (this.die.sizeAround + this.die.spaceAround));
            const isSizeAroundLessThanOrEqualToOne = this.die.sizeAround <= 1;
        
            if (isSizeAroundLessThanOrEqualToOne) {
                return roundDownToNearestEvenWholeNumber(frameNumberAround);
            } else {
                return frameNumberAround;
            };
        },
        required: true
    },
    frameRepeat: {
        type: Number,
        default: function () {
            const { sizeAround, spaceAround } = this.die;
            const frameRepeatInInches = Math.floor(MAX_FRAME_LENGTH_INCHES / (sizeAround + spaceAround)) * (sizeAround + spaceAround);
            const frameRepeatInMillimeters = convertInchesToMillimeters(frameRepeatInInches);

            return frameRepeatInMillimeters;
        },
        required: true
    },
    labelsPerFrame: {
        type: Number,
        default: function () {
            return this.frameNumberAcross * this.frameNumberAround;
        },
        required: true
    },
    coreHeight: {
        type: Number,
        default: function () {
            const constant = 0.125;
            return this.die.sizeAcross + constant;
        },
        required: true
    },
    pressCount: {
        type: Number,
        default: function () {
            const fixedConstant = 10;
            // Note: the attribute 'labelsPerRoll' is injected into this model, see sharedBaseProductMongooseAttributes
            return (this.die.sizeAround + this.die.spaceAround) * (this.labelsPerRoll / fixedConstant);
        },
        required: true
    },
    deltaRepeat: {
        type: Number,
        default: function () {
            return this.frameNumberAround * this.die.spaceAround;
        },
        required: true
    },
    rotoRepeat: {
        type: Number,
        default: function () {
            return this.frameNumberAround * this.die.spaceAround * this.die.numberAround;
        },
        required: true
    },
    labelCellAcross: {
        type: Number,
        default: function () {
            return this.die.sizeAcross + this.die.spaceAcross;
        },
        required: true
    },
    labelCellAround: {
        type: Number,
        default: function () {
            return this.die.sizeAround + this.die.spaceAround;
        },
        required: true
    },
    frameSize: {
        type: Number,
        default: function () {
            return this.labelCellAround * this.frameNumberAround;
        },
        required: true
    },
}, { 
    timestamps: true,
    strict: 'throw'
});

const ProductModel = mongoose.model('BaseProductSnapshot', baseProductSnapshotSchema);

module.exports = ProductModel;

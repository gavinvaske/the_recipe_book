const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const Decimal = require('decimal.js');

mongoose.plugin(require('mongoose-delete'), {overrideMethods: true});

const FOUR_DECIMAL_PLACES = 4;

// For help deciphering these regex expressions, visit: https://regexr.com/
URL_VALIDATION_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

function validateUrl(url) {
    return URL_VALIDATION_REGEX.test(url);
}

function roundNumberToNthDecimalPlace(nthDecimalPlaces) {
    return function (number) {
        const moreAccurateNumber = new Decimal(number);

        return moreAccurateNumber.toFixed(nthDecimalPlaces);
    };
}

const weightPerMsiAttribute = {
    type: Number,
    min: 0,
    set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES),
};

const schema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true
    },
    materialId: {
        type: String,
        required: true,
        uppercase: true
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    materialCategory: {
        type: Schema.Types.ObjectId,
        ref: 'MaterialCategory',
        required: true
    },
    thickness: {
        type: Number,
        required: true,
        min: 0
    },
    weight: {
        type: Number,
        required: true,
        min: 0
    },
    costPerMsi: {
        type: Number,
        required: true,
        min: 0,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
    },
    freightCostPerMsi: {
        type: Number,
        required: true,
        min: 0,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
    },
    width: {
        type: Number,
        required: true,
        min: 0
    },
    faceColor: {
        type: String,
        required: true
    },
    adhesive: {
        type: String,
        required: true
    },
    adhesiveCategory: {
        type: Schema.Types.ObjectId,
        ref: 'AdhesiveCategory',
        required: true
    },
    quotePricePerMsi: {
        type: Number,
        required: true,
        min: 0,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
    },
    description: {
        type: String,
        required: true
    },
    whenToUse: {
        type: String,
        required: true
    },
    alternativeStock: {
        type: String,
        required: false
    },
    length: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message: '{VALUE} is not an integer'
        },
        min: 0
    },
    facesheetWeightPerMsi: {
        ...weightPerMsiAttribute,
        required: true
    },
    adhesiveWeightPerMsi: {
        ...weightPerMsiAttribute,
        required: true
    },
    linerWeightPerMsi: {
        ...weightPerMsiAttribute,
        required: true
    },
    location: {
      type: String,
      required: true
    },
    linerType: {
      type: Schema.Types.ObjectId,
      ref: 'LinerType',
      required: true
    },
    productNumber: {
      type: String,
      required: true,
      unique: true, // TODO: Test this
      uppercase: true
    },
    masterRollSize: {
      type: Number,
      required: true,
      validate : {
          validator : Number.isInteger,
          message: '{VALUE} is not an integer'
      },
      min: 1
    },
    image: { 
      type: String,
      required: true,
      validate: [validateUrl, '{VALUE} is not a valid url']
    }
}, {
    timestamps: true,
    strict: 'throw'
});

const Material = mongoose.model('Material', schema);

module.exports = Material;
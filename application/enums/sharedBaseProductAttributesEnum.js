const { unwindDirections, defaultUnwindDirection } = require('../enums/unwindDirectionsEnum');
const { finishTypes, defaultFinishType } = require('../enums/finishTypesEnum');

module.exports.sharedBaseProductMongooseAttributes = {
    productNumber: {
        type: String,
        unique: true
    },
    productDescription: {
        type: String,
        required: true
    },
    unwindDirection: {
        type: String,
        enum: unwindDirections,
        default: defaultUnwindDirection,
        required: true
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
    overun: {
        type: Number,
        required: false // This attribute is defaulted to customer.overun on-save of this object if not specified
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
};
import { unwindDirections, defaultUnwindDirection } from '../enums/unwindDirectionsEnum';
import { finishTypes, defaultFinishType } from '../enums/finishTypesEnum';

export const sharedBaseProductMongooseAttributes = {
    productNumber: {
        type: String,
        unique: true
    },
    productDescription: {
        type: String,
        required: true
    },
    unwindDirection: {
        type: Number,
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
            message: '{VALUE} is not an integer'
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
            message: '{VALUE} is not an integer'
        },
        min: 0
    }
};
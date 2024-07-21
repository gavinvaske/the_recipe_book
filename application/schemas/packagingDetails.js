import mongoose from 'mongoose'
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const packagingSchema = new Schema({
    rollsPerLayer: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        },
        required: true
    },
    layersPerBox: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        },
        required: true
    },
    rollsPerBox: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        },
        required: true
    },
    totalBoxes: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        },
        required: true
    },
    layerLayoutImagePath: {
        type: String
    }
}, { strict: 'throw' });

module.exports = packagingSchema;
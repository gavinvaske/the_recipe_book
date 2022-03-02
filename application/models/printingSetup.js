const mongoose = require('mongoose');
const Schema = mongoose.Schema;

URL_VALIDATION_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

function validateUrl(url) {
    return URL_VALIDATION_REGEX.test(url);
}

const schema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: false,
        required: true
    },
    machine: {
        type: Schema.Types.ObjectId,
        ref: 'machine',
        required: true
    },
    framesToRun: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        trim: true
    },
    material: {
        type: Schema.Types.ObjectId,
        ref: 'material',
        required: true
    },
    video: {
        type: String,
        validate: [validateUrl, 'Please fill a valid video url'],
        match: [URL_VALIDATION_REGEX, 'Please fill a valid video url'],
        trim: true
    },
    difficulty: {
        type: String,
        uppercase: true,
        enum: [
            'EASY',
            'MEDIUM',
            'HARD',
            'VERY DIFFICULT'
        ],
        required: true
    },
    alertTextBox: {
        type: String,
        trim: true
    },
    defaultMachine: {
        type: Schema.Types.ObjectId,
        ref: 'machine'
    },
    recipe: {
        type: Schema.Types.ObjectId,
        ref: 'recipe',
        required: true
    }
}, { timestamps: true });

const printingSetup = mongoose.model('printingSetups', schema);

module.exports = printingSetup;
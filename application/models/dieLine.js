const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const fileSchema = require('../schemas/s3File');

const dieLineSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    fileUploads: {
        type: [fileSchema],
        required: false
    }
}, { timestamps: true });

const DieLine = mongoose.model('DieLine', dieLineSchema);

module.exports = DieLine;
const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const fileSchema = require('./file');

const spotPlateSchema = new Schema({
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

module.exports = spotPlateSchema;
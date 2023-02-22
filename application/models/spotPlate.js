const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const fileSchema = require('../schemas/file');

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

const SpotPlate = mongoose.model('SpotPlate', spotPlateSchema);

module.exports = SpotPlate;
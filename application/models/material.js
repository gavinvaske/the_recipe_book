const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    materialId: {
        type: String,
        required: true,
        trim: true

    }
}, { timestamps: true });

const Material = mongoose.model('Material', schema);

module.exports = Material;
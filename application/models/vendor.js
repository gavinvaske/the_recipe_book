const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
}, { timestamps: true });

const Vendor = mongoose.model('Vendor', schema);

module.exports = Vendor;
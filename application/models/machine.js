const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
}, { timestamps: true });

const Machine = mongoose.model('Machine', schema);

module.exports = Machine;

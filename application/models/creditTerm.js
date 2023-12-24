const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const schema = new Schema({
    description: {
        type: String,
        required: true,
        // TODO (12-24-2023): Test the configs below
        uppercase: true,
        unique: true,
        trim: true,
        index: true
    },
}, { timestamps: true });

const CreditTerm = mongoose.model('CreditTerm', schema);

module.exports = CreditTerm;
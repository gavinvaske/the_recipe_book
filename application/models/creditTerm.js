const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const schema = new Schema({
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const CreditTerm = mongoose.model('CreditTerm', schema);

module.exports = CreditTerm;
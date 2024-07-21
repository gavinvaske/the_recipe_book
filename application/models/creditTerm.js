import mongoose from 'mongoose'
mongoose.Schema.Types.String.set('trim', true);
mongoose.plugin(require('mongoose-delete'), { overrideMethods: true });
const Schema = mongoose.Schema;

const schema = new Schema({
    description: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
        index: true
    },
}, { timestamps: true });

const CreditTerm = mongoose.model('CreditTerm', schema);

module.exports = CreditTerm;
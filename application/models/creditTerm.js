import mongoose from 'mongoose'
mongoose.Schema.Types.String.set('trim', true);
import mongooseDelete from 'mongoose-delete'
mongoose.plugin(mongooseDelete, { overrideMethods: true });
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
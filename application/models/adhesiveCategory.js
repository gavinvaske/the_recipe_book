const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const AdhesiveCategory = mongoose.model('AdhesiveCategory', schema);

module.exports = AdhesiveCategory;
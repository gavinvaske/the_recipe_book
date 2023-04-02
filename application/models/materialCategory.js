const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true
    }
}, { timestamps: true });

const MaterialCategory = mongoose.model('MaterialCategory', schema);

module.exports = MaterialCategory;
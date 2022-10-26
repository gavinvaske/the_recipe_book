const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    materialId: {
        type: String,
        required: true

    }
}, { timestamps: true });

const Material = mongoose.model('Material', schema);

module.exports = Material;
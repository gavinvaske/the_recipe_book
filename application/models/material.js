const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true
    },
    materialId: {
        type: String,
        required: true
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    materialCategory: {
        type: Schema.Types.ObjectId,
        ref: 'MaterialCategory',
        required: true
    }
}, { timestamps: true });

const Material = mongoose.model('Material', schema);

module.exports = Material;
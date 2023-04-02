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
    },
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: false,
    }
}, { timestamps: true });

const Material = mongoose.model('Material', schema);

module.exports = Material;
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
        required: true,
        set: function(vendorObjectId) {
            if (vendorObjectId === '') return null;

            return vendorObjectId;
        }
    },
    materialCategory: {
        type: Schema.Types.ObjectId,
        ref: 'MaterialCategory',
        required: true,
        set: function(materialCategoryObjectId) {
            if (materialCategoryObjectId === '') return null;

            return materialCategoryObjectId;
        }
    }
}, { timestamps: true });

const Material = mongoose.model('Material', schema);

module.exports = Material;
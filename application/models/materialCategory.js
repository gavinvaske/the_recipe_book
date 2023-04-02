const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const schema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true
    }
}, { timestamps: true });

schema.plugin(mongoose_delete, {overrideMethods: true});

const MaterialCategory = mongoose.model('MaterialCategory', schema);

module.exports = MaterialCategory;
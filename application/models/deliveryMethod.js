const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

mongoose.plugin(require('mongoose-delete'), {overrideMethods: true});

const deliveryMethodSchema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true,
        // TODO (12-4-2023): TEST the configs below
        unique: true,
        trim: true,
        index: true
    }
}, { timestamps: true });

const deliveryMethodModel = mongoose.model('DeliveryMethod', deliveryMethodSchema);

module.exports = deliveryMethodModel;

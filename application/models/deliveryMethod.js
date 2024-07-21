import mongoose from 'mongoose'
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

mongoose.plugin(require('mongoose-delete'), {overrideMethods: true});

const deliveryMethodSchema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
        index: true
    }
}, { timestamps: true });

const deliveryMethodModel = mongoose.model('DeliveryMethod', deliveryMethodSchema);

module.exports = deliveryMethodModel;

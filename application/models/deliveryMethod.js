import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

import mongooseDelete from 'mongoose-delete';
mongoose.plugin(mongooseDelete, { overrideMethods: true });

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

export default deliveryMethodModel;

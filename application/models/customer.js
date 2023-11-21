const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const addressSchema = require('../schemas/address');
const contactSchema = require('../schemas/contact');

mongoose.plugin(require('mongoose-delete'), {overrideMethods: true});

function doesArrayContainElements(value) {
    return value.length > 0;
}

// ShippingLocations inherit the attributes from the address schema and add additional properties.
// To learn more, read about "discriminators" here: https://mongoosejs.com/docs/discriminators.html
const shippingLocationsSchema = new mongoose.Schema({
    ...addressSchema.obj,
    freightAccountNumber: {
        type: String
    },
    deliveryMethod: {
        type: Schema.Types.ObjectId,
        ref: 'DeliveryMethod'
    }
});

const schema = new Schema({
    customerId: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
    },
    notes: {
        type: String
    },
    businessLocations: {
        type: [addressSchema]
    },
    shippingLocations: {
        type: [shippingLocationsSchema]
    },
    billingLocations: {
        type: [addressSchema]
    },
    contacts: {
        type: [contactSchema],
        validate: [doesArrayContainElements, 'Must have at least one contact']
    },
    creditTerms: {
        type: [Schema.Types.ObjectId],
        ref: 'CreditTerm'
    },
    overun: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Customer = mongoose.model('Customer', schema);

module.exports = Customer;
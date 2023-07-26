const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const addressSchema = require('../schemas/address');
const contactSchema = require('../schemas/contact');

function doesArrayContainElements(value) {
    return value.length > 0;
}

const schema = new Schema({
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
        type: [addressSchema]
    },
    billingLocations: {
        type: [addressSchema]
    },
    contacts: {
        type: [contactSchema],
        validate: [doesArrayContainElements, 'Must have at least one contact']
    },
    overrun: {
        type: Number,
        required: true
    },
    creditTerms: {
        type: [Schema.Types.ObjectId],
        ref: 'CreditTerm'
    },
    customerId: {
        type: String,
        required: true,
        uppercase: true,
    }
}, { timestamps: true });

const Customer = mongoose.model('Customer', schema);

module.exports = Customer;
const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const addressSchema = require('../schemas/address');
const contactSchema = require('../schemas/contact');

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
        type: [contactSchema]
    },
    overRun: {
        type: Boolean
    },
    creditTerms: {
        type: [Schema.Types.ObjectId],
        ref: 'CreditTerm'
    }
}, { timestamps: true });

const Customer = mongoose.model('Customer', schema);

module.exports = Customer;
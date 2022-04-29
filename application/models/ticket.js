const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// For help deciphering these regex expressions, visit: https://regexr.com/
TICKET_NUMBER_REGEX = /^\d{1,}$/;

function stringOnlyContainsDigits(ticketNumber) {
    return TICKET_NUMBER_REGEX.test(ticketNumber);
}

const schema = new Schema({
    products: {
        type: [
            {
                type : Schema.Types.ObjectId, 
                ref: 'Product' 
            }
        ]
    },
    ticketNumber: {
        type: String,
        validate: [stringOnlyContainsDigits, 'Ticket Number must only contain digits'],
        required: true,
        alias: 'TicketNumber'
    },
    shipDate: {
        type: Date,
        required: true,
        alias: 'Ship_by_Date'
    },
    orderDate: {
        type: Date,
        required: false,
        alias: 'OrderDate'
    },
    estimatedFootage: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : 'Estimated Footage must be an integer'
        },
        min: 1,
        alias: 'EstFootage'
    },
    poNumber: {
        type: String,
        required: true,
        alias: 'PO_Number'
    },
    priority: {
        type: String,
        required: true,
        alias: 'Priority'
    },
    notes: {
        type: String,
        required: false,
        alias: 'Notes'
    },
    billingZipCode: {
        type: String,
        required: false,
        alias: 'BillZip'
    },
    billingCity: {
        type: String,
        required: false,
        alias: 'BillCity'
    },
    billingAddress: {
        type: String,
        required: false,
        alias: 'BillAddr1'
    },
    billingUnitNumber: {
        type: String,
        required: false,
        alias: 'BillAddr2'
    },
    billingLocationName: {
        type: String,
        required: false,
        alias: 'BillLocation'
    },
    shipZipCode: {
        type: String,
        required: false,
        alias: 'ShipZip'
    },
    shipState: {
        type: String,
        required: false,
        alias: 'ShipState'
    },
    shipCity: {
        type: String,
        required: false,
        alias: 'ShipCity'
    },
    shippingAddress: {
        type: String,
        required: false,
        alias: 'ShipAddr1'
    },
    shippingUnitNumber: {
        type: String,
        required: false,
        alias: 'ShipAddr2'
    },
    shippingLocationName: {
        type: String,
        required: false,
        alias: 'ShipLocation'
    },
    shippingInstructions: {
        type: String,
        required: false,
        alias: 'ShipInstruc'
    },
    shippingMethod: {
        type: String,
        required: false,
        alias: 'ShipVia'
    },
    shippingEmailAddress: {
        type: String,
        required: false,
        alias: 'ShipAttn_EmailAddress'
    },
    billingState: {
        type: String,
        required: false,
        alias: 'BillState'
    }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', schema);

module.exports = Ticket;

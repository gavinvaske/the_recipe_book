const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = require('./product').schema;
const chargeSchema = require('./charge').schema;
const {departments} = require('../enums/departmentsEnum');

// For help deciphering these regex expressions, visit: https://regexr.com/
TICKET_NUMBER_REGEX = /^\d{1,}$/;

function stringOnlyContainsDigits(ticketNumber) {
    return TICKET_NUMBER_REGEX.test(ticketNumber);
}

function departmentIsValid(destination) {
    const department = destination.department;
    const subDepartment = destination.subDepartment;
    const bothAttributesAreEmpty = !department && !subDepartment;
    const oneAttributeIsDefinedButNotTheOther = (department && !subDepartment) || (!department && subDepartment);

    if (bothAttributesAreEmpty) {
        return true;
    }

    if (oneAttributeIsDefinedButNotTheOther) {
        return false;
    }

    return departments[department].includes(subDepartment);
}

const departmentNotesSchema = new Schema({
    orderPrep: {
        type: String
    },
    artPrep: {
        type: String
    },
    prePress: {
        type: String
    },
    printing: {
        type: String
    },
    cutting: {
        type: String
    },
    winding: {
        type: String
    },
    shipping: {
        type: String
    },
    billing: {
        type: String
    }
}, { 
    timestamps: true,
    strict: 'throw'
});

const destinationSchema = new Schema({
    department: {
        type: String,
    },
    subDepartment: {
        type: String
    }
}, { timestamps: true });

const ticketSchema = new Schema({
    departmentNotes: {
        type: departmentNotesSchema,
        required: false
    },
    destination: {
        type: destinationSchema,
        required: false,
        validate: [departmentIsValid, 'Invalid Department/Sub-department combination']
    },
    printingType: {
        type: String,
        required: false,
        enum: [
            'CMYK',
            'CMYK + W',
            'BLANKS',
            'CMYK OV + W',
            'BLACK ONLY',
            'EPM',
            'BLACK & WHITE',
            'CMYK OV',
        ]
    },
    products: {
        type: [productSchema],
    },
    extraCharges: {
        type: [chargeSchema]
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
        required: false,
        alias: 'CustPONum'
    },
    priority: {
        type: String,
        required: true,
        alias: 'Priority'
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
        alias: 'ShipSt'
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
        alias: 'ShippingInstruc'
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
    },
    totalLabelQty: {
        type: Number,
        default: function() {
            let sum = 0; // eslint-disable-line no-magic-numbers

            if (this.products.length) {
                this.products.forEach((product) => {
                    sum = sum + product.labelQty;
                });
            }
            return sum;
        }
    },
    totalWindingRolls: {
        type: Number,
        default: function() {
            let sum = 0; // eslint-disable-line no-magic-numbers

            if (this.products.length) {
                this.products.forEach((product) => {
                    sum = sum + product.totalWindingRolls;
                });
            }
            return sum;
        }
    }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;

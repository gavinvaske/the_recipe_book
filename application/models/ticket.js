const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const productSchema = require('./product').schema;
const chargeSchema = require('./charge').schema;
const destinationSchema = require('../models/destination').schema;
const {standardPriority, getAllPriorities} = require('../enums/priorityEnum');
const MaterialModel = require('../models/material');
const WorkflowStepModel = require('../models/WorkflowStep');

// For help deciphering these regex expressions, visit: https://regexr.com/
TICKET_NUMBER_REGEX = /^\d{1,}$/;
const EMAIL_VALIDATION_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function stringOnlyContainsDigits(ticketNumber) {
    return TICKET_NUMBER_REGEX.test(ticketNumber);
}

const validateEmail = function(email) {
    return EMAIL_VALIDATION_REGEX.test(email);
};

async function validateMaterialExists(materialId) {
    const searchCriteria = {
        materialId: {$regex: materialId, $options: 'i'}
    };
    
    try {
        const material = await MaterialModel.findOne(searchCriteria).exec();

        return !material ? false : true;
    } catch (error) {
        return false;
    }
}

const departmentNotesSchema = new Schema({
    orderPrep: {
        type: String
    },
    artPrep: {
        type: String
    },
    prePrinting: {
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

const ticketSchema = new Schema({
    primaryMaterial: {
        type: String,
        required: false,
        default: function() {
            if (this.products && this.products.length > 0) { // eslint-disable-line no-magic-numbers
                return this.products[0].primaryMaterial;
            }
        },
        validate: [validateMaterialExists, 'Unknown material ID of "{VALUE}". Please add this material ID thru the admin panel before uploading the XML'],
    },
    departmentNotes: {
        type: departmentNotesSchema,
        required: false
    },
    destination: {
        type: destinationSchema,
        required: false
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
        alias: 'Priority',
        default: standardPriority,
        enum: getAllPriorities()
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
        validate: [validateEmail, '"ShipAttn_EmailAddress" must be a valid email address'],
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
        required: true,
        default: function() {
            let sum = 0; // eslint-disable-line no-magic-numbers

            if (this.products.length) {
                this.products.forEach((product) => {
                    sum = sum + product.totalWindingRolls;
                });
            }
            return sum;
        }
    },
    customerName: {
        type: String,
        required: true,
        alias: 'Company'
    },
    sentDate: {
        type: Date,
        required: false
    },
    followUpDate: {
        type: Date,
        required: false
    },
}, { timestamps: true });

ticketSchema.pre('save', function(next) {
    this.products && this.products.forEach((product) => {
        product.primaryMaterial = this.primaryMaterial;
    });

    next();
});

async function addRowToWorkflowStepDbTable(next) {
    const destination = this.getUpdate().$set.destination;

    if (!destination) {
        return next();
    }

    const workflowStepAttributes = {
        ticketId: this.getQuery()._id,
        destination
    };

    try {
        const workflowStep = new WorkflowStepModel(workflowStepAttributes);

        await WorkflowStepModel.create(workflowStep);
    } catch (error) {
        console.log(`Error during mongoose ticketSchema.pre('updateOne') or ticketSchema.pre('findOneAndUpdate') hook: ${error}; attributes used: ${JSON.stringify(workflowStepAttributes)}`);
        return next(error);
    }
}

ticketSchema.pre('updateOne', addRowToWorkflowStepDbTable);
ticketSchema.pre('findOneAndUpdate', addRowToWorkflowStepDbTable);

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;

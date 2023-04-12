const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const productSchema = require('../schemas/product');
const chargeSchema = require('../schemas/charge');
const destinationSchema = require('../schemas/destination');
const departmentNotesSchema = require('../schemas/departmentNotes');
const {standardPriority, getAllPriorities} = require('../enums/priorityEnum');
const MaterialModel = require('../models/material');
const WorkflowStepModel = require('../models/WorkflowStep');
const departmentsEnum = require('../enums/departmentsEnum');
const ticketService = require('../services/ticketService');

// For help deciphering these regex expressions, visit: https://regexr.com/
TICKET_NUMBER_REGEX = /^\d{1,}$/;
const EMAIL_VALIDATION_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function isValidTicketDestination(destination) {
    const {department, departmentStatus} = destination;

    if (!destination.department && !destination.departmentStatus) return false;

    const validDepartmentStatuses = departmentsEnum.departmentToStatusesMappingForTicketObjects[department];

    if (!validDepartmentStatuses) return false;

    if (validDepartmentStatuses.length === 0) { 
        return !departmentStatus;
    };
    
    return validDepartmentStatuses.includes(departmentStatus);
}

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

function validateKeysAreAllValidDepartments(departmentToHoldReason) {
    const potentiallyValidDepartmentNames = Object.keys(departmentToHoldReason.toJSON());
    const validDepartmentNames = departmentsEnum.getAllDepartments();

    return potentiallyValidDepartmentNames.every((departmentName) => {
        return validDepartmentNames.includes(departmentName);
    });
}

function validateTotalMaterialIsCalculatedCorrectly(actualTotalMaterialLength) {
    if (!this.totalFramesRan) {
        return true;
    }

    const expectedTotalMaterialLength = ticketService.computeTotalMaterialLength(this.frameSize, this.totalFramesRan, this.attempts);

    const acceptableDifference = 0.01;
    const differenceBetweenActualAndExpected = Math.abs(expectedTotalMaterialLength - actualTotalMaterialLength);
    
    const isCalculatedCorrectly = differenceBetweenActualAndExpected <= acceptableDifference;
    
    return isCalculatedCorrectly;
}

const ticketSchema = new Schema({
    primaryMaterial: {
        type: String,
        required: false,
        default: function() {
            if (this.products && this.products.length > 0) {
                return this.products[0].primaryMaterial;
            }
        },
        validate: [validateMaterialExists, 'Unknown material ID of "{VALUE}". Please add this material ID through the admin panel before uploading the XML'],
    },
    departmentNotes: {
        type: departmentNotesSchema,
        required: false,
        default: {}
    },
    destination: {
        type: destinationSchema,
        required: false,
        validate: [isValidTicketDestination, 'A "Ticket" cannot be moved to the following destination: {VALUE}']
    },
    products: {
        type: [productSchema],
        set: function(products) {
            try {
                products && products.sort(function(product1, product2) {
                    return getNumberToTheRightOfTheHyphen(product1.productNumber) - getNumberToTheRightOfTheHyphen(product2.productNumber);
                });
            } catch (error) {
                console.log('Error occurred while sorting ticket.products: ' + error.message);
            }
            
            return products;
        }
    },
    extraCharges: {
        type: [chargeSchema]
    },
    ticketNumber: {
        type: String,
        validate: [stringOnlyContainsDigits, 'Ticket Number must only contain digits'],
        required: true,
        alias: 'TicketNumber',
        unique: true
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
    estimatedTotalMaterialLength: {
        type: Number,
        required: true,
        default: function() {
            let sum = 0;

            this.products && this.products.forEach((product) => {
                sum = sum + product.totalFeet;
            });
            return sum;
        },
        min: 0
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
        default: function () {
            let sum = 0;

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
            let sum = 0;

            if (this.products.length) {
                this.products.forEach((product) => {
                    sum = sum + product.totalWindingRolls;
                });
            }
            return sum;
        }
    },
    totalMaterialLength: {
        type: Number,
        required: true,
        default: function() {
            return this.estimatedTotalMaterialLength;
        },
        validate: [validateTotalMaterialIsCalculatedCorrectly, '"ticket.totalMaterialLength" was not calculated correctly according to the formula: frameSize * totalFramesRan / 12'],
        min: 0
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
    departmentToHoldReason: {
        type: Map,
        of: String,
        required: false,
        default: {},
        validate: [validateKeysAreAllValidDepartments, 'The attribute "departmentToHoldReason" must only contain keys which are valid departments']
    },
    ticketGroup: {
        type: Schema.Types.ObjectId,
        ref: 'TicketGroup',
        required: false
    },
    departmentToJobComment: {
        type: departmentNotesSchema,
        required: false,
        default: {}
    },
    attempts: {
        type: Number,
        required: false,
        default: 0,
        min: 0
    },
    totalFramesRan: {
        type: Number,
        required: false,
        min: 0
    }
}, { 
    timestamps: true
});

ticketSchema.pre('save', function(next) {
    this.products && this.products.forEach((product) => {
        product.primaryMaterial = this.primaryMaterial;
    });

    next();
});

ticketSchema.virtual('frameSize').get(function() {
    const product = this.products[0];
    const frameSizeInInches = product.measureAround * product.labelsAround;

    return frameSizeInInches;
});

ticketSchema.virtual('numberOfProofsThatHaveNotBeenUploadedYet').get(function() {
    let numberOfProofsThatHaveNotBeenUploadedYet = 0;

    this.products && this.products.forEach((product) => {
        const hasProofBeenUploaded = product.proof && product.proof.url;

        if (!hasProofBeenUploaded) {
            numberOfProofsThatHaveNotBeenUploadedYet += 1;
        }
    });
    return numberOfProofsThatHaveNotBeenUploadedYet;
});

ticketSchema.post('save', function(error, doc, next) {
    const mongooseDupliateErrorCode = 11000;
    const duplicateErrorCodeDetected = error.code === mongooseDupliateErrorCode;

    if (duplicateErrorCodeDetected) {
        next(new Error(`Cannot create this ticket whose ticket number is "${doc.ticketNumber}" because it is a duplicate of an existing ticket already saved to the database!`));
    } else {
        next(error);
    }
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

function getNumberToTheRightOfTheHyphen(productNumber) {
    return Number(productNumber.split('-')[1]);
}

ticketSchema.pre('updateOne', addRowToWorkflowStepDbTable);
ticketSchema.pre('findOneAndUpdate', addRowToWorkflowStepDbTable);

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;

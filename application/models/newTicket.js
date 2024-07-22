import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import destinationSchema from '../schemas/destination.js';
import * as departmentsEnum from '../enums/departmentsEnum.js';
import WorkflowStepModel from '../models/WorkflowStep.js';
const purchasedProductSchema = require('../schemas/purchasedProduct');

import mongooseDelete from 'mongoose-delete';
mongoose.plugin(mongooseDelete, { overrideMethods: true });

async function generateUniqueTicketNumber() {
    const numberOfTicketsInDatabase = await Ticket.countDocuments({});
    const startingTicketNumber = 60000;

    this.ticketNumber = startingTicketNumber + numberOfTicketsInDatabase;
}

async function appendCustomerNotes() {
    await this.populate('customer');

    const ticketNotesWithCustomerNotesAppended = `${this.ticketNotes}\n\nCustomer Notes:\n${this.customer.notes}`;
    this.ticketNotes = ticketNotesWithCustomerNotesAppended;
}

function isValidTicketDestination(destination) {
    const {department, departmentStatus} = destination;

    if (!destination.department && !destination.departmentStatus) return false;

    const validDepartmentStatuses = departmentsEnum.departmentToStatusesMappingForTicketObjects[department];

    if (!validDepartmentStatuses) return false;

    if (validDepartmentStatuses.length === 0) return !departmentStatus;
    
    return validDepartmentStatuses.includes(departmentStatus);
}

const timeInSecondsAttribute = {
    type: Number,
    min: 0,
    validate: { validator: Number.isInteger, message: '{VALUE} is not an integer' },
    default: 0
};

const timeAndFeetSchema = new Schema({
    time: timeInSecondsAttribute,
    feet: {
        type: Number,
        min: 0,
        validate: { validator: Number.isInteger, message: '{VALUE} is not an integer' },
    }
});

const dieCutterDownSchema = new Schema({
    time: timeInSecondsAttribute,
    reason: {
        type: String
    },
    footageLost: {
        type: Number,
        min: 0,
        validate: { validator: Number.isInteger, message: '{VALUE} is not an integer' }
    }
});

const positiveIntegerSchema = new Schema({
    value: {
        type: Number,
        min: 0,
        validate: { validator: Number.isInteger, message: '{VALUE} is not an integer' },
        default: 0
    }
}, { timestamps: true });

const boxSchema = new Schema({
    rollsPerBox: {
        type: Number,
        min: 0,
        default: 0
    },
    boxSize: {
        type: Number,
        min: 0,
        default: 0
    },
    quantityOfBoxes: {
        type: Number,
        min: 0,
        default: 0
    }
});

const schema = new Schema({
    ticketNumber: {
        type: Number,
        index: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    ticketNotes: {
        type: String
    },
    shipDate: {
        type: Date,
        required: true
    },
    customerPo: {
        type: String
    },
    startingImpressions: {
        type: Number,
        min: 0
    },
    totalStockLength: {
        type: Number,
        required: true,
        min: 0
    },
    totalFramesRan: {
        type: Number,
        required: true,
        min: 0
    },
    endingImpressions: {
        type: Number,
        required: true,
        min: 0
    },
    printingOutsideRollWaste: {
        type: Number,
        default: 0,
        min: 0
    },
    printingStockDefectWaste: {
        type: Number,
        default: 0,
        min: 0
    },
    printingDefectWaste: {
        type: Number,
        default: 0,
        min: 0
    },
    printingOperatorErrorStockWaste: {
        type: Number,
        default: 0,
        min: 0
    },
    colorCalibrations: {
        type: [positiveIntegerSchema]
    },
    scalings: {
        type: [positiveIntegerSchema]
    },
    printCleaners: {
        type: [positiveIntegerSchema]
    },
    bcsCleaners: {
        type: Number,
        default: 0,
        min: 0,
        validate: { validator: Number.isInteger, message: '{VALUE} is not an integer' }
    },
    proofRunups: {
        type: [positiveIntegerSchema]
    },
    dieLineFrames: {
        type: Number,
        default: 0,
        min: 0,
        validate: { validator: Number.isInteger, message: '{VALUE} is not an integer' }
    },
    extraDieCuttingFrames: {
        type: Number,
        default: 0,
        min: 0,
        validate: { validator: Number.isInteger, message: '{VALUE} is not an integer' }
    },
    newMaterialSplices: {
        type: [positiveIntegerSchema]
    },
    existingMaterialSplices: {
        type: [positiveIntegerSchema]
    },
    materialWrapUps: {
        type: [positiveIntegerSchema]
    },
    webBreaks: {
        type: [positiveIntegerSchema]
    },
    newInkBuilds: {
        type: [positiveIntegerSchema]
    },
    imagePlacements: {
        type: [positiveIntegerSchema]
    },
    colorSeperations: {
        type: [positiveIntegerSchema]
    },
    trailingEdges: {
        type: [positiveIntegerSchema]
    },
    leadingEdges: {
        type: [positiveIntegerSchema]
    },
    printingJobComments: {
        type: String
    },
    jobSetup: {
        type: timeAndFeetSchema
    },
    jobRun: {
        type: timeAndFeetSchema
    },
    tearDownTime: timeInSecondsAttribute,
    dieCutterDown: dieCutterDownSchema,
    cuttingOutsideRollWaste: {
        type: Number,
        default: 0,
        min: 0
    },
    cuttingStockDefectWaste: {
        type: Number,
        default: 0,
        min: 0
    },
    cuttingDefectWaste: {
        type: Number,
        default: 0,
        min: 0
    },
    cuttingOperatorErrorStockWaste: {
        type: Number,
        default: 0,
        min: 0
    },
    cuttingJobComments: {
        type: String
    },
    rewindingDuration: timeInSecondsAttribute,
    windingJobComments: {
        type: String
    },
    packagingDuration: timeInSecondsAttribute,
    boxes: {
        type: [boxSchema]
    },
    totalRollsBoxed: {
        type: Number,
        get: function () {
            return this.boxes.reduce((total, box) => total + box.rollsPerBox, 0);
        }
    },
    totalQtyBoxed: {
        type: Number,
        default: 0,
        min: 0
    },
    packagingJobComments: {
        type: String
    },
    destination: {
        type: destinationSchema,
        required: false,
        validate: [isValidTicketDestination, 'A "Ticket" cannot be moved to the following destination: {VALUE}']
    },
    products: {
        type: [purchasedProductSchema]
    },
    packingSlips: {
        type: [Schema.Types.ObjectId],
        ref: 'PackingSlip',
    },
    estimatedTicket: {
        type: Schema.Types.ObjectId,
        ref: 'EstimatedTicket'
    }
}, { timestamps: true });

async function addRowToWorkflowStepDbTable(next, destination, ticketId) {
    if (!destination) return next();

    const workflowStepAttributes = { ticketId, destination };

    try {
        const workflowStep = new WorkflowStepModel(workflowStepAttributes);

        await WorkflowStepModel.create(workflowStep);
    } catch (error) {
        console.log('Error when saving a workflowStep to the database: ', error, '\nThe workflowStepAttributes attributes were: ', workflowStepAttributes);
        return next(error);
    }
}

schema.pre('save', generateUniqueTicketNumber);
schema.pre('save', appendCustomerNotes);

schema.pre(['updateOne', 'findOneAndUpdate'], async function(next) {
    const destination = this.getUpdate().$set.destination;
    const ticketId = this.getQuery()._id;

    await addRowToWorkflowStepDbTable(next, destination, ticketId);
});

schema.pre('save', async function(next) {
    const destination = this.destination;
    const ticketId = this._id;

    await addRowToWorkflowStepDbTable(next, destination, ticketId);
});

const Ticket = mongoose.model('NewTicket', schema); // TODO (8-21-2023): Gavin rename this to "Ticket" after deprecating the old Ticket.js model

module.exports = Ticket;
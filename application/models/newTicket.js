const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
mongoose.plugin(require('mongoose-delete'), { overrideMethods: true });

async function generateUniqueTicketNumber() {
    const numberOfTicketsInDatabase = await Ticket.countDocuments({});
    const startingTicketNumber = 60000;

    this.ticketNumber = startingTicketNumber + numberOfTicketsInDatabase;
}

const schema = new Schema({
    ticketNumber: {
        type: Number
    },
    // ticketNotes: {}  // TODO (8-21-2023): Talk to Storm about this field
    shipDate: {
        type: Date,
        required: true
    },
    customerPo: {
        type: String,
        required: false
    },
    startingImpressions: {
        type: Number,
        required: false,
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
    outsideRollWaste: {
        type: Number,
        default: 0,
        min: 0
    },
    stockDefectWaste: {
        type: Number,
        default: 0,
        min: 0
    },
    printDefectWaste: {
        type: Number,
        default: 0,
        min: 0
    },
    operatorErrorStockWaste: {
        type: Number,
        default: 0,
        min: 0
    },
    // colorCalibrations: {},
    // scalings: {},
    // printCleaners: {},
    bcsCleaners: {
        type: Number,
        default: 0,
        min: 0
    },
    // proofRunups: {},
    dieLineFrames: {
        type: Number,
        default: 0,
        min: 0
    },
    extraDieCuttingFrames: {
        type: Number,
        default: 0,
        min: 0
    },
    // newMaterialSpliceTime: {},
    // existingMaterialSpliceTime: {},
    // materialWrapUps: {},
    // webBreaks: {},
    // newInkBuildTime: {},
    imagePlacementTime: {
        type: Number,
        default: 0,
        min: 0
    },
    colorSeperations: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    },
    trailingEdges: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    },
    leadingEdges: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    },
    jobComments: {
        type: String,
        required: false
    },
    // jobSetup: {},
    // jobRun: {},
    // tearDown: {},
    // dieCutterDown: {},
}, { timestamps: true });

schema.pre('save', generateUniqueTicketNumber);

const Ticket = mongoose.model('NewTicket', schema); // TODO (8-21-2023): Gavin rename this to "Ticket" after deprecating the old Ticket.js model

module.exports = Ticket;
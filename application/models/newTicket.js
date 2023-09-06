const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
mongoose.plugin(require('mongoose-delete'), { overrideMethods: true });

async function generateUniqueTicketNumber() {
    const numberOfTicketsInDatabase = await Ticket.countDocuments({});
    const startingTicketNumber = 60000;

    this.ticketNumber = startingTicketNumber + numberOfTicketsInDatabase;
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

const timeSchema = new Schema({
    time: timeInSecondsAttribute
});

const proofRunupSchema = new Schema({
    time: timeInSecondsAttribute,
    imagePlacement: {
        type: Boolean,
        required: true
    }
});

const valueSchema = new Schema({
    value: {
        type: Number,
        min: 0,
        validate: { validator: Number.isInteger, message: '{VALUE} is not an integer' },
        default: 0
    }
});

const timeAndFeetLostAndFramesAddedSchema = new Schema({
    time: timeInSecondsAttribute,
    feetLost: {
        type: Number,
        min: 0,
        validate: { validator: Number.isInteger, message: '{VALUE} is not an integer' },
        default: 0
    },
    framesAdded: {
        type: Number,
        min: 0,
        validate: { validator: Number.isInteger, message: '{VALUE} is not an integer' },
        default: 0
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
    // ticketNotes: {}, // TODO (9-5-2023): I need a customerId on the ticket in order to add their notes to the ticket
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
        type: [timeAndFeetSchema]
    },
    scalings: {
        type: [timeAndFeetSchema]
    },
    printCleaners: {
        type: [timeAndFeetSchema]
    },
    bcsCleaners: {
        type: Number,
        default: 0,
        min: 0,
        validate: { validator: Number.isInteger, message: '{VALUE} is not an integer' }
    },
    proofRunups: {
        type: [proofRunupSchema]
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
    newMaterialSpliceTime: timeInSecondsAttribute,
    existingMaterialSpliceTimes: {
        type: [timeSchema]
    },
    materialWrapUps: {
        type: [timeAndFeetLostAndFramesAddedSchema]
    },
    webBreaks: {
        type: [timeAndFeetLostAndFramesAddedSchema]
    },
    newInkBuildTimes: {
        type: [timeSchema]
    },
    imagePlacementTimes: {
        type: [timeSchema]
    },
    colorSeperations: {
        type: [valueSchema]
    },
    trailingEdges: {
        type: [valueSchema]
    },
    leadingEdges: {
        type: [valueSchema]
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
    productIdToNumberOfFinishedRolls: { // TODO (8-29-2023): Gavin, should this be a Map? Or an array?
        type: Map,
        of: Number,
    },
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
    productIdToFinishedLabelQty: {
        type: Map,
        of: Number,
    },
    packagingJobComments: {
        type: String
    }
}, { timestamps: true });

schema.pre('save', generateUniqueTicketNumber);

const Ticket = mongoose.model('NewTicket', schema); // TODO (8-21-2023): Gavin rename this to "Ticket" after deprecating the old Ticket.js model

module.exports = Ticket;
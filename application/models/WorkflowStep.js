const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const destinationSchema = require('../models/destination').schema;

const workflowStepSchema = new Schema({
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    destination: {
        type: destinationSchema,
        required: true
    }
}, { timestamps: true });

const WorkflowStep = mongoose.model('WorkflowStep', workflowStepSchema);

module.exports = WorkflowStep;
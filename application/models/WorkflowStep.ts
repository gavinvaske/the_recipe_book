import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import destinationSchema from '../schemas/destination';

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

export default WorkflowStep;
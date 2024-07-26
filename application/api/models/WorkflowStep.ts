import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { destinationSchema } from '../schemas/destination.ts';

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

export const WorkflowStepModel = mongoose.model('WorkflowStep', workflowStepSchema);

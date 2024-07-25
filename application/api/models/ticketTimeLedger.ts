import { TIMER_TYPES } from '../enums/timerTypesEnum.ts';
import { TIMER_STATES } from '../enums/timerStatesEnum.ts';
import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

import mongooseDelete from 'mongoose-delete';
mongoose.plugin(mongooseDelete, { overrideMethods: true });

const ticketTimeLedgerSchema = new Schema({
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
        index: true
    },
    timerType: {
        type: String,
        enum: TIMER_TYPES,
        required: true,
        uppercase: true
    },
    state: {
        type: String,
        enum: TIMER_STATES,
        required: true,
        uppercase: true
    }
}, { timestamps: true });

export const TicketTimeLedgerModel = mongoose.model('TicketTimeLedger', ticketTimeLedgerSchema);

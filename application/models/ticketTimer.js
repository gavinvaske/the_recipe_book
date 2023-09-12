const { TIMER_TYPES } = require('../enums/timerTypesEnum');
const { TIMER_STATES } = require('../enums/timerStatesEnum');
const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

mongoose.plugin(require('mongoose-delete'), { overrideMethods: true });

const downtimeLedgerSchema = new Schema({
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

const DowntimeLedger = mongoose.model('downtimeLedger', downtimeLedgerSchema);

module.exports = DowntimeLedger;
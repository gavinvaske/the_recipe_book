import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const downtimeLedgerSchema = new Schema({
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    delayDurationInMinutes: {
        type: Number,
        required: true,
        min: 1,

    }
}, { timestamps: true });

const DowntimeLedger = mongoose.model('downtimeLedger', downtimeLedgerSchema);

module.exports = DowntimeLedger;
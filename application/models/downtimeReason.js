const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const downtimeReasonSchema = new Schema({
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    reason: {
        type: String,
        required: true
    }
}, { timestamps: true });

const DowntimeReason = mongoose.model('downtimeReason', downtimeReasonSchema);

module.exports = DowntimeReason;
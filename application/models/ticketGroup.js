const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ZERO = 0;

function isArrayLengthGreaterThanZero(items) {
    return items && items.length > ZERO;
}

const ticketGroupSchema = new Schema({
    ticketIdsInGroup: {
        type: [Schema.Types.ObjectId],
        ref: 'Ticket',
        default: undefined,
        required: true,
        validate: [isArrayLengthGreaterThanZero, '"{PATH}" cannot be an empty array']
    }
});

const TicketGroup = mongoose.model('TicketGroup', ticketGroupSchema);

module.exports = TicketGroup;
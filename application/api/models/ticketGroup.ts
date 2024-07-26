import mongoose from 'mongoose';
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

export const TicketGroupModel = mongoose.model('TicketGroup', ticketGroupSchema);

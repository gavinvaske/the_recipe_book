const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {getAllSubDepartments, getAllDepartments} = require('../enums/departmentsEnum');

const ticketStatusRecordSchema = new Schema({
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: getAllDepartments()
    },
    status: {
        type: String,
        required: true,
        enum: getAllSubDepartments()
    }
}, { timestamps: true });

const TicketStatusHistory = mongoose.model('TicketStatusRecord', ticketStatusRecordSchema);

module.exports = TicketStatusHistory;
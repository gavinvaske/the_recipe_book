import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const destinationSchema = new Schema({
    department: {
        type: String,
        required: true
    },
    departmentStatus: {
        type: String,
        required: false
    },
    assignee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    machine: {
        type: Schema.Types.ObjectId,
        ref: 'Machine',
        required: false
    }
}, { timestamps: true });

export default destinationSchema;
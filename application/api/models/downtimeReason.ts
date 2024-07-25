import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const downtimeReasonSchema = new Schema({
    reason: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const DowntimeReasonModel = mongoose.model('downtimeReason', downtimeReasonSchema);

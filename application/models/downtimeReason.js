import mongoose from 'mongoose'
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const downtimeReasonSchema = new Schema({
    reason: {
        type: String,
        required: true
    }
}, { timestamps: true });

const DowntimeReason = mongoose.model('downtimeReason', downtimeReasonSchema);

export default DowntimeReason;
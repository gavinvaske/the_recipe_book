import mongoose from 'mongoose'
const Schema = mongoose.Schema;
mongoose.Schema.Types.String.set('trim', true);
import mongooseDelete from 'mongoose-delete'
mongoose.plugin(mongooseDelete, { overrideMethods: true });

const schema = new Schema({
    incidentName: {
        type: String,
        uppercase: true,
        required: true,
        unique: true
    },
}, { timestamps: true });

const MaintenanceIncidentType = mongoose.model('MaintenanceIncidentType', schema);

module.exports = MaintenanceIncidentType;
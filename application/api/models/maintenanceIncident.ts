import mongoose from 'mongoose';
const Schema = mongoose.Schema;
mongoose.Schema.Types.String.set('trim', true);
import mongooseDelete from 'mongoose-delete';
mongoose.plugin(mongooseDelete, { overrideMethods: true });
import { MaintenanceIncidentTypeModel } from './maintenanceIncidentType.ts';

const schema = new Schema({
    incidentName: {
        type: String,
        required: true,
        uppercase: true,
    },
    timeToComplete: {
        type: Number,
        required: true,
        min: 0
    },
    notes: {
        type: String,
        required: false
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

schema.pre('save', async function (next) {
    const isValidIncidentName = await MaintenanceIncidentTypeModel.findOne({ incidentName: this.incidentName }).exec();

    if (!isValidIncidentName) next(`Error: The incidentName "${this.incidentName}" must first be created in the ADMIN panel.`);
    next();
});

export const MaintenanceIncidentModel = mongoose.model('MaintenanceIncident', schema);

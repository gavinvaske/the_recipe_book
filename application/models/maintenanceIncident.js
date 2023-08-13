const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Schema.Types.String.set('trim', true);
mongoose.plugin(require('mongoose-delete'), { overrideMethods: true });

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

const MaintenanceIncident = mongoose.model('MaintenanceIncident', schema);

module.exports = MaintenanceIncident;

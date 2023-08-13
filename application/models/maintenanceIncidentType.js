const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Schema.Types.String.set('trim', true);
mongoose.plugin(require('mongoose-delete'), { overrideMethods: true });

const schema = new Schema({
    incidentName: {
        type: String,
        uppercase: true,
        required: true
    },
}, { timestamps: true });

const MaintenanceIncidentType = mongoose.model('MaintenanceIncidentType', schema);

module.exports = MaintenanceIncidentType;
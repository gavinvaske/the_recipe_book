import mongoose from 'mongoose'
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const {getAllDepartments} = require('../enums/departmentsEnum');
const mongoose_delete = require('mongoose-delete');

function isDepartmentValid(department) {
    if (!getAllDepartments().includes(department)) {
        return false;
    }

    return true;
}

const HoldReasonSchema = new Schema({
    department: {
        type: String,
        validate: [isDepartmentValid, 'The department "{VALUE}" is not a valid department.'],
        required: true
    },
    reason: {
        type: String,
        uppercase: true,
        required: true
    }
}, { timestamps: true });

HoldReasonSchema.plugin(mongoose_delete, {overrideMethods: true});

const HoldReason = mongoose.model('HoldReason', HoldReasonSchema);

module.exports = HoldReason; 
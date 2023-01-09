const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const {getAllDepartments} = require('../enums/departmentsEnum');

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

const HoldStatus = mongoose.model('HoldStatus', HoldReasonSchema);

module.exports = HoldStatus; 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {departmentStatusesGroupedByDepartment, getAllDepartments} = require('../enums/departmentsEnum');

function isDepartmentAndDepartmentStatusCombinationValid() {
    const lengthOfEmptyArray = 0;
    const allowedStatuses = departmentStatusesGroupedByDepartment[this.department];
    const noDepartmentStatusesExistForThisDepartment = allowedStatuses.length === lengthOfEmptyArray;

    if (noDepartmentStatusesExistForThisDepartment) {
        return true;
    }

    return allowedStatuses.includes(this.departmentStatus);
}

function isDepartmentValid(department) {
    if (!getAllDepartments().includes(department)) {
        return false;
    }

    return true;
}

const workflowStepSchema = new Schema({
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    department: {
        type: String,
        required: true,
        validate: [
            {
                validator: isDepartmentValid,
                message: 'The department "{VALUE}" is not a valid department'
            },
            {
                validator: isDepartmentAndDepartmentStatusCombinationValid,
                message: 'The department "{VALUE}" is not allowed to be paired with the provided departmentStatus'
            }
        ]
    },
    departmentStatus: {
        type: String,
        required: false,
        validate: [isDepartmentAndDepartmentStatusCombinationValid, 'The departmentStatus "{VALUE}" is not allowed to be paired with the provided department']
    },
    assignees: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    machines: {
        type: [Schema.Types.ObjectId],
        ref: 'Machine',
    },
}, { timestamps: true });

const WorkflowStep = mongoose.model('WorkflowStep', workflowStepSchema);

module.exports = WorkflowStep;
const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const {getAllDepartments, departmentStatusesGroupedByDepartment} = require('../enums/departmentsEnum');

function isDepartmentAndDepartmentStatusCombinationValid() {
    const lengthOfEmptyArray = 0;
    const allowedStatuses = departmentStatusesGroupedByDepartment[this.department];
    const noDepartmentStatusesExistForThisDepartment = allowedStatuses.length === lengthOfEmptyArray;

    if (noDepartmentStatusesExistForThisDepartment && !this.departmentStatus) {
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

const destinationSchema = new Schema({
    department: {
        type: String,
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
        validate: [isDepartmentAndDepartmentStatusCombinationValid, 'The departmentStatus "{VALUE}" is not allowed to be paired with the provided department']
    },
    assignees: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    machines: {
        type: [Schema.Types.ObjectId],
        ref: 'Machine'
    }
}, { timestamps: true });

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;
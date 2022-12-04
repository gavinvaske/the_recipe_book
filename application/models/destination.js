const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const {getAllDepartments, departmentToStatusesMappingForTicketObjects} = require('../enums/departmentsEnum');

function isDepartmentAndDepartmentStatusCombinationValid(department, departmentStatus) {
    const lengthOfEmptyArray = 0;
    
    if (!isDepartmentValid(department)) {
        return false;
    }

    const allowedStatuses = departmentToStatusesMappingForTicketObjects[department];
    const noDepartmentStatusesExistForThisDepartment = allowedStatuses.length === lengthOfEmptyArray;

    if (noDepartmentStatusesExistForThisDepartment && !departmentStatus) {
        return true;
    }

    return allowedStatuses.includes(departmentStatus);
}

function isDepartmentValid(department) {
    if (!getAllDepartments().includes(department)) {
        return false;
    }

    return true;
}

const destinationSchema = new Schema({
    department: {
        type: String
    },
    departmentStatus: {
        type: String
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

destinationSchema.pre('validate', function(next) {
    if (!isDepartmentAndDepartmentStatusCombinationValid(this.department, this.departmentStatus)) {
        return next(new Error(`The departmentStatus "${this.departmentStatus}" is not allowed to be paired with the provided department "${this.department}"`));
    }

    return next();
});

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;
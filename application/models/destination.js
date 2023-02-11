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
    assignee: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    machine: {
        type: Schema.Types.ObjectId,
        ref: 'Machine'
    }
}, { timestamps: true });

destinationSchema.pre('validate', function(next) {
    if (!isDepartmentAndDepartmentStatusCombinationValid(this.department, this.departmentStatus)) {
        const errorMessage = `The department "${this.department}" and departmentStatus "${this.departmentStatus}" are not allowed to be paired together.`
        return next(new Error(errorMessage));
    }

    return next();
});

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;
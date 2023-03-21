const departmentsEnum = require('../enums/departmentsEnum');

module.exports.getDepartments = () => {
    return Object.keys(departmentsEnum.departmentToDepartmentStatusesForDieLineRequests);
};

module.exports.getStartingDepartment = () => {
    const firstDepartment = Object.keys(departmentsEnum.departmentToDepartmentStatusesForDieLineRequests)[0];

    return firstDepartment;
};

module.exports.getDepartmentStatusesForDepartment = (department) => {
    return departmentsEnum.departmentToDepartmentStatusesForDieLineRequests[department];
};
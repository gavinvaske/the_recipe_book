import * as departmentsEnum from '../enums/departmentsEnum.js';

module.exports.getDepartments = () => {
    return Object.keys(departmentsEnum.departmentToDepartmentStatusesForSpotPlateRequests);
};

module.exports.getStartingDepartment = () => {
    const firstDepartment = Object.keys(departmentsEnum.departmentToDepartmentStatusesForSpotPlateRequests)[0];

    return firstDepartment;
};

module.exports.getDepartmentStatusesForDepartment = (department) => {
    return departmentsEnum.departmentToDepartmentStatusesForSpotPlateRequests[department];
};
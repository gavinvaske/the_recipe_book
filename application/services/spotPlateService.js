import * as departmentsEnum from '../enums/departmentsEnum.js';

export function getDepartments() {
    return Object.keys(departmentsEnum.departmentToDepartmentStatusesForSpotPlateRequests);
}

export function getStartingDepartment() {
    const firstDepartment = Object.keys(departmentsEnum.departmentToDepartmentStatusesForSpotPlateRequests)[0];

    return firstDepartment;
}

export function getDepartmentStatusesForDepartment(department) {
    return departmentsEnum.departmentToDepartmentStatusesForSpotPlateRequests[department];
}
import * as departmentsEnum from '../enums/departmentsEnum.ts';

export function getDepartments() {
    return Object.keys(departmentsEnum.departmentToDepartmentStatusesForDieLineRequests);
}

export function getStartingDepartment() {
    const firstDepartment = Object.keys(departmentsEnum.departmentToDepartmentStatusesForDieLineRequests)[0];

    return firstDepartment;
}

export function getDepartmentStatusesForDepartment(department) {
    return departmentsEnum.departmentToDepartmentStatusesForDieLineRequests[department];
}
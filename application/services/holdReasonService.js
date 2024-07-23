import HoldReasonModel from '../models/holdReason';
import { getAllDepartmentsWithDepartmentStatuses } from '../enums/departmentsEnum';

export async function getDepartmentToHoldReasons() {
    const allHoldReasons = await HoldReasonModel.find().exec();
    const departments = getAllDepartmentsWithDepartmentStatuses();
    const departmentToHoldReasons = {};

    departments.forEach((department) => {
        departmentToHoldReasons[department] = [];
    });

    allHoldReasons.forEach((holdReason) => {
        departmentToHoldReasons[holdReason.department].push(holdReason);
    });

    return departmentToHoldReasons;
}
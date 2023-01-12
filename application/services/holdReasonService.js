const HoldReasonModel = require('../models/holdReason');
const {getAllDepartmentsWithDepartmentStatuses} = require('../enums/departmentsEnum');

module.exports.getDepartmentToHoldReasons = async () => {
    const allHoldReasons = await HoldReasonModel.find().exec();
    const departments = getAllDepartmentsWithDepartmentStatuses();
    const departmentToHoldReasons = {};

    departments.forEach((department) => {
        departmentToHoldReasons[department] = [];
    });

    allHoldReasons.forEach((holdReason) => {
        const {department, reason} = holdReason;
        departmentToHoldReasons[department].push(reason);
    });

    return departmentToHoldReasons;
}
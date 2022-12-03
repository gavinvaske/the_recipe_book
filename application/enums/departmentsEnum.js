// departmentStatuses
const NEEDS_ATTENTION = 'NEEDS ATTENTION';
const SEND_TO_CUSTOMER = 'SEND TO CUSTOMER';
const WAITING_ON_APPROVAL = 'WAITING ON APPROVAL';
const WAITING_ON_CUSTOMER = 'WAITING ON CUSTOMER';
const READY_TO_ORDER_PLATE_OR_DIE = 'READY TO ORDER PLATE OR DIE';
const IN_PROGRESS = 'IN PROGRESS';

const SETUP = 'SET-UP';
const RUNTIME = 'RUNTIME';
const TEAR_DOWN = 'TEAR-DOWN';

const NEEDS_DIE_LINE = 'NEEDS DIE LINE';
const NEEDS_PLATE = 'NEEDS PLATE';
const SEND_TO_PRESS = 'SEND TO PRESS';
const READY_FOR_SCHEDULING = 'READY FOR SCHEDULING';
const SCHEDULE_PRESS_ONE = 'SCHEDULE PRESS ONE';
const SCHEDULE_PRESS_TWO = 'SCHEDULE PRESS TWO';
const SCHEDULE_PRESS_THREE = 'SCHEDULE PRESS THREE';
const NEEDS_PROOF = 'NEEDS PROOF';
const ON_HOLD = 'ON HOLD';
const SCHEDULE_DELTA_ONE = 'SCHEDULE DELTA ONE';
const SCHEDULE_DELTA_TWO = 'SCHEDULE DELTA TWO';
const SCHEDULE_ROTOFLEX = 'SCHEDULE ROTOFLEX';
const READY_FOR_SHIPPING = 'READY FOR SHIPPING';
const TOOL_ARRIVALS = 'TOOL ARRIVALS';
const READY_FOR_BILLING = 'READY FOR BILLING';

const PACKAGING_READY = 'PACKAGING READY';

// departments
const ORDER_PREP_DEPARTMENT = 'ORDER-PREP';
const ART_PREP_DEPARTMENT = 'ART-PREP';
const PRE_PRINTING_DEPARTMENT = 'PRE-PRINTING';
const PRINTING_DEPARTMENT = 'PRINTING';
const CUTTING_DEPARTMENT = 'CUTTING';
const WINDING_DEPARTMENT = 'WINDING';
const PACKAGING_DEPARTMENT = 'PACKAGING';
const SHIPPING_DEPARTMENT = 'SHIPPING';
const BILLING_DEPARTMENT = 'BILLING';
const COMPLETE_DEPARTMENT = 'COMPLETED';

module.exports.departmentStatusesGroupedByDepartment = {
    [ORDER_PREP_DEPARTMENT]: [
        NEEDS_ATTENTION,
        SEND_TO_CUSTOMER,
        WAITING_ON_APPROVAL,
        WAITING_ON_CUSTOMER,
        READY_TO_ORDER_PLATE_OR_DIE,
        IN_PROGRESS
    ],
    [ART_PREP_DEPARTMENT]: [
        NEEDS_ATTENTION,
        IN_PROGRESS,
        NEEDS_PROOF,
        NEEDS_DIE_LINE,
        NEEDS_PLATE
    ],
    [PRE_PRINTING_DEPARTMENT]: [
        NEEDS_ATTENTION,
        IN_PROGRESS,
        SEND_TO_PRESS
    ],
    [PRINTING_DEPARTMENT]: [
        SETUP,
        RUNTIME,
        TEAR_DOWN,
        READY_FOR_SCHEDULING,
        SCHEDULE_PRESS_ONE,
        SCHEDULE_PRESS_TWO,
        SCHEDULE_PRESS_THREE,
        ON_HOLD
    ],
    [CUTTING_DEPARTMENT]: [
        SETUP,
        RUNTIME,
        TEAR_DOWN,
        READY_FOR_SCHEDULING,
        SCHEDULE_DELTA_ONE,
        SCHEDULE_DELTA_TWO,
        SCHEDULE_ROTOFLEX,
        ON_HOLD
    ],
    [WINDING_DEPARTMENT]: [
        IN_PROGRESS,
        READY_FOR_SCHEDULING,
        ON_HOLD
    ],
    [PACKAGING_DEPARTMENT]: [
        ON_HOLD,
        IN_PROGRESS,
        PACKAGING_READY
    ],
    [SHIPPING_DEPARTMENT]: [
        IN_PROGRESS,
        READY_FOR_SHIPPING,
        ON_HOLD,
        TOOL_ARRIVALS
    ],
    [BILLING_DEPARTMENT]: [
        READY_FOR_BILLING,
        IN_PROGRESS
    ],
    [COMPLETE_DEPARTMENT]: []
};

module.exports.productionDepartmentsAndDepartmentStatuses = {
    [PRE_PRINTING_DEPARTMENT]: [
        SEND_TO_PRESS
    ],
    [PRINTING_DEPARTMENT]: [
        SETUP,
        RUNTIME,
        TEAR_DOWN,
        READY_FOR_SCHEDULING,
        SCHEDULE_PRESS_ONE,
        SCHEDULE_PRESS_TWO,
        SCHEDULE_PRESS_THREE,
        ON_HOLD
    ],
    [CUTTING_DEPARTMENT]: [
        SETUP,
        RUNTIME,
        TEAR_DOWN,
        READY_FOR_SCHEDULING,
        SCHEDULE_DELTA_ONE,
        SCHEDULE_DELTA_TWO,
        SCHEDULE_ROTOFLEX,
        ON_HOLD
    ],
    [WINDING_DEPARTMENT]: [
        IN_PROGRESS,
        READY_FOR_SCHEDULING,
        ON_HOLD
    ],
    [SHIPPING_DEPARTMENT]: [
        IN_PROGRESS,
        READY_FOR_SHIPPING,
        ON_HOLD,
        TOOL_ARRIVALS
    ]
};

module.exports.COMPLETE_DEPARTMENT = COMPLETE_DEPARTMENT;

module.exports.getAllDepartmentStatuses = () => {
    let allDepartmentStatuses = [];

    Object.values(this.departmentStatusesGroupedByDepartment).forEach((departmentStatusesForOneDepartment) => {
        allDepartmentStatuses.push(...departmentStatusesForOneDepartment);
    });

    return allDepartmentStatuses;
};

module.exports.getAllDepartments = () => {
    return Object.keys(this.departmentStatusesGroupedByDepartment);
};

module.exports.getAllDepartmentsWithDepartmentStatuses = () => {
    let departmentsWithAtLeastOneDepartmentStatus = [];
    let allDepartments = this.getAllDepartments();

    allDepartments.forEach((department) => {
        const containsAtLeastOneDepartmentStatus = this.departmentStatusesGroupedByDepartment[department].length > 0; // eslint-disable-line no-magic-numbers

        if (containsAtLeastOneDepartmentStatus) {
            departmentsWithAtLeastOneDepartmentStatus.push(department);
        }
    });

    return departmentsWithAtLeastOneDepartmentStatus;
};
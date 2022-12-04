// departmentStatuses
const NEEDS_ATTENTION = 'NEEDS ATTENTION';
const WAITING_ON_APPROVAL = 'WAITING ON APPROVAL';
const WAITING_ON_CUSTOMER = 'WAITING ON CUSTOMER';
const IN_PROGRESS = 'IN PROGRESS';
const DIE_OR_PLATE_READY = 'DIE OR PLATE READY'; // eslint-disable-line no-unused-vars
const PROOFING_COMPLETE = 'PROOFING COMPLETE';
const PRINTING_READY = 'PRINTING READY';
const PRINTER_ONE_SCHEDULE = 'PRINTER ONE SCHEDULE';
const PRINTER_TWO_SCHEDULE = 'PRINTER TWO SCHEDULE';

const NEEDS_DIE_LINE = 'NEEDS DIE LINE'; // eslint-disable-line no-unused-vars
const NEEDS_PLATE = 'NEEDS PLATE'; // eslint-disable-line no-unused-vars
const SEND_TO_PRINTING = 'SEND TO PRINTING';
const NEEDS_PROOF = 'NEEDS PROOF';
const ON_HOLD = 'ON HOLD';
const PACKAGING_READY = 'PACKAGING READY';

const CUTTING_READY = 'CUTTING_READY';
const DELTA_ONE_SCHEDULE = 'DELTA ONE SCHEDULE';
const DELTA_TWO_SCHEDULE = 'DELTA TWO SCHEDULE';
const ROTOFLEX_ONE_SCHEDULE = 'ROTOFLEX ONE SCHEDULE';
const WINDING_READY = 'WINDING READY';
const FARMED_OUT_TICKETS = 'FARMED OUT TICKETS';
const BILLING_READY = 'BILLING READY';
const SHIPPING_READY = 'SHIPPING READY';

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

module.exports.departmentToStatusesMappingForTicketObjects = {
    [ORDER_PREP_DEPARTMENT]: [
        NEEDS_ATTENTION,
        ON_HOLD,
        PROOFING_COMPLETE,
        WAITING_ON_CUSTOMER,
        WAITING_ON_APPROVAL
    ],
    [ART_PREP_DEPARTMENT]: [
        NEEDS_ATTENTION,
        ON_HOLD,
        IN_PROGRESS,
        NEEDS_PROOF
    ],
    [PRE_PRINTING_DEPARTMENT]: [
        NEEDS_ATTENTION,
        ON_HOLD,
        IN_PROGRESS,
        SEND_TO_PRINTING
    ],
    [PRINTING_DEPARTMENT]: [
        ON_HOLD,
        IN_PROGRESS,
        PRINTING_READY,
        PRINTER_ONE_SCHEDULE,
        PRINTER_TWO_SCHEDULE
    ],
    [CUTTING_DEPARTMENT]: [
        ON_HOLD,
        IN_PROGRESS,
        CUTTING_READY,
        DELTA_ONE_SCHEDULE,
        DELTA_TWO_SCHEDULE,
        ROTOFLEX_ONE_SCHEDULE
    ],
    [WINDING_DEPARTMENT]: [
        ON_HOLD,
        IN_PROGRESS,
        WINDING_READY
    ],
    [PACKAGING_DEPARTMENT]: [
        ON_HOLD,
        IN_PROGRESS,
        PACKAGING_READY
    ],
    [SHIPPING_DEPARTMENT]: [
        ON_HOLD,
        IN_PROGRESS,
        SHIPPING_READY,
        FARMED_OUT_TICKETS
    ],
    [BILLING_DEPARTMENT]: [
        ON_HOLD,
        IN_PROGRESS,
        BILLING_READY
    ],
    [COMPLETE_DEPARTMENT]: []
};

module.exports.productionDepartmentsAndDepartmentStatuses = {
    PRE_PRINTING_DEPARTMENT: this.departmentToStatusesMappingForTicketObjects[PRE_PRINTING_DEPARTMENT],
    PRINTING_DEPARTMENT: this.departmentToStatusesMappingForTicketObjects[PRINTING_DEPARTMENT],
    CUTTING_DEPARTMENT: this.departmentToStatusesMappingForTicketObjects[CUTTING_DEPARTMENT],
    WINDING_DEPARTMENT: this.departmentToStatusesMappingForTicketObjects[WINDING_DEPARTMENT],
    PACKAGING_DEPARTMENT: this.departmentToStatusesMappingForTicketObjects[PACKAGING_DEPARTMENT]
};

module.exports.COMPLETE_DEPARTMENT = COMPLETE_DEPARTMENT;

module.exports.getAllDepartments = () => {
    return Object.keys(this.departmentToStatusesMappingForTicketObjects);
};

module.exports.getAllDepartmentsWithDepartmentStatuses = () => {
    let departmentsWithAtLeastOneDepartmentStatus = [];
    let allDepartments = this.getAllDepartments();

    allDepartments.forEach((department) => {
        const containsAtLeastOneDepartmentStatus = this.departmentToStatusesMappingForTicketObjects[department].length > 0; // eslint-disable-line no-magic-numbers

        if (containsAtLeastOneDepartmentStatus) {
            departmentsWithAtLeastOneDepartmentStatus.push(department);
        }
    });

    return departmentsWithAtLeastOneDepartmentStatus;
};

module.exports.isInProgressDepartmentStatus = (departmentStatus) => {
    return departmentStatus === IN_PROGRESS;
};
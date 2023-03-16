// departmentStatuses
const NEEDS_ATTENTION = 'NEEDS ATTENTION';
const WAITING_ON_APPROVAL = 'WAITING ON APPROVAL';
const WAITING_ON_CUSTOMER = 'WAITING ON CUSTOMER';
const IN_PROGRESS = 'IN PROGRESS';
const PROOFING_COMPLETE = 'PROOFING COMPLETE';
const PRINTING_READY = 'PRINTING READY';
const PRINTER_ONE_SCHEDULE = 'PRINTER ONE SCHEDULE';
const PRINTER_TWO_SCHEDULE = 'PRINTER TWO SCHEDULE';

const SEND_TO_PRINTING = 'SEND TO PRINTING';
const NEEDS_PROOF = 'NEEDS PROOF';
const ON_HOLD = 'ON HOLD';
const PACKAGING_READY = 'PACKAGING READY';

const CUTTING_READY = 'CUTTING READY';
const DELTA_ONE_SCHEDULE = 'DELTA ONE SCHEDULE';
const DELTA_TWO_SCHEDULE = 'DELTA TWO SCHEDULE';
const ROTOFLEX_ONE_SCHEDULE = 'ROTOFLEX ONE SCHEDULE';
const WINDING_READY = 'WINDING READY';
const FARMED_OUT_TICKETS = 'FARMED OUT TICKETS';
const BILLING_READY = 'BILLING READY';
const SHIPPING_READY = 'SHIPPING READY';

// departments
module.exports.ORDER_PREP_DEPARTMENT = 'ORDER-PREP';
module.exports.ART_PREP_DEPARTMENT = 'ART-PREP';
module.exports.PRE_PRINTING_DEPARTMENT = 'PRE-PRINTING';
module.exports.PRINTING_DEPARTMENT = 'PRINTING';
module.exports.CUTTING_DEPARTMENT = 'CUTTING';
module.exports.WINDING_DEPARTMENT = 'WINDING';
module.exports.PACKAGING_DEPARTMENT = 'PACKAGING';
module.exports.SHIPPING_DEPARTMENT = 'SHIPPING';
module.exports.BILLING_DEPARTMENT = 'BILLING';
module.exports.COMPLETE_DEPARTMENT = 'COMPLETED';

module.exports.departmentToStatusesMappingForTicketObjects = {
    [this.ORDER_PREP_DEPARTMENT]: [
        NEEDS_ATTENTION,
        ON_HOLD,
        PROOFING_COMPLETE,
        WAITING_ON_CUSTOMER,
        WAITING_ON_APPROVAL
    ],
    [this.ART_PREP_DEPARTMENT]: [
        NEEDS_ATTENTION,
        ON_HOLD,
        IN_PROGRESS,
        NEEDS_PROOF
    ],
    [this.PRE_PRINTING_DEPARTMENT]: [
        NEEDS_ATTENTION,
        ON_HOLD,
        IN_PROGRESS,
        SEND_TO_PRINTING
    ],
    [this.PRINTING_DEPARTMENT]: [
        ON_HOLD,
        IN_PROGRESS,
        PRINTING_READY,
        PRINTER_ONE_SCHEDULE,
        PRINTER_TWO_SCHEDULE
    ],
    [this.CUTTING_DEPARTMENT]: [
        ON_HOLD,
        IN_PROGRESS,
        CUTTING_READY,
        DELTA_ONE_SCHEDULE,
        DELTA_TWO_SCHEDULE,
        ROTOFLEX_ONE_SCHEDULE
    ],
    [this.WINDING_DEPARTMENT]: [
        ON_HOLD,
        IN_PROGRESS,
        WINDING_READY
    ],
    [this.PACKAGING_DEPARTMENT]: [
        ON_HOLD,
        IN_PROGRESS,
        PACKAGING_READY
    ],
    [this.SHIPPING_DEPARTMENT]: [
        ON_HOLD,
        IN_PROGRESS,
        SHIPPING_READY,
        FARMED_OUT_TICKETS
    ],
    [this.BILLING_DEPARTMENT]: [
        ON_HOLD,
        IN_PROGRESS,
        BILLING_READY
    ],
    [this.COMPLETE_DEPARTMENT]: []
};

module.exports.removeDepartmentStatusesAUserIsNotAllowedToSelect = (departmentStatuses) => {
    return departmentStatuses.filter((departmentStatus) => {
        const isAllowed = departmentStatus !== IN_PROGRESS;
        return isAllowed;
    });
};

module.exports.productionDepartmentsAndDepartmentStatuses = {
    [this.PRE_PRINTING_DEPARTMENT]: this.departmentToStatusesMappingForTicketObjects[this.PRE_PRINTING_DEPARTMENT],
    [this.PRINTING_DEPARTMENT]: this.departmentToStatusesMappingForTicketObjects[this.PRINTING_DEPARTMENT],
    [this.CUTTING_DEPARTMENT]: this.departmentToStatusesMappingForTicketObjects[this.CUTTING_DEPARTMENT],
    [this.WINDING_DEPARTMENT]: this.departmentToStatusesMappingForTicketObjects[this.WINDING_DEPARTMENT],
    [this.PACKAGING_DEPARTMENT]: this.departmentToStatusesMappingForTicketObjects[this.PACKAGING_DEPARTMENT]
};

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
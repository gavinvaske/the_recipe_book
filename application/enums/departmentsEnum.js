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

const REQUEST_COMPLETE = 'REQUEST COMPLETE';
const NEEDS_DIE_LINE = 'NEEDS DIE LINE';
const NEEDS_PLATE = 'NEEDS PLATE';

export const ORDER_PREP_DEPARTMENT = 'ORDER-PREP';
export const ART_PREP_DEPARTMENT = 'ART-PREP';
export const PRE_PRINTING_DEPARTMENT = 'PRE-PRINTING';
export const PRINTING_DEPARTMENT = 'PRINTING';
export const CUTTING_DEPARTMENT = 'CUTTING';
export const WINDING_DEPARTMENT = 'WINDING';
export const PACKAGING_DEPARTMENT = 'PACKAGING';
export const SHIPPING_DEPARTMENT = 'SHIPPING';
export const BILLING_DEPARTMENT = 'BILLING';
export const COMPLETE_DEPARTMENT = 'COMPLETED';

export const departmentToDepartmentStatusesForDieLineRequests = {
    [ORDER_PREP_DEPARTMENT]: [
        NEEDS_ATTENTION,
        ON_HOLD,
        WAITING_ON_CUSTOMER,
        REQUEST_COMPLETE,
        WAITING_ON_APPROVAL
    ],
    [ART_PREP_DEPARTMENT]: [
        NEEDS_ATTENTION,
        ON_HOLD,
        IN_PROGRESS,
        NEEDS_DIE_LINE
    ],
    [COMPLETE_DEPARTMENT]: []
};

export const departmentToDepartmentStatusesForSpotPlateRequests = {
    [ORDER_PREP_DEPARTMENT]: [
        NEEDS_ATTENTION,
        ON_HOLD,
        WAITING_ON_CUSTOMER,
        REQUEST_COMPLETE,
        WAITING_ON_APPROVAL
    ],
    [ART_PREP_DEPARTMENT]: [
        NEEDS_ATTENTION,
        ON_HOLD,
        IN_PROGRESS,
        NEEDS_PLATE
    ],
    [COMPLETE_DEPARTMENT]: []
};

export const departmentToStatusesMappingForTicketObjects = {
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

export const departmentToNextDepartmentAndStatus = {
    [ART_PREP_DEPARTMENT]: [PRE_PRINTING_DEPARTMENT, SEND_TO_PRINTING],
    [PRE_PRINTING_DEPARTMENT]: [PRINTING_DEPARTMENT, PRINTING_READY],
    [PRINTING_DEPARTMENT]: [CUTTING_DEPARTMENT, CUTTING_READY],
    [CUTTING_DEPARTMENT]: [WINDING_DEPARTMENT, WINDING_READY],
    [WINDING_DEPARTMENT]: [PACKAGING_DEPARTMENT, PACKAGING_READY],
    [PACKAGING_DEPARTMENT]: [SHIPPING_DEPARTMENT, SHIPPING_READY],
    [SHIPPING_DEPARTMENT]: [BILLING_DEPARTMENT, BILLING_READY],
    [BILLING_DEPARTMENT]: [COMPLETE_DEPARTMENT]
};

export function removeDepartmentStatusesAUserIsNotAllowedToSelect(departmentStatuses) {
    return departmentStatuses.filter((departmentStatus) => {
        const isAllowed = departmentStatus !== IN_PROGRESS;
        return isAllowed;
    });
}

export const productionDepartmentsAndDepartmentStatuses = {
    [PRE_PRINTING_DEPARTMENT]: departmentToStatusesMappingForTicketObjects[PRE_PRINTING_DEPARTMENT],
    [PRINTING_DEPARTMENT]: departmentToStatusesMappingForTicketObjects[PRINTING_DEPARTMENT],
    [CUTTING_DEPARTMENT]: departmentToStatusesMappingForTicketObjects[CUTTING_DEPARTMENT],
    [WINDING_DEPARTMENT]: departmentToStatusesMappingForTicketObjects[WINDING_DEPARTMENT],
    [PACKAGING_DEPARTMENT]: departmentToStatusesMappingForTicketObjects[PACKAGING_DEPARTMENT]
};

export function getAllDepartments() {
    return Object.keys(departmentToStatusesMappingForTicketObjects);
}

export function getAllDepartmentsWithDepartmentStatuses() {
    let departmentsWithAtLeastOneDepartmentStatus = [];
    let allDepartments = getAllDepartments();

    allDepartments.forEach((department) => {
        const containsAtLeastOneDepartmentStatus = departmentToStatusesMappingForTicketObjects[department].length > 0; // eslint-disable-line no-magic-numbers

        if (containsAtLeastOneDepartmentStatus) {
            departmentsWithAtLeastOneDepartmentStatus.push(department);
        }
    });

    return departmentsWithAtLeastOneDepartmentStatus;
}

export function isInProgressDepartmentStatus(departmentStatus) {
    return departmentStatus === IN_PROGRESS;
}
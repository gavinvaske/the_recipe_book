const workflowStepService = require('./workflowStepService');
const dateTimeService = require('./dateTimeService');
const {getAllDepartmentsWithDepartmentStatuses} = require('../enums/departmentsEnum');

const helperMethods = {
    getDepartmentsWithAtLeastOneStatus: getAllDepartmentsWithDepartmentStatuses,
    prettifyDuration: dateTimeService.prettifyDuration,
    getSimpleDate: dateTimeService.getSimpleDate,
    getOverallTicketDuration: workflowStepService.getOverallTicketDuration,
    getHowLongTicketHasBeenInProduction: workflowStepService.getHowLongTicketHasBeenInProduction,
    getHowLongTicketHasBeenInDepartment: workflowStepService.getHowLongTicketHasBeenInDepartment,
    getHowLongTicketHasHadADepartmentStatus: workflowStepService.getHowLongTicketHasHadADepartmentStatus
};

module.exports = helperMethods;
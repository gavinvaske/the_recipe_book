const workflowStepService = require('./workflowStepService');
const dateTimeService = require('./dateTimeService');

const helperMethods = {
    prettifyDuration: dateTimeService.prettifyDuration,
    getSimpleDate: dateTimeService.getSimpleDate,
    getOverallTicketDuration: workflowStepService.getOverallTicketDuration,
    getHowLongTicketHasBeenInProduction: workflowStepService.getHowLongTicketHasBeenInProduction,
    getHowLongTicketHasBeenInDepartment: workflowStepService.getHowLongTicketHasBeenInDepartment,
    getHowLongTicketHasHadADepartmentStatus: workflowStepService.getHowLongTicketHasHadADepartmentStatus
};

module.exports = helperMethods;
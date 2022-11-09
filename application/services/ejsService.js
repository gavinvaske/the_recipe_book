const workflowStepService = require('./workflowStepService');
const dateTimeService = require('./dateTimeService');

function getSimpleDate(date) {
    return new Date(date).toLocaleDateString('en-US');
}

const helperMethods = {
    prettifyDuration: dateTimeService.prettifyDuration,
    getSimpleDate: getSimpleDate,
    getOverallTicketDuration: workflowStepService.getOverallTicketDuration,
    getHowLongTicketHasBeenInProduction: workflowStepService.getHowLongTicketHasBeenInProduction,
    getHowLongTicketHasBeenInDepartment: workflowStepService.getHowLongTicketHasBeenInDepartment,
    getHowLongTicketHasHadADepartmentStatus: workflowStepService.getHowLongTicketHasHadADepartmentStatus
};

module.exports = helperMethods;
const workflowStepService = require('./workflowStepService');
const userService = require('./userService');
const dateTimeService = require('./dateTimeService');

const helperMethods = {
    prettifyDuration: dateTimeService.prettifyDuration,
    getSimpleDate: dateTimeService.getSimpleDate,
    getOverallTicketDuration: workflowStepService.getOverallTicketDuration,
    getHowLongTicketHasBeenInProduction: workflowStepService.getHowLongTicketHasBeenInProduction,
    getHowLongTicketHasBeenInDepartment: workflowStepService.getHowLongTicketHasBeenInDepartment,
    getHowLongTicketHasHadADepartmentStatus: workflowStepService.getHowLongTicketHasHadADepartmentStatus,
    getProfilePictureUrl: userService.getProfilePictureUrl
};

module.exports = helperMethods;
const workflowStepService = require('./workflowStepService');
const userService = require('./userService');
const dateTimeService = require('./dateTimeService');

const helperMethods = {
    prettifyDuration: dateTimeService.prettifyDuration,
    getDate: dateTimeService.getDate,
    getDayNumberAndMonth: dateTimeService.getDayNumberAndMonth,
    getOverallTicketDuration: workflowStepService.getOverallTicketDuration,
    getHowLongTicketHasBeenInProduction: workflowStepService.getHowLongTicketHasBeenInProduction,
    getHowLongTicketHasBeenInDepartment: workflowStepService.getHowLongTicketHasBeenInDepartment,
    getHowLongTicketHasHadADepartmentStatus: workflowStepService.getHowLongTicketHasHadADepartmentStatus,
    getProfilePictureUrl: userService.getProfilePictureUrl,
    getUserInitials: userService.getUserInitials
};

module.exports = helperMethods;
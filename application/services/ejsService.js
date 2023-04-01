const workflowStepService = require('./workflowStepService');
const userService = require('./userService');
const dateTimeService = require('./dateTimeService');
const helperService = require('./helperService');

const helperMethods = {
    prettifyDuration: dateTimeService.prettifyDuration,
    getDate: dateTimeService.getDate,
    getDayNumberAndMonth: dateTimeService.getDayNumberAndMonth,
    getOverallTicketDuration: workflowStepService.getOverallTicketDuration,
    getHowLongTicketHasBeenInProduction: workflowStepService.getHowLongTicketHasBeenInProduction,
    getHowLongTicketHasBeenInDepartment: workflowStepService.getHowLongTicketHasBeenInDepartment,
    getHowLongTicketHasHadADepartmentStatus: workflowStepService.getHowLongTicketHasHadADepartmentStatus,
    getProfilePictureUrl: userService.getProfilePictureUrl,
    getUserInitials: userService.getUserInitials,
    getEmptyObjectIfUndefined: helperService.getEmptyObjectIfUndefined,
    getEmptyArrayIfUndefined: helperService.getEmptyArrayIfUndefined
};

module.exports = helperMethods;
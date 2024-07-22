import * as workflowStepService from './workflowStepService.js';
import * as userService from './userService.js';
import * as dateTimeService from './dateTimeService.js';
import * as helperService from './helperService.js';

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

export default helperMethods;
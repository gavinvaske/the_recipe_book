import * as workflowStepService from './workflowStepService.ts';
import * as userService from './userService.ts';
import * as dateTimeService from './dateTimeService.ts';
import * as helperService from './helperService.ts';

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
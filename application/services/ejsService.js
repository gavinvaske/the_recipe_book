import * as workflowStepService from './workflowStepService';
import * as userService from './userService';
import * as dateTimeService from './dateTimeService';
import * as helperService from './helperService';

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
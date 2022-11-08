const WorkflowStepModel = require('../models/WorkflowStep');
const dateTimeService = require('../services/dateTimeService');

async function findWorkflowStepsByTicketId(ticketId) {
    const ascendingSort = 1;
    const searchQuery = {
        ticketId
    };
    const sortQuery = {
        createdAt: ascendingSort
    };

    return await WorkflowStepModel
        .find(searchQuery)
        .sort(sortQuery)
        .exec();
}

function getTimeSpentInWorkflowStep(currentWorkflowStep, nextWorkflowStep) {
    if (!nextWorkflowStep) {
        const now = new Date();
        return dateTimeService.howManyMillisecondsHavePassedBetweenDateTimes(currentWorkflowStep.createdAt, now);
    }

    return dateTimeService.howManyMillisecondsHavePassedBetweenDateTimes(currentWorkflowStep.createdAt, nextWorkflowStep.createdAt);
}

function updateWorkflowStepTimeLedger(workflowStepTimeLedger, workflowStep, timeSpentInThisWorkflowStep) {
    const {ticketId, destination} = workflowStep;
    const department = destination.department;
    const departmentStatus = destination.departmentStatus;
    const TIME_SPENT_IN_DEPARTMENT = 'timeSpentInDepartment';
    const TIME_PER_DEPARTMENT_STATUS = 'timePerDepartmentStatus';

    if (!workflowStepTimeLedger[ticketId]) {
        workflowStepTimeLedger[ticketId] = {};
    }

    if (!workflowStepTimeLedger[ticketId][department]) {
        workflowStepTimeLedger[ticketId][department] = {
            [TIME_SPENT_IN_DEPARTMENT]: 0,
            [TIME_PER_DEPARTMENT_STATUS]: {[departmentStatus] : 0}
        };
    }

    workflowStepTimeLedger[ticketId][department][TIME_SPENT_IN_DEPARTMENT] += timeSpentInThisWorkflowStep;

    if (!departmentStatus) {
        return;
    }

    if (!workflowStepTimeLedger[ticketId][department][TIME_PER_DEPARTMENT_STATUS][departmentStatus]) {
        workflowStepTimeLedger[ticketId][department][TIME_PER_DEPARTMENT_STATUS][departmentStatus] = 0;
    }

    workflowStepTimeLedger[ticketId][department][TIME_PER_DEPARTMENT_STATUS][departmentStatus] += timeSpentInThisWorkflowStep;
}

module.exports.computeTimeTicketsHaveSpentInEachWorkflowStep = async () => {
    const ticketIds = await WorkflowStepModel.find().distinct('ticketId').exec();
    const workflowStepTimeLedger = {};
    
    for (let i = 0; i < ticketIds.length; i++) {
        const workflowStepsForOneTicket = await findWorkflowStepsByTicketId(ticketIds[i]);
        
        for (let j = 0; j < workflowStepsForOneTicket.length; j++) {
            const currentWorkflowStep = workflowStepsForOneTicket[j];
            const isThereANextWorkflowStep = workflowStepsForOneTicket.length - 1 > j;
            let nextWorkflowStep;
    
            if (isThereANextWorkflowStep) {
                nextWorkflowStep = workflowStepsForOneTicket[j+1];
            }
    
            let millisecondsSpentInCurrentWorkflowStep = getTimeSpentInWorkflowStep(currentWorkflowStep, nextWorkflowStep);
            let minutesSpentInCurrentWorkflowStep = dateTimeService.convertMillisecondsToMinutes(millisecondsSpentInCurrentWorkflowStep);
    
            updateWorkflowStepTimeLedger(workflowStepTimeLedger, currentWorkflowStep, minutesSpentInCurrentWorkflowStep);
        }
    }
};
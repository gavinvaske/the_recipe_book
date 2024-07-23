import WorkflowStepModel from '../models/WorkflowStep';
import * as dateTimeService from '../services/dateTimeService';
import { COMPLETE_DEPARTMENT, productionDepartmentsAndDepartmentStatuses } from '../enums/departmentsEnum';

const TIME_SPENT_IN_DEPARTMENT = 'timeSpentInDepartment';
const TIME_PER_DEPARTMENT_STATUS = 'timePerDepartmentStatus';

async function findWorkflowStepsByTicketIds(ticketIds) {
    const ascendingSort = 1;
    const searchQuery = {
        ticketId: {$in: ticketIds},
        'destination.department': {$ne: COMPLETE_DEPARTMENT}
    };
    const sortQuery = {
        createdAt: ascendingSort
    };
    const attributesToSelect= [
        'createdAt',
        'ticketId',
        'destination.department',
        'destination.departmentStatus'
    ];

    const workflowSteps = await WorkflowStepModel
        .find(searchQuery)
        .select(attributesToSelect)
        .sort(sortQuery)
        .exec();

    const ticketIdToWorkflowSteps = {};

    ticketIds.forEach((ticketId) => {
        ticketIdToWorkflowSteps[ticketId] = [];
    });

    workflowSteps.forEach((workflowStep) => {
        const ticketId = workflowStep.ticketId;

        ticketIdToWorkflowSteps[ticketId].push(workflowStep);
    });

    return ticketIdToWorkflowSteps;
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

export async function computeTimeTicketsHaveSpentInEachWorkflowStep(ticketIds) {
    const ticketIdToWorkflowSteps = await findWorkflowStepsByTicketIds(ticketIds);
    const workflowStepTimeLedger = {};

    for (ticketId in ticketIdToWorkflowSteps) {
        const workflowStepsForOneTicket = ticketIdToWorkflowSteps[ticketId];

        workflowStepsForOneTicket && workflowStepsForOneTicket.forEach((currentWorkflowStep, index) => {
            const isThereANextWorkflowStep = workflowStepsForOneTicket.length - 1 > index;
            let nextWorkflowStep;

            if (isThereANextWorkflowStep) {
                nextWorkflowStep = workflowStepsForOneTicket[index+1];
            }

            let millisecondsSpentInCurrentWorkflowStep = getTimeSpentInWorkflowStep(currentWorkflowStep, nextWorkflowStep);
            let minutesSpentInCurrentWorkflowStep = dateTimeService.convertMillisecondsToMinutes(millisecondsSpentInCurrentWorkflowStep);
    
            updateWorkflowStepTimeLedger(workflowStepTimeLedger, currentWorkflowStep, minutesSpentInCurrentWorkflowStep);
        });
    };

    return workflowStepTimeLedger;
}

export function getOverallTicketDuration(workflowStepLedgerForTicket) {
    if (!workflowStepLedgerForTicket) {
        return;
    }

    let totalTimeInMinutes = 0;

    Object.keys(workflowStepLedgerForTicket).forEach((department) => {
        const departmentLevelLedger = workflowStepLedgerForTicket[department];
        totalTimeInMinutes += departmentLevelLedger[TIME_SPENT_IN_DEPARTMENT];
    });

    return totalTimeInMinutes;
}

export function getHowLongTicketHasBeenInProduction(workflowStepLedgerForTicket) {
    if (!workflowStepLedgerForTicket) {
        return;
    }

    let totalTimeInMinutes = 0;

    Object.keys(productionDepartmentsAndDepartmentStatuses).forEach((department) => {
        const ticketHasSpentTimeInThisProductionDepartment = workflowStepLedgerForTicket[department];
    
        if (ticketHasSpentTimeInThisProductionDepartment) {
            totalTimeInMinutes += workflowStepLedgerForTicket[department][TIME_SPENT_IN_DEPARTMENT];
        }
    });

    return totalTimeInMinutes;
}

export function getHowLongTicketHasBeenInDepartment(workflowStepLedgerForTicket, department) {
    if (!workflowStepLedgerForTicket) {
        return;
    }

    return workflowStepLedgerForTicket[department][TIME_SPENT_IN_DEPARTMENT];
}

export function getHowLongTicketHasHadADepartmentStatus(workflowStepLedgerForTicket, department, departmentStatus) {
    if (!workflowStepLedgerForTicket) {
        return;
    }

    return workflowStepLedgerForTicket[department][TIME_PER_DEPARTMENT_STATUS][departmentStatus];
}
const WorkflowStepModel = require('../models/WorkflowStep');
const TicketModel = require('../models/ticket');
const dateTimeService = require('../services/dateTimeService');
const {COMPLETE_DEPARTMENT, productionDepartmentsAndDepartmentStatuses} = require('../enums/departmentsEnum');

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

module.exports.findDistinctTicketIdsWichAreNotCompletedAndHaveADefinedDestination = async () => {
    const searchQueryThatExcludesTicketsWithoutADestinationAndCompletedTickets = { 
        $or: [ 
            {'destination': null}, 
            {
                'destination.department': {$ne: COMPLETE_DEPARTMENT}
            } 
        ]
    };

    const ticketIds = await TicketModel
        .find(searchQueryThatExcludesTicketsWithoutADestinationAndCompletedTickets)
        .distinct('_id')
        .exec();

    return ticketIds;
};

module.exports.computeTimeTicketsHaveSpentInEachWorkflowStep = async (ticketIds) => {
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
};

module.exports.getOverallTicketDuration = (workflowStepLedgerForTicket) => {
    if (!workflowStepLedgerForTicket) {
        return;
    }

    let totalTimeInMinutes = 0;

    Object.keys(workflowStepLedgerForTicket).forEach((department) => {
        const departmentLevelLedger = workflowStepLedgerForTicket[department];
        totalTimeInMinutes += departmentLevelLedger[TIME_SPENT_IN_DEPARTMENT];
    });

    return totalTimeInMinutes;
};

module.exports.getHowLongTicketHasBeenInProduction = (workflowStepLedgerForTicket) => {
    if (!workflowStepLedgerForTicket) {
        return;
    }

    let totalTimeInMinutes = 0;
    const zeroMinutes = 0;

    Object.keys(productionDepartmentsAndDepartmentStatuses).forEach((department) => {
        const departmentStatusesForThisDepartment = productionDepartmentsAndDepartmentStatuses[department];

        departmentStatusesForThisDepartment.forEach((departmentStatus) => {
            if (workflowStepLedgerForTicket[department]) {
                const durationWithThisDepartmentStatus = workflowStepLedgerForTicket[department][TIME_PER_DEPARTMENT_STATUS][departmentStatus];
                totalTimeInMinutes += durationWithThisDepartmentStatus ? durationWithThisDepartmentStatus : zeroMinutes;
            }
        });
    });

    return totalTimeInMinutes;
};

module.exports.getHowLongTicketHasBeenInDepartment = (workflowStepLedgerForTicket, department) => {
    if (!workflowStepLedgerForTicket) {
        return;
    }

    return workflowStepLedgerForTicket[department][TIME_SPENT_IN_DEPARTMENT];
};

module.exports.getHowLongTicketHasHadADepartmentStatus = (workflowStepLedgerForTicket, department, departmentStatus) => {
    if (!workflowStepLedgerForTicket) {
        return;
    }

    return workflowStepLedgerForTicket[department][TIME_PER_DEPARTMENT_STATUS][departmentStatus];
};
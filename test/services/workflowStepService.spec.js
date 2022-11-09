const workflowStepService = require('../../application/services/workflowStepService');
const chance = require('chance').Chance();
const {productionDepartmentsAndDepartmentStatuses, getAllDepartments, departmentStatusesGroupedByDepartment} = require('../../application/enums/departmentsEnum');

const TIME_SPENT_IN_DEPARTMENT = 'timeSpentInDepartment';
const TIME_PER_DEPARTMENT_STATUS = 'timePerDepartmentStatus';

describe('workflowStepService test suite', () => {
    describe('getOverallTicketDuration()', () => {
        it('should return 0 if the workflowStepLedger is empty', () => {
            const workflowStepLedger = {};
            const expectedDuration = 0;

            const actualDuration = workflowStepService.getOverallTicketDuration(workflowStepLedger);

            expect(actualDuration).toBe(expectedDuration);
        });

        it('should return sum of time spent in each department', () => {
            const department1 = chance.word();
            const department2 = chance.word();
            const totalTimeSpentInDepartment1 = chance.floating({min: 0, max: 100000});
            const totalTimeSpentInDepartment2 = chance.floating({min: 0, max: 100000});
            const workflowStepLedger = {
                [department1]: {
                    [TIME_SPENT_IN_DEPARTMENT]: totalTimeSpentInDepartment1
                },
                [department2]: {
                    [TIME_SPENT_IN_DEPARTMENT]: totalTimeSpentInDepartment2
                }
            };
            const expectedDuration = totalTimeSpentInDepartment1 + totalTimeSpentInDepartment2;

            const actualDuration = workflowStepService.getOverallTicketDuration(workflowStepLedger);

            expect(actualDuration).toBe(expectedDuration);
        });
    });

    describe('getHowLongTicketHasBeenInProduction()', () => {

        it('should return 0 if ticket has not been in a production department', () => {
            const nonProductionDepartments = getNonProductionDepartments();
            const workflowStepLedger = {
                [nonProductionDepartments[0]]: {
                    [TIME_SPENT_IN_DEPARTMENT]: chance.floating({min: 0})
                }
            };
            const expectedDuration = 0;

            const actualDuration = workflowStepService.getHowLongTicketHasBeenInProduction(workflowStepLedger);

            expect(actualDuration).toBe(expectedDuration);
        });

        it('should only count the time a ticket has been in a production department/departmentStatus', () => {
            const nonProductionDepartment = getNonProductionDepartments()[0];
            const nonProductionDepartmentDepartmentStatuses = departmentStatusesGroupedByDepartment[nonProductionDepartment];
            const productionDepartment = Object.keys(productionDepartmentsAndDepartmentStatuses)[0];
            const productionDepartmentDepartmentStatuses = productionDepartmentsAndDepartmentStatuses[productionDepartment];
            const durationSpentWithNonProductionDepartmentStatus = chance.floating({min: 0});
            const durationSpentWithProductionDepartmentStatus = chance.floating({min: 0});
            const workflowStepLedger = {
                [nonProductionDepartment]: {
                    [TIME_PER_DEPARTMENT_STATUS]: {
                        [nonProductionDepartmentDepartmentStatuses[0]]: durationSpentWithNonProductionDepartmentStatus
                    }
                },
                [productionDepartment]: {
                    [TIME_PER_DEPARTMENT_STATUS]: {
                        [productionDepartmentDepartmentStatuses[0]]: durationSpentWithProductionDepartmentStatus
                    }
                }
            };

            const actualDuration = workflowStepService.getHowLongTicketHasBeenInProduction(workflowStepLedger);

            expect(actualDuration).toBe(durationSpentWithProductionDepartmentStatus);
        });
    });

    describe('getHowLongTicketHasBeenInDepartment()', () => {
        it ('should determine how long a ticket has been in the department correctly', () => {
            const department = chance.word();
            const timeSpentInDepartment = chance.floating({min: 0});
    
            const workflowStepLedger = {
                [department]: {
                    [TIME_SPENT_IN_DEPARTMENT]: timeSpentInDepartment
                }
            };
    
            const actualDuration = workflowStepService.getHowLongTicketHasBeenInDepartment(workflowStepLedger, department);
    
            expect(actualDuration).toBe(timeSpentInDepartment);
        });
    });

    describe('getHowLongTicketHasHadADepartmentStatus()', () => {
        it ('should determine how long a ticket has been in the departmentStatus correctly', () => {
            const department = chance.word();
            const departmentStatus = chance.word();
            const timeSpentInDepartmentStatus = chance.floating({min: 0});
    
            const workflowStepLedger = {
                [department]: {
                    [TIME_PER_DEPARTMENT_STATUS]: {
                        [departmentStatus]: timeSpentInDepartmentStatus
                    }
                }
            };
    
            const actualDuration = workflowStepService.getHowLongTicketHasHadADepartmentStatus(workflowStepLedger, department, departmentStatus);
    
            expect(actualDuration).toBe(timeSpentInDepartmentStatus);
        });
    });


});

function getNonProductionDepartments() {
    const productionDepartments = Object.keys(productionDepartmentsAndDepartmentStatuses);
    const allDepartments = getAllDepartments();
    return allDepartments.filter(x => !productionDepartments.includes(x));
}
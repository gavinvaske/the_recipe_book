import * as workflowStepService from '../../application/api/services/workflowStepService.ts';
import Chance from 'chance';
import { 
    productionDepartmentsAndDepartmentStatuses, 
    getAllDepartments 
} from '../../application/api/enums/departmentsEnum.ts';

const chance = Chance();
const TIME_SPENT_IN_DEPARTMENT = 'timeSpentInDepartment';
const TIME_PER_DEPARTMENT_STATUS = 'timePerDepartmentStatus';

describe('workflowStepService test suite', () => {
    describe('getOverallTicketDuration()', () => {
        it('should return undefined if the workflowStepLedger is undefined', () => {
            let workflowStepLedger;

            const actualDuration = workflowStepService.getOverallTicketDuration(workflowStepLedger);

            expect(actualDuration).toBe(undefined);
        });

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
        it('should return undefined if workflowStepLedger is undefined', () => {
            let workflowStepLedger;

            const actualDuration = workflowStepService.getHowLongTicketHasBeenInProduction(workflowStepLedger);

            expect(actualDuration).toBe(undefined);
        });

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
            const productionDepartment = chance.pickone(Object.keys(productionDepartmentsAndDepartmentStatuses));
            const durationSpentWithNonProductionDepartmentStatus = chance.floating({min: 0});
            const durationSpentWithProductionDepartmentStatus = chance.floating({min: 0});
            const workflowStepLedger = {
                [nonProductionDepartment]: {
                    [TIME_SPENT_IN_DEPARTMENT]: durationSpentWithNonProductionDepartmentStatus
                },
                [productionDepartment]: {
                    [TIME_SPENT_IN_DEPARTMENT]: durationSpentWithProductionDepartmentStatus
                }
            };

            const actualDuration = workflowStepService.getHowLongTicketHasBeenInProduction(workflowStepLedger);

            expect(actualDuration).toBe(durationSpentWithProductionDepartmentStatus);
        });
    });

    describe('getHowLongTicketHasBeenInDepartment()', () => {
        it('should return undefined if workflowStepLedger is undefined', () => {
            let workflowStepLedger;

            const actualDuration = workflowStepService.getHowLongTicketHasBeenInDepartment(workflowStepLedger);

            expect(actualDuration).toBe(undefined);
        });

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
        it('should return undefined if workflowStepLedger is undefined', () => {
            let workflowStepLedger;

            const actualDuration = workflowStepService.getHowLongTicketHasHadADepartmentStatus(workflowStepLedger);

            expect(actualDuration).toBe(undefined);
        });

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
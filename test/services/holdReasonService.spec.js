import * as holdReasonService from '../../application/api/services/holdReasonService.ts';
import Chance from 'chance';
import mockHoldReasonModel from '../../application/api/models/holdReason.ts';
import { getAllDepartmentsWithDepartmentStatuses } from '../../application/api/enums/departmentsEnum.ts';

const chance = Chance();

jest.mock('../../application/api/models/holdReason.ts');

describe('holdReasonService test suite', () => {
    describe('getDepartmentToHoldReasons()', () => {
        let holdReasonsInDatabase;
        
        beforeEach(() => {
            holdReasonsInDatabase = [];
            execFunction = jest.fn().mockResolvedValue(holdReasonsInDatabase);
            findFunction = jest.fn().mockImplementation(() => {
                return {
                    exec: execFunction
                };
            });
            mockHoldReasonModel.find.mockImplementation(findFunction);
        });

        it ('should not throw error', async () => {
            await expect(holdReasonService.getDepartmentToHoldReasons()).resolves.not.toThrow();
        });

        it('should return an object with the same number of keys as all departments (other than the "COMPLETED" department)', async () => {
            holdReasonsInDatabase = [];
            execFunction = jest.fn().mockResolvedValue(holdReasonsInDatabase);
            const departmentNameToHoldReasons = await holdReasonService.getDepartmentToHoldReasons();

            expect(Object.keys(departmentNameToHoldReasons).length).toStrictEqual(getAllDepartmentsWithDepartmentStatuses().length);
        });

        it('should return an object whose keys all map to an empty array', async () => {
            holdReasonsInDatabase = [];
            execFunction = jest.fn().mockResolvedValue(holdReasonsInDatabase);
            const departmentNameToHoldReasons = await holdReasonService.getDepartmentToHoldReasons();

            Object.keys(departmentNameToHoldReasons).forEach((departmentName) => {
                expect(departmentNameToHoldReasons[departmentName]).toStrictEqual([]);
            });
        });

        it('should map the correct number of hold reasons', async () => {
            const departmentName = chance.pickone(getAllDepartmentsWithDepartmentStatuses());
            holdReasonsInDatabase = [
                {
                    department: departmentName,
                    reason: chance.string()
                },
                {
                    department: departmentName,
                    reason: chance.string()
                },
                {
                    department: departmentName,
                    reason: chance.string()
                },
                {
                    department: departmentName,
                    reason: chance.string()
                }
            ];
            execFunction = jest.fn().mockResolvedValue(holdReasonsInDatabase);

            const departmentNameToHoldReasons = await holdReasonService.getDepartmentToHoldReasons();

            const totalNumberOfHoldReasonsInTheResponse = Object.values(departmentNameToHoldReasons).flatMap((reason) => reason).length;
            expect(totalNumberOfHoldReasonsInTheResponse).toBe(holdReasonsInDatabase.length);
        });

        it('should map the hold reason to the correct department', async () => {
            const firstDepartmentName = getAllDepartmentsWithDepartmentStatuses()[0];
            const secondDepartmentName = getAllDepartmentsWithDepartmentStatuses()[1];
            const holdReasonForTheFirstDepartment = [
                {
                    department: firstDepartmentName,
                    reason: chance.string()
                },
                {
                    department: firstDepartmentName,
                    reason: chance.string()
                }
            ];
            const holdReasonForTheSecondDepartment = [
                {
                    department: secondDepartmentName,
                    reason: chance.string()
                }
            ];
            holdReasonsInDatabase = [
                ...holdReasonForTheFirstDepartment,
                ...holdReasonForTheSecondDepartment
            ];
            
            execFunction = jest.fn().mockResolvedValue(holdReasonsInDatabase);

            const departmentNameToHoldReasons = await holdReasonService.getDepartmentToHoldReasons();

            const totalNumberOfHoldReasonsInTheResponse = Object.values(departmentNameToHoldReasons).flatMap((reason) => reason).length;
            expect(departmentNameToHoldReasons[firstDepartmentName].length).toBe(holdReasonForTheFirstDepartment.length);
            expect(departmentNameToHoldReasons[secondDepartmentName].length).toBe(holdReasonForTheSecondDepartment.length);
            expect(totalNumberOfHoldReasonsInTheResponse).toBe(holdReasonsInDatabase.length);
        });
    });
});
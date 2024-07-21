import Chance from 'chance'
const chance = Chance();
import * as departmentsEnum from '../../application/enums/departmentsEnum';
const dieLineService = require('../../application/services/dieLineService');

describe('validation', () => {
    let dieLineDepartments;

    beforeEach(() => {
        dieLineDepartments = Object.keys(departmentsEnum.departmentToDepartmentStatusesForDieLineRequests);
    });

    describe('getDepartments()', () => {
        it('should return all die line departments', () => {
            const expectedDepartments = dieLineDepartments;

            const actualDepartments = dieLineService.getDepartments();
            
            expect(actualDepartments).toEqual(expectedDepartments);
        });
    });

    describe('getStartingDepartment()', () => {
        it('should return the first die line department', () => {
            const expectedDepartment = dieLineDepartments[0];

            const actualDepartment = dieLineService.getStartingDepartment();
            
            expect(actualDepartment).toEqual(expectedDepartment);
        });
    });

    describe('getDepartmentStatusesForDepartment()', () => {
        it('should return a list of departments associated to this department', () => {
            const dieLineDepartment = chance.pickone(dieLineDepartments);
            const expectedDepartmentStatuses = departmentsEnum.departmentToDepartmentStatusesForDieLineRequests[dieLineDepartment];

            const actualDepartment = dieLineService.getDepartmentStatusesForDepartment(dieLineDepartment);
            
            expect(actualDepartment).toEqual(expectedDepartmentStatuses);
        });
    });
});
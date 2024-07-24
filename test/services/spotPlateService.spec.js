import Chance from 'chance';
import * as departmentsEnum from '../../application/api/enums/departmentsEnum.ts';
import * as spotPlateService from '../../application/api/services/spotPlateService.ts';

const chance = Chance();

describe('validation', () => {
    let spotPlateDepartments;

    beforeEach(() => {
        spotPlateDepartments = Object.keys(departmentsEnum.departmentToDepartmentStatusesForSpotPlateRequests);
    });

    describe('getDepartments()', () => {
        it('should return all spot plate departments', () => {
            const expectedDepartments = spotPlateDepartments;

            const actualDepartments = spotPlateService.getDepartments();
            
            expect(actualDepartments).toEqual(expectedDepartments);
        });
    });

    describe('getStartingDepartment()', () => {
        it('should return the first spot plate department', () => {
            const expectedDepartment = spotPlateDepartments[0];

            const actualDepartment = spotPlateService.getStartingDepartment();
            
            expect(actualDepartment).toEqual(expectedDepartment);
        });
    });

    describe('getStartingDepartmentAndDepartmentStatuses()', () => {
        it('should return the first spot plate department', () => {
            const expectedDepartment = spotPlateDepartments[0];

            const actualDepartment = spotPlateService.getStartingDepartment();
            
            expect(actualDepartment).toEqual(expectedDepartment);
        });
    });

    describe('getDepartmentStatusesForDepartment()', () => {
        it('should return a list of departments associated to this department', () => {
            const spotPlateDepartment = chance.pickone(spotPlateDepartments);
            const expectedDepartmentStatuses = departmentsEnum.departmentToDepartmentStatusesForSpotPlateRequests[spotPlateDepartment];

            const actualDepartment = spotPlateService.getDepartmentStatusesForDepartment(spotPlateDepartment);
            
            expect(actualDepartment).toEqual(expectedDepartmentStatuses);
        });
    });
});
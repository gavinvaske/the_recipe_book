const {
    getAllDepartments, 
    productionDepartmentsAndDepartmentStatuses, 
    isInProgressDepartmentStatus, 
    departmentToStatusesMappingForTicketObjects, 
    removeDepartmentStatusesAUserIsNotAllowedToSelect,
    departmentToNextDepartmentAndStatus
} = require('../../application/enums/departmentsEnum');
import Chance from 'chance'
const chance = Chance();;

describe('departmentsEnum', () => {
    describe('getAllDepartments()', () => {
        it('should return the list of departments', () => {
            const expectedNumberOfDepartments = 10;
    
            const departments = getAllDepartments();
    
            expect(departments.length).toBe(expectedNumberOfDepartments);
        });
    });

    describe('productionDepartmentsAndDepartmentStatuses', () => {
        it('should return the correct number of production departments', () => {
            const expectedNumberOfDepartments = 5;
    
            const productionDepartments = Object.keys(productionDepartmentsAndDepartmentStatuses);
    
            expect(productionDepartments.length).toBe(expectedNumberOfDepartments);
        });
    
        it('should have at least one departmentStatus for all production departments', () => {
            let doesDepartmentContainZeroDepartmentStatuses = false;
            const emptyLength = 0;
    
            Object.keys(productionDepartmentsAndDepartmentStatuses).forEach((department) => {
                const departmentStatuses = productionDepartmentsAndDepartmentStatuses[department];
                if (!departmentStatuses || departmentStatuses.length === emptyLength) {
                    doesDepartmentContainZeroDepartmentStatuses = true;
                }
            });
    
            expect(doesDepartmentContainZeroDepartmentStatuses).toBe(false);
        });
    
        it('should have the correct number of production departmentStatuses', () => {
            let expectedNumberOfProductionDepartmentStatuses = 21;
            let allProductionDepartmentStatuses = [];
    
            Object.keys(productionDepartmentsAndDepartmentStatuses).forEach((department) => {
                const departmentStatuses = productionDepartmentsAndDepartmentStatuses[department];
                if (departmentStatuses) {
                    allProductionDepartmentStatuses.push(...departmentStatuses);
                }
            });
    
            expect(expectedNumberOfProductionDepartmentStatuses).toBe(allProductionDepartmentStatuses.length);
        });
    });

    describe('removeDepartmentStatusesAUserIsNotAllowedToSelect()', () => {
        it('should throw error if non-array is passed in', () => {
            const invalidParam = undefined;

            expect(() => removeDepartmentStatusesAUserIsNotAllowedToSelect(invalidParam)).toThrow();
        });

        it('should handle an empty array', () => {
            const departmentStatusesBeforeFiltering = [];

            const departmentStatusesAfterFiltering = removeDepartmentStatusesAUserIsNotAllowedToSelect(departmentStatusesBeforeFiltering);

            expect(departmentStatusesAfterFiltering.length).toBe(departmentStatusesBeforeFiltering.length);
        });

        it('should not filter anything', () => {
            const departmentStatusesWhichShouldNotBeRemoved = chance.n(chance.string, chance.integer({min: 1, max: 20}));

            const departmentStatusesAfterFiltering = removeDepartmentStatusesAUserIsNotAllowedToSelect(departmentStatusesWhichShouldNotBeRemoved);

            expect(departmentStatusesAfterFiltering.length).toBe(departmentStatusesWhichShouldNotBeRemoved.length);
        });

        it('should filter out "IN PROGRESS" statuses', () => {
            const departmentStatusesWhichShouldNotBeRemoved = chance.n(chance.string, chance.integer({min: 1, max: 20}));
            const departmentStatusThatShouldBeRemoved = 'IN PROGRESS';

            const departmentStatusesAfterFiltering = removeDepartmentStatusesAUserIsNotAllowedToSelect([
                departmentStatusThatShouldBeRemoved,
                ...departmentStatusesWhichShouldNotBeRemoved,
                departmentStatusThatShouldBeRemoved,
                departmentStatusThatShouldBeRemoved
            ]);

            expect(departmentStatusesAfterFiltering.length).toBe(departmentStatusesWhichShouldNotBeRemoved.length);
        });
    });

    describe('departmentToStatusesMappingForTicketObjects', () => {
        it('should have the correct number of departmentStatuses', () => {
            let expectedNumberOfProductionDepartmentStatuses = 37;
            let allProductionDepartmentStatuses = [];
    
            Object.keys(departmentToStatusesMappingForTicketObjects).forEach((department) => {
                const departmentStatuses = departmentToStatusesMappingForTicketObjects[department];
                if (departmentStatuses) {
                    allProductionDepartmentStatuses.push(...departmentStatuses);
                }
            });
    
            expect(allProductionDepartmentStatuses.length).toBe(expectedNumberOfProductionDepartmentStatuses);
        });

        it('should return the correct number of production departments', () => {
            const expectedNumberOfDepartments = 10;
    
            const productionDepartments = Object.keys(departmentToStatusesMappingForTicketObjects);
    
            expect(productionDepartments.length).toBe(expectedNumberOfDepartments);
        });
    });

    describe('isInProgressDepartmentStatus()', () => {
        it('should return false if status IS NOT "IN PROGRESS"', () => {
            const departmentStatus = chance.word();
            
            expect(isInProgressDepartmentStatus(departmentStatus)).toBe(false);
        });

        it('should return true if status IS "IN PROGRESS"', () => {
            const departmentStatus = 'IN PROGRESS';
            
            expect(isInProgressDepartmentStatus(departmentStatus)).toBe(true);
        });
    });

    describe('departmentToNextDepartmentAndStatus', () => {
        let expectedDepartmentToNextDepartmentStatus;

        beforeEach(() => {
            expectedDepartmentToNextDepartmentStatus = {
                'ART-PREP': ['PRE-PRINTING', 'SEND TO PRINTING'],
                'PRE-PRINTING': ['PRINTING', 'PRINTING READY'],
                'PRINTING': ['CUTTING', 'CUTTING READY'],
                'CUTTING': ['WINDING', 'WINDING READY'],
                'WINDING': ['PACKAGING', 'PACKAGING READY'],
                'PACKAGING': ['SHIPPING', 'SHIPPING READY'],
                'SHIPPING': ['BILLING', 'BILLING READY'],
                'BILLING': ['COMPLETED'],
            };
        });

        it('should have the correct keys defined', () => {
            expect(Object.keys(departmentToNextDepartmentAndStatus)).toEqual(Object.keys(expectedDepartmentToNextDepartmentStatus));
        });

        it('should map each key to the correct value', () => {
            Object.keys(departmentToNextDepartmentAndStatus).forEach((department) => {
                const actualNextDepartmentAndDepartmentStatus = departmentToNextDepartmentAndStatus[department];
                const expectedNextDepartmentAndDepartmentStatus = expectedDepartmentToNextDepartmentStatus[department];

                expect(actualNextDepartmentAndDepartmentStatus).toEqual(expectedNextDepartmentAndDepartmentStatus);
            });
        });

    });
});
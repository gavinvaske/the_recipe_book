const {getAllDepartments, productionDepartmentsAndDepartmentStatuses, isInProgressDepartmentStatus, departmentToStatusesMappingForTicketObjects} = require('../../application/enums/departmentsEnum');
const chance = require('chance').Chance();

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
});
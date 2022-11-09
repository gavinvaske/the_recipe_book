const {getAllDepartmentStatuses, getAllDepartments, productionDepartmentsAndDepartmentStatuses} = require('../../application/enums/departmentsEnum');

describe('departmentsEnum', () => {
    it('should return the list of departmentStatus', () => {
        const expectedNumberOfDepartmentStatuses = 39;
        const expectedNumberOfUniqueDepartmentStatuses = 24;

        const departmentStatuses = getAllDepartmentStatuses();
        const uniqueDepartmentStatuses = new Set(departmentStatuses);

        console.log(uniqueDepartmentStatuses.size);

        expect(departmentStatuses.length).toBe(expectedNumberOfDepartmentStatuses);
        expect(uniqueDepartmentStatuses.size).toBe(expectedNumberOfUniqueDepartmentStatuses);
    });

    it('should return the list of departments', () => {
        const expectedNumberOfDepartments = 9;

        const departments = getAllDepartments();

        expect(departments.length).toBe(expectedNumberOfDepartments);
    });

    it('should return the correct number of production departments', () => {
        const expectedNumberOfDepartments = 5;

        const productionDepartments = Object.keys(productionDepartmentsAndDepartmentStatuses);

        expect(productionDepartments.length).toBe(expectedNumberOfDepartments);
    });

    it('should have at least one departmentStatus for all production departments', () => {
        let doesDepartmentContainZeroDepartmentStatuses = false;

        Object.keys(productionDepartmentsAndDepartmentStatuses).forEach((department) => {
            const departmentStatuses = productionDepartmentsAndDepartmentStatuses[department]
            if (!departmentStatuses || departmentStatuses.length === 0) {
                doesDepartmentContainZeroDepartmentStatuses = true;
            }
        });

        expect(doesDepartmentContainZeroDepartmentStatuses).toBe(false);
    });

    it('should have the correct number of product departmentStatuses', () => {
        let expectedNumberOfProductionDepartmentStatuses = 24;
        let allProductionDepartmentStatuses = [];

        Object.keys(productionDepartmentsAndDepartmentStatuses).forEach((department) => {
            const departmentStatuses = productionDepartmentsAndDepartmentStatuses[department]
            if (departmentStatuses) {
                allProductionDepartmentStatuses.push(...departmentStatuses)
            }
        });

        expect(expectedNumberOfProductionDepartmentStatuses).toBe(allProductionDepartmentStatuses.length);
    });
});
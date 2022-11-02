const {getAllDepartmentStatuses, getAllDepartments} = require('../../application/enums/departmentsEnum');

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
});
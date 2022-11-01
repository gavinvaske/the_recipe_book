const {getAllSubDepartments, getAllDepartments} = require('../../application/enums/departmentsEnum');

describe('departmentsEnum', () => {
    it('should return the list of subdepartments', () => {
        const expectedNumberOfSubDepartments = 41;
        const expectedNumberOfUniqueSubDepartments = 24;

        const subDepartments = getAllSubDepartments();
        const uniqueSubDepartments = new Set(subDepartments);

        console.log(uniqueSubDepartments.size);

        expect(subDepartments.length).toBe(expectedNumberOfSubDepartments);
        expect(uniqueSubDepartments.size).toBe(expectedNumberOfUniqueSubDepartments);
    });

    it('should return the list of departments', () => {
        const expectedNumberOfDepartments = 9;

        const departments = getAllDepartments();

        expect(departments.length).toBe(expectedNumberOfDepartments);
    });
});
const {getAllSubDepartments, getAllDepartments} = require('../../application/enums/departmentsEnum');
const chance = require('chance').Chance();

describe('departmentsEnum', () => {
    it('should return the list of subdepartments', () => {
        const expectedNumberOfSubDepartments = 35;
        const expectedNumberOfUniqueSubDepartments = 21;

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
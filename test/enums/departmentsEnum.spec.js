const {findDeparmentNameUsingKey} = require('../../application/enums/departmentsEnum');
const chance = require('chance').Chance();

describe('departmentsEnum', () => {
    it('should return the correct department using a key', () => {
        const departmentKey = 'prePress';

        const department = findDeparmentNameUsingKey(departmentKey);

        expect(department).toBe('PRE-PRESS');
    });

    it('should throw error if the department does not exist for a given key', () => {
        const departmentKey = chance.word();
        let errorMessage = '';

        try {
            findDeparmentNameUsingKey(departmentKey);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe(`No department found using the key = ${departmentKey}`);
    });
});
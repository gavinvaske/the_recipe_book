const chance = require('chance').Chance();
const Destination = require('../../application/models/destination');
const {departmentStatusesGroupedByDepartment} = require('../../application/enums/departmentsEnum');
const mongoose = require('mongoose');

const DEPARTMENT_WITH_STATUSES = 'PRINTING';
const DEPARTMENT_WITHOUT_STATUSES = 'COMPLETED';

describe('validation', () => {
    let destinationAttributes;

    beforeEach(() => {
        let department = DEPARTMENT_WITH_STATUSES;
        let departmentStatus = chance.pickone(departmentStatusesGroupedByDepartment[department]);

        destinationAttributes = {
            department: department,
            departmentStatus: departmentStatus,
            assignees: [],
            machines: []
        };
    });

    it('should validate if all attributes are defined successfully', () => {
        const destination = new Destination(destinationAttributes);
    
        const error = destination.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: department', () => {
        it('should be of type String', () => {
            const destination = new Destination(destinationAttributes);

            expect(destination.department).toEqual(expect.any(String));
        });

        it('should fail if attribute is not defined', () => {
            delete destinationAttributes.department;
            const destination = new Destination(destinationAttributes);

            const error = destination.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail if attribute is NOT an accepted value', () => {
            const invalidDepartment = chance.string();
            destinationAttributes.department = invalidDepartment;
            const destination = new Destination(destinationAttributes);

            const error = destination.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass if attribute IS an accepted value', () => {
            const validDepartment = DEPARTMENT_WITH_STATUSES;
            const validStatus = chance.pickone(departmentStatusesGroupedByDepartment[validDepartment]);
            destinationAttributes.department = validDepartment;
            destinationAttributes.departmentStatus = validStatus;
            const destination = new Destination(destinationAttributes);

            const error = destination.validateSync();

            expect(error).toBe(undefined);
        });

        it('should pass if attribute IS an accepted value surrounded by whitespace', () => {
            const whitespaceToTrim = '  ';
            const validDepartment = DEPARTMENT_WITH_STATUSES;
            const validStatus = chance.pickone(departmentStatusesGroupedByDepartment[validDepartment]);
            destinationAttributes.department = whitespaceToTrim + validDepartment + whitespaceToTrim;
            destinationAttributes.departmentStatus = whitespaceToTrim + validStatus + whitespaceToTrim;
            const destination = new Destination(destinationAttributes);

            const error = destination.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: departmentStatus', () => {
        it('should be of type String', () => {
            const destination = new Destination(destinationAttributes);

            expect(destination.departmentStatus).toEqual(expect.any(String));
        });

        it('should fail if departmentStatus is not a valid departmentStatus a given department', () => {
            const invalidDepartmentStatus = chance.string();
            destinationAttributes.departmentStatus = invalidDepartmentStatus;
            const destination = new Destination(destinationAttributes);

            const error = destination.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass if departmentStatus is left blank because the department has no statuses', () => {
            destinationAttributes.department = DEPARTMENT_WITHOUT_STATUSES;
            delete destinationAttributes.departmentStatus;
            const destination = new Destination(destinationAttributes);

            const error = destination.validateSync();

            expect(error).toBe(undefined);
        });

        it('should fail if departmentStatus is not an allowed status for the given department', () => {
            destinationAttributes.department = DEPARTMENT_WITH_STATUSES;
            delete destinationAttributes.departmentStatus;
            const destination = new Destination(destinationAttributes);

            const error = destination.validateSync();

            expect(error).not.toBe(undefined);
        });
    });

    describe('attribute: assignees', () => {
        it('should have one element which is a valid mongoose objectId', () => {
            destinationAttributes.assignees = [
                new mongoose.Types.ObjectId()
            ];
            const destination = new Destination(destinationAttributes);

            expect(mongoose.Types.ObjectId.isValid(destination.assignees[0])).toBe(true);
        });

        it('should default to an empty array if attribute is not defined', () => {
            delete destinationAttributes.assignees;
            const emptyArray = [];
            const destination = new Destination(destinationAttributes);

            expect(destination.assignees).toEqual(emptyArray);
        });
    });

    describe('attribute: machines', () => {
        it('should have one element which is a valid mongoose objectId', () => {
            destinationAttributes.machines = [
                new mongoose.Types.ObjectId()
            ];
            const destination = new Destination(destinationAttributes);

            expect(mongoose.Types.ObjectId.isValid(destination.machines[0])).toBe(true);
        });

        it('should default to an empty array if attribute is not defined', () => {
            delete destinationAttributes.machines;
            const emptyArray = [];
            const destination = new Destination(destinationAttributes);

            expect(destination.machines).toEqual(emptyArray);
        });
    });
});
const chance = require('chance').Chance();
const TicketStatusRecord = require('../../application/models/ticketStatusRecord');
const {getAllSubDepartments, subDepartmentsGroupedByDepartment} = require('../../application/enums/departmentsEnum');
const mongoose = require('mongoose');

describe('validation', () => {
    let ticketStatusRecordAttributes;

    beforeEach(() => {
        let department = 'CUTTING';
        let departmentStatus = chance.pickone(subDepartmentsGroupedByDepartment[department]);

        ticketStatusRecordAttributes = {
            ticketId: new mongoose.Types.ObjectId(),
            department: department,
            departmentStatus: departmentStatus
        };
    });

    it('should validate if all attributes are defined successfully', () => {
        const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);
    
        const error = ticketStatusRecord.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: ticketId', () => {
        it('should fail if attribute is not defined', () => {
            delete ticketStatusRecordAttributes.ticketId;
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be a mongoose object ID', () => {
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            console.log('testseteestestest');
            console.log(JSON.stringify(ticketStatusRecord.ticketId));

            expect(mongoose.Types.ObjectId.isValid(ticketStatusRecord.ticketId)).toBe(true);
        });
    });
    describe('attribute: department', () => {
        it('should be of type String', () => {
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            expect(ticketStatusRecord.department).toEqual(expect.any(String));
        });

        it('should fail if attribute is not defined', () => {
            delete ticketStatusRecordAttributes.department;
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail if attribute is NOT an accepted value', () => {
            const invalidDepartment = chance.string();
            ticketStatusRecordAttributes.department = invalidDepartment;
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass if attribute IS an accepted value', () => {
            const validDepartment = 'PRINTING';
            const validStatus = chance.pickone(subDepartmentsGroupedByDepartment[validDepartment]);
            ticketStatusRecordAttributes.department = validDepartment;
            ticketStatusRecordAttributes.departmentStatus = validStatus;
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).toBe(undefined);
        });
    });
    describe('attribute: departmentStatus', () => {
        it('should be of type String', () => {
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            expect(ticketStatusRecord.departmentStatus).toEqual(expect.any(String));
        });

        it('should fail if attribute is NOT an accepted value', () => {
            const invalidDepartmentStatus = chance.string();
            ticketStatusRecordAttributes.departmentStatus = invalidDepartmentStatus;
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass if attribute IS an accepted value', () => {
            const validDepartmentStatus = chance.pickone(getAllSubDepartments());
            ticketStatusRecordAttributes.status = validDepartmentStatus;
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).toBe(undefined);
        });

        it('should pass if departmentStatus is left blank because the department has no statuses', () => {
            const aDepartmentWithoutStatuses = 'COMPLETED';
            ticketStatusRecordAttributes.department = aDepartmentWithoutStatuses;
            delete ticketStatusRecordAttributes.departmentStatus;
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).toBe(undefined);
        });

        it('should fail if departmentStatus is not an allowed status for the given department', () => {
            const aDepartmentWithStatuses = 'PRINTING';
            ticketStatusRecordAttributes.department = aDepartmentWithStatuses;
            delete ticketStatusRecordAttributes.departmentStatus;
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).not.toBe(undefined);
        });
    });
});
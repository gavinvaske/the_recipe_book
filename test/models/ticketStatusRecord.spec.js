const chance = require('chance').Chance();
const TicketStatusRecord = require('../../application/models/ticketStatusRecord');
const {getAllSubDepartments, getAllDepartments} = require('../../application/enums/departmentsEnum');
const mongoose = require('mongoose');

describe('validation', () => {
    let ticketStatusRecordAttributes;

    beforeEach(() => {
        ticketStatusRecordAttributes = {
            ticketId: new mongoose.Types.ObjectId(),
            department: chance.pickone(getAllDepartments()),
            status: chance.pickone(getAllSubDepartments())
        };
    });

    it('should validate if all attributes are defined successfully', () => {
        const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);
    
        const error = ticketStatusRecord.validateSync();

        console.log('type of');
        console.log(typeof ticketStatusRecord.ticketId);

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
            const validDepartment = chance.pickone(getAllDepartments());
            ticketStatusRecordAttributes.department = validDepartment;
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).toBe(undefined);
        });
    });
    describe('attribute: status', () => {
        it('should be of type String', () => {
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            expect(ticketStatusRecord.status).toEqual(expect.any(String));
        });

        it('should fail if attribute is not defined', () => {
            delete ticketStatusRecordAttributes.status;
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail if attribute is NOT an accepted value', () => {
            const invalidStatus = chance.string();
            ticketStatusRecordAttributes.status = invalidStatus;
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass if attribute IS an accepted value', () => {
            const validStatus = chance.pickone(getAllSubDepartments());
            ticketStatusRecordAttributes.status = validStatus;
            const ticketStatusRecord = new TicketStatusRecord(ticketStatusRecordAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).toBe(undefined);
        });
    });
});
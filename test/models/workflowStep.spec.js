const chance = require('chance').Chance();
const WorkflowStep = require('../../application/models/WorkflowStep');
const {getAllSubDepartments, subDepartmentsGroupedByDepartment} = require('../../application/enums/departmentsEnum');
const mongoose = require('mongoose');

describe('validation', () => {
    let workFlowStepAttributes;

    beforeEach(() => {
        let department = 'CUTTING';
        let departmentStatus = chance.pickone(subDepartmentsGroupedByDepartment[department]);

        workFlowStepAttributes = {
            ticketId: new mongoose.Types.ObjectId(),
            department: department,
            departmentStatus: departmentStatus
        };
    });

    it('should validate if all attributes are defined successfully', () => {
        const ticketStatusRecord = new WorkflowStep(workFlowStepAttributes);
    
        const error = ticketStatusRecord.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: ticketId', () => {
        it('should fail if attribute is not defined', () => {
            delete workFlowStepAttributes.ticketId;
            const ticketStatusRecord = new WorkflowStep(workFlowStepAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be a mongoose object ID', () => {
            const ticketStatusRecord = new WorkflowStep(workFlowStepAttributes);

            console.log('testseteestestest');
            console.log(JSON.stringify(ticketStatusRecord.ticketId));

            expect(mongoose.Types.ObjectId.isValid(ticketStatusRecord.ticketId)).toBe(true);
        });
    });
    describe('attribute: department', () => {
        it('should be of type String', () => {
            const ticketStatusRecord = new WorkflowStep(workFlowStepAttributes);

            expect(ticketStatusRecord.department).toEqual(expect.any(String));
        });

        it('should fail if attribute is not defined', () => {
            delete workFlowStepAttributes.department;
            const ticketStatusRecord = new WorkflowStep(workFlowStepAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail if attribute is NOT an accepted value', () => {
            const invalidDepartment = chance.string();
            workFlowStepAttributes.department = invalidDepartment;
            const ticketStatusRecord = new WorkflowStep(workFlowStepAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass if attribute IS an accepted value', () => {
            const validDepartment = 'PRINTING';
            const validStatus = chance.pickone(subDepartmentsGroupedByDepartment[validDepartment]);
            workFlowStepAttributes.department = validDepartment;
            workFlowStepAttributes.departmentStatus = validStatus;
            const ticketStatusRecord = new WorkflowStep(workFlowStepAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).toBe(undefined);
        });
    });
    describe('attribute: departmentStatus', () => {
        it('should be of type String', () => {
            const ticketStatusRecord = new WorkflowStep(workFlowStepAttributes);

            expect(ticketStatusRecord.departmentStatus).toEqual(expect.any(String));
        });

        it('should fail if attribute is NOT an accepted value', () => {
            const invalidDepartmentStatus = chance.string();
            workFlowStepAttributes.departmentStatus = invalidDepartmentStatus;
            const ticketStatusRecord = new WorkflowStep(workFlowStepAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass if attribute IS an accepted value', () => {
            const validDepartmentStatus = chance.pickone(getAllSubDepartments());
            workFlowStepAttributes.status = validDepartmentStatus;
            const ticketStatusRecord = new WorkflowStep(workFlowStepAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).toBe(undefined);
        });

        it('should pass if departmentStatus is left blank because the department has no statuses', () => {
            const aDepartmentWithoutStatuses = 'COMPLETED';
            workFlowStepAttributes.department = aDepartmentWithoutStatuses;
            delete workFlowStepAttributes.departmentStatus;
            const ticketStatusRecord = new WorkflowStep(workFlowStepAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).toBe(undefined);
        });

        it('should fail if departmentStatus is not an allowed status for the given department', () => {
            const aDepartmentWithStatuses = 'PRINTING';
            workFlowStepAttributes.department = aDepartmentWithStatuses;
            delete workFlowStepAttributes.departmentStatus;
            const ticketStatusRecord = new WorkflowStep(workFlowStepAttributes);

            const error = ticketStatusRecord.validateSync();

            expect(error).not.toBe(undefined);
        });
    });
});
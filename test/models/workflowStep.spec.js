const chance = require('chance').Chance();
const WorkflowStep = require('../../application/models/WorkflowStep');
const {departmentToStatusesMappingForTicketObjects} = require('../../application/enums/departmentsEnum');
const mongoose = require('mongoose');

const DEPARTMENT_WITH_STATUSES = 'PRINTING';

describe('validation', () => {
    let workFlowStepAttributes;

    beforeEach(() => {
        let department = DEPARTMENT_WITH_STATUSES;
        let departmentStatus = chance.pickone(departmentToStatusesMappingForTicketObjects[department]);

        workFlowStepAttributes = {
            ticketId: new mongoose.Types.ObjectId(),
            destination: {
                department: department,
                departmentStatus: departmentStatus,
                assignees: [],
                machines: []
            }
        };
    });

    it('should validate if all attributes are defined successfully', () => {
        const workflowStep = new WorkflowStep(workFlowStepAttributes);
    
        const error = workflowStep.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: ticketId', () => {
        it('should fail if attribute is not defined', () => {
            delete workFlowStepAttributes.ticketId;
            const workflowStep = new WorkflowStep(workFlowStepAttributes);

            const error = workflowStep.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be a mongoose object ID', () => {
            const workflowStep = new WorkflowStep(workFlowStepAttributes);

            expect(mongoose.Types.ObjectId.isValid(workflowStep.ticketId)).toBe(true);
        });
    });

    describe('attribute: destination', () => {
        it('should fail validation if attribute is not defined', () => {
            delete workFlowStepAttributes.destination;
            const workflowStep = new WorkflowStep(workFlowStepAttributes);

            const error = workflowStep.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if attribute is not the correct type', () => {
            workFlowStepAttributes.destination = chance.word();
            const workflowStep = new WorkflowStep(workFlowStepAttributes);

            const error = workflowStep.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be a mongoose object with an _id attribute', () => {
            const workflowStep = new WorkflowStep(workFlowStepAttributes);

            expect(workflowStep.destination._id).not.toBe(undefined);
        });
    });
});
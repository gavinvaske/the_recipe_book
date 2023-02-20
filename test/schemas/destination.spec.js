const chance = require('chance').Chance();
const destinationSchema = require('../../application/schemas/destination');
const {departmentToStatusesMappingForTicketObjects} = require('../../application/enums/departmentsEnum');
const mongoose = require('mongoose');

const DEPARTMENT_WITH_STATUSES = 'PRINTING';
const DEPARTMENT_WITHOUT_STATUSES = 'COMPLETED';

describe('validation', () => {
    let destinationAttributes,
        DestinationModel;

    beforeEach(async () => {
        let department = DEPARTMENT_WITH_STATUSES;
        let departmentStatus = chance.pickone(departmentToStatusesMappingForTicketObjects[department]);

        destinationAttributes = {
            department: department,
            departmentStatus: departmentStatus,
            assignee: new mongoose.Types.ObjectId(),
            machine: new mongoose.Types.ObjectId()
        };
        DestinationModel = mongoose.model('Destination', destinationSchema);
    });

    it('should validate if all attributes are defined successfully', async () => {
        let validationError;
        const destination = new DestinationModel(destinationAttributes);

        try {
            await destination.validate();
        } catch (error) {
            validationError = error;
        }

        expect(validationError).toBe(undefined);
    });

    describe('attribute: department', () => {
        it('should be of type String', () => {
            const destination = new DestinationModel(destinationAttributes);

            expect(destination.department).toEqual(expect.any(String));
        });

        it('should fail if attribute is not defined', async () => {
            delete destinationAttributes.department;
            const destination = new DestinationModel(destinationAttributes);
            let validationError;

            try {
                await destination.validate();
            } catch (error) {
                validationError = error;
            }

            expect(validationError).not.toBe(undefined);
        });

        it('should fail if attribute is NOT an accepted value', async () => {
            const invalidDepartment = chance.string();
            destinationAttributes.department = invalidDepartment;
            const destination = new DestinationModel(destinationAttributes);
            let validationError;

            try {
                await destination.validate();
            } catch (error) {
                validationError = error;
            }

            expect(validationError).not.toBe(undefined);
        });

        it('should pass if attribute IS an accepted value', async () => {
            const validDepartment = DEPARTMENT_WITH_STATUSES;
            const validStatus = chance.pickone(departmentToStatusesMappingForTicketObjects[validDepartment]);
            destinationAttributes.department = validDepartment;
            destinationAttributes.departmentStatus = validStatus;
            const destination = new DestinationModel(destinationAttributes);
            let validationError;

            try {
                await destination.validate();
            } catch (error) {
                validationError = error;
            }

            expect(validationError).toBe(undefined);
        });

        it('should pass if attribute IS an accepted value surrounded by whitespace', async () => {
            const whitespaceToTrim = '  ';
            const validDepartment = DEPARTMENT_WITH_STATUSES;
            const validStatus = chance.pickone(departmentToStatusesMappingForTicketObjects[validDepartment]);
            destinationAttributes.department = whitespaceToTrim + validDepartment + whitespaceToTrim;
            destinationAttributes.departmentStatus = whitespaceToTrim + validStatus + whitespaceToTrim;
            const destination = new DestinationModel(destinationAttributes);
            let validationError;

            try {
                await destination.validate();
            } catch (error) {
                validationError = error;
            }

            expect(validationError).toBe(undefined);
        });
    });

    describe('attribute: departmentStatus', () => {
        it('should be of type String', () => {
            const destination = new DestinationModel(destinationAttributes);

            expect(destination.departmentStatus).toEqual(expect.any(String));
        });

        it('should fail if departmentStatus is not a valid departmentStatus a given department', async () => {
            const invalidDepartmentStatus = chance.string();
            destinationAttributes.departmentStatus = invalidDepartmentStatus;
            const destination = new DestinationModel(destinationAttributes);
            let validationError;

            try {
                await destination.validate();
            } catch (error) {
                validationError = error;
            }

            expect(validationError).not.toBe(undefined);
        });

        it('should pass if departmentStatus is left blank because the department has no statuses', async () => {
            destinationAttributes.department = DEPARTMENT_WITHOUT_STATUSES;
            delete destinationAttributes.departmentStatus;
            const destination = new DestinationModel(destinationAttributes);
            let validationError;

            try {
                await destination.validate();
            } catch (error) {
                validationError = error;
            }

            expect(validationError).toBe(undefined);
        });

        it('should fail if departmentStatus is not an allowed status for the given department', async () => {
            destinationAttributes.department = DEPARTMENT_WITH_STATUSES;
            delete destinationAttributes.departmentStatus;
            const destination = new DestinationModel(destinationAttributes);
            let validationError;

            try {
                await destination.validate();
            } catch (error) {
                validationError = error;
            }

            expect(validationError).not.toBe(undefined);
        });
    });

    describe('attribute: assignee', () => {
        it('should have one element which is a valid mongoose objectId', () => {
            destinationAttributes.assignee = new mongoose.Types.ObjectId();
            const destination = new DestinationModel(destinationAttributes);

            expect(mongoose.Types.ObjectId.isValid(destination.assignee)).toBe(true);
        });

        it('should default to an empty array if attribute is not defined', () => {
            delete destinationAttributes.assignee;
            const destination = new DestinationModel(destinationAttributes);

            expect(destination.assignee).not.toBeDefined();
        });
    });

    describe('attribute: machine', () => {
        it('should have one element which is a valid mongoose objectId', () => {
            destinationAttributes.machine = new mongoose.Types.ObjectId();
            const destination = new DestinationModel(destinationAttributes);

            expect(mongoose.Types.ObjectId.isValid(destination.machine)).toBe(true);
        });

        it('should default to an empty array if attribute is not defined', () => {
            delete destinationAttributes.machine;
            const destination = new DestinationModel(destinationAttributes);

            expect(destination.machine).not.toBeDefined();
        });
    });
});
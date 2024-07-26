import Chance from 'chance';
import { destinationSchema } from '../../application/api/schemas/destination';
import mongoose from 'mongoose';

const chance = Chance();

describe('validation', () => {
    let destinationAttributes,
        DestinationModel;

    beforeEach(async () => {
        let department = chance.word();
        let departmentStatus = chance.word();

        destinationAttributes = {
            department: department,
            departmentStatus: departmentStatus,
            assignee: new mongoose.Types.ObjectId(),
            machine: new mongoose.Types.ObjectId()
        };
        DestinationModel = mongoose.model('Destination', destinationSchema);
    });

    it('should validate if all attributes are defined successfully', async () => {
        const destination = new DestinationModel(destinationAttributes);

        const error = destination.validateSync();

        expect(error).toBeUndefined();
    });

    describe('attribute: department', () => {
        it('should be of type String', () => {
            const destination = new DestinationModel(destinationAttributes);

            expect(destination.department).toEqual(expect.any(String));
        });

        it('should fail if attribute is not defined', async () => {
            delete destinationAttributes.department;
            const destination = new DestinationModel(destinationAttributes);

            const error = destination.validateSync();

            expect(error).toBeDefined();
        });

        it('should trim whitespace', async () => {
            const department = chance.word();
            destinationAttributes.department = '  ' + department + '  ';
            const destination = new DestinationModel(destinationAttributes);

            const error = destination.validateSync();

            expect(error).toBeUndefined();
            expect(destination.department).toEqual(department);
        });
    });

    describe('attribute: departmentStatus', () => {
        it('should be of type String', () => {
            const destination = new DestinationModel(destinationAttributes);

            expect(destination.departmentStatus).toEqual(expect.any(String));
        });

        it('should NOT fail if attribute is undefined', async () => {
            delete destinationAttributes.departmentStatus;
            const destination = new DestinationModel(destinationAttributes);

            const error = destination.validateSync();

            expect(error).toBeUndefined();
        });

        it('should trim whitespace', async () => {
            const departmentStatus = chance.word();
            destinationAttributes.departmentStatus = '  ' + departmentStatus + '  ';
            const destination = new DestinationModel(destinationAttributes);

            const error = destination.validateSync();

            expect(error).toBeUndefined();
            expect(destination.departmentStatus).toEqual(departmentStatus);
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

            expect(destination.assignee).toBeUndefined();
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

            expect(destination.machine).toBeUndefined();
        });
    });
});
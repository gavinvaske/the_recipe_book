import Chance from 'chance';
import * as downtimeReasonService from '../../application/services/downtimeReasonService.ts';
import mockDowntimeReasonModel from '../../application/models/downtimeReason.ts';
import { when } from 'jest-when';

const chance = Chance();

jest.mock('../../application/models/downtimeReason.ts', () => {
    const mockedDowntimeReasonModel = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn(),
    };
    return mockedDowntimeReasonModel;
});

describe('downtimeReason test suite', () => {
    beforeEach(() => {
        when(mockDowntimeReasonModel.exec)
            .calledWith()
            .mockResolvedValue([]);
    });

    describe('getDowntimeReasons()', () => {
        it('should return make a request to mongoDb to fetch all downtime reasons', () => {
            downtimeReasonService.getDowntimeReasons();

            expect(mockDowntimeReasonModel.find).toHaveBeenCalledTimes(1);
            expect(mockDowntimeReasonModel.find).toHaveBeenCalledWith();

            expect(mockDowntimeReasonModel.sort).toHaveBeenCalledTimes(1);
            expect(mockDowntimeReasonModel.sort).toHaveBeenCalledWith({reason: 1});

            expect(mockDowntimeReasonModel.exec).toHaveBeenCalledTimes(1);
            expect(mockDowntimeReasonModel.exec).toHaveBeenCalledWith();
        });

        it('should return an empty array when no items exist in the database', async () => {
            const emptyArray = [];
            when(mockDowntimeReasonModel.exec)
                .calledWith()
                .mockResolvedValue(emptyArray);
            const expectedDowntimeReasons = [];

            const actualDowntimeReasons = await downtimeReasonService.getDowntimeReasons();

            expect(actualDowntimeReasons).toEqual(expectedDowntimeReasons);
        });

        it('should return an array of correctly formatted downtimeReasons', async () => {
            const reason1 = chance.string();
            const reason2 = chance.string();
            const reason3 = chance.string();

            const downtimeReasonsInDatabase = [
                {_id: chance.string(), reason: reason1},
                {_id: chance.string(), reason: reason2},
                {_id: chance.string(), reason: reason3},
            ];
            when(mockDowntimeReasonModel.exec)
                .calledWith()
                .mockResolvedValue(downtimeReasonsInDatabase);
            const expectedDowntimeReasons = [reason1, reason2, reason3];

            const actualDowntimeReasons = await downtimeReasonService.getDowntimeReasons();

            expect(actualDowntimeReasons).toEqual(expectedDowntimeReasons);
        });
    });
});
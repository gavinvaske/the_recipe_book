import Chance from 'chance';
import * as downtimeReasonService from '../../application/api/services/downtimeReasonService.ts';
import { DowntimeReasonModel } from '../../application/api/models/downtimeReason.ts';
import { when } from 'jest-when';

const chance = Chance();

jest.mock('../../application/api/models/downtimeReason.ts', () => {
    const mockedDowntimeReasonModel = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn(),
    };
    return {
      DowntimeReasonModel: mockedDowntimeReasonModel
    }
});

describe('downtimeReason test suite', () => {
    beforeEach(() => {
        when(DowntimeReasonModel.exec)
            .calledWith()
            .mockResolvedValue([]);
    });

    describe('getDowntimeReasons()', () => {
        it('should return make a request to mongoDb to fetch all downtime reasons', () => {
            downtimeReasonService.getDowntimeReasons();

            expect(DowntimeReasonModel.find).toHaveBeenCalledTimes(1);
            expect(DowntimeReasonModel.find).toHaveBeenCalledWith();

            expect(DowntimeReasonModel.sort).toHaveBeenCalledTimes(1);
            expect(DowntimeReasonModel.sort).toHaveBeenCalledWith({reason: 1});

            expect(DowntimeReasonModel.exec).toHaveBeenCalledTimes(1);
            expect(DowntimeReasonModel.exec).toHaveBeenCalledWith();
        });

        it('should return an empty array when no items exist in the database', async () => {
            const emptyArray = [];
            when(DowntimeReasonModel.exec)
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
            when(DowntimeReasonModel.exec)
                .calledWith()
                .mockResolvedValue(downtimeReasonsInDatabase);
            const expectedDowntimeReasons = [reason1, reason2, reason3];

            const actualDowntimeReasons = await downtimeReasonService.getDowntimeReasons();

            expect(actualDowntimeReasons).toEqual(expectedDowntimeReasons);
        });
    });
});
import Chance from 'chance';
import { DowntimeLedgerModel } from '../../application/api/models/downtimeLedger';
import mongoose from 'mongoose';
import * as databaseService from '../../application/api/services/databaseService';

const chance = Chance();

describe('validation', () => {
    let downtimeLedgerAttributes;

    beforeEach(() => {
        downtimeLedgerAttributes = {
            ticketId: new mongoose.Types.ObjectId(),
            reason: chance.string(),
            delayDurationInMinutes: chance.d100()
        };
    });

    it('should not fail validation if all attributes are defined correctly', () => {
        const downtimeLedgerRecord = new DowntimeLedgerModel(downtimeLedgerAttributes);

        const error = downtimeLedgerRecord.validateSync();

        expect(error).toBeUndefined();
    });

    describe('attribute: ticketId', () => {
        it('should fail validation if attribute is not defined', () => {
            delete downtimeLedgerAttributes.ticketId;
            const downtimeLedgerRecord = new DowntimeLedgerModel(downtimeLedgerAttributes);

            const error = downtimeLedgerRecord.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type mongoose.ObjectId', () => {
            const downtimeLedgerRecord = new DowntimeLedgerModel(downtimeLedgerAttributes);

            expect(downtimeLedgerRecord.ticketId).toEqual(expect.any(mongoose.Types.ObjectId));
        });
    });

    describe('attribute: reason', () => {
        it('should fail validation if attribute is not defined', () => {
            delete downtimeLedgerAttributes.reason;
            const downtimeLedgerRecord = new DowntimeLedgerModel(downtimeLedgerAttributes);

            const error = downtimeLedgerRecord.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type String', () => {
            const downtimeLedgerRecord = new DowntimeLedgerModel(downtimeLedgerAttributes);

            expect(downtimeLedgerRecord.reason).toEqual(expect.any(String));
        });

        it('should trim attribute', () => {
            const expectedReason = chance.string();
            downtimeLedgerAttributes.reason = '   ' + expectedReason + '  ';
            const downtimeLedgerRecord = new DowntimeLedgerModel(downtimeLedgerAttributes);

            expect(downtimeLedgerRecord.reason).toEqual(expectedReason);
        });
    });

    describe('attribute: delayDurationInMinutes', () => {
        it('should fail validation if attribute is not defined', () => {
            delete downtimeLedgerAttributes.delayDurationInMinutes;
            const downtimeLedgerRecord = new DowntimeLedgerModel(downtimeLedgerAttributes);

            const error = downtimeLedgerRecord.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type Number', () => {
            const downtimeLedgerRecord = new DowntimeLedgerModel(downtimeLedgerAttributes);

            expect(downtimeLedgerRecord.delayDurationInMinutes).toEqual(expect.any(Number));
        });

        it('should fail validation if attribute is less than 1', () => {
            const invalidDuration = chance.integer({max: 0});
            downtimeLedgerAttributes.delayDurationInMinutes = invalidDuration;
            const downtimeLedgerRecord = new DowntimeLedgerModel(downtimeLedgerAttributes);

            const error = downtimeLedgerRecord.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('verify timestamps on created object', () => {
        beforeAll(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.clearDatabase();
        });

        afterAll(async () => {
            await databaseService.closeDatabase();
        });

        describe('verify timestamps on created object', () => {
            it('should have a "createdAt" attribute once object is saved', async () => {
                const downtimeLedgerRecord = new DowntimeLedgerModel(downtimeLedgerAttributes);
                let savedDowntimeLedger = await downtimeLedgerRecord.save({validateBeforeSave: false});
    
                expect(savedDowntimeLedger.createdAt).toBeDefined();
                expect(savedDowntimeLedger.updatedAt).toBeDefined();
            });
        });
    });
});
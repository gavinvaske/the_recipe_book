const chance = require('chance').Chance();
const DowntimeReasonLedger = require('../../application/models/downtimeLedger');
const mongoose = require('mongoose');
const databaseService = require('../../application/services/databaseService');

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
        const downtimeLedgerRecord = new DowntimeReasonLedger(downtimeLedgerAttributes);

        const error = downtimeLedgerRecord.validateSync();

        expect(error).toBeUndefined();
    });

    describe('attribute: ticketId', () => {
        it('should fail validation if attribute is not defined', () => {
            delete downtimeLedgerAttributes.ticketId;
            const downtimeLedgerRecord = new DowntimeReasonLedger(downtimeLedgerAttributes);

            const error = downtimeLedgerRecord.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type mongoose.ObjectId', () => {
            const downtimeLedgerRecord = new DowntimeReasonLedger(downtimeLedgerAttributes);

            expect(downtimeLedgerRecord.ticketId).toEqual(expect.any(mongoose.Types.ObjectId));
        });
    });

    describe('attribute: reason', () => {
        it('should fail validation if attribute is not defined', () => {
            delete downtimeLedgerAttributes.reason;
            const downtimeLedgerRecord = new DowntimeReasonLedger(downtimeLedgerAttributes);

            const error = downtimeLedgerRecord.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type String', () => {
            const downtimeLedgerRecord = new DowntimeReasonLedger(downtimeLedgerAttributes);

            expect(downtimeLedgerRecord.reason).toEqual(expect.any(String));
        });

        it('should trim attribute', () => {
            const expectedReason = chance.string();
            downtimeLedgerAttributes.reason = '   ' + expectedReason + '  ';
            const downtimeLedgerRecord = new DowntimeReasonLedger(downtimeLedgerAttributes);

            expect(downtimeLedgerRecord.reason).toEqual(expectedReason);
        });
    });

    describe('attribute: delayDurationInMinutes', () => {
        it('should fail validation if attribute is not defined', () => {
            delete downtimeLedgerAttributes.delayDurationInMinutes;
            const downtimeLedgerRecord = new DowntimeReasonLedger(downtimeLedgerAttributes);

            const error = downtimeLedgerRecord.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type Number', () => {
            const downtimeLedgerRecord = new DowntimeReasonLedger(downtimeLedgerAttributes);

            expect(downtimeLedgerRecord.delayDurationInMinutes).toEqual(expect.any(Number));
        });

        it('should fail validation if attribute is less than 1', () => {
            const invalidDuration = chance.integer({max: 0});
            downtimeLedgerAttributes.delayDurationInMinutes = invalidDuration;
            const downtimeLedgerRecord = new DowntimeReasonLedger(downtimeLedgerAttributes);

            const error = downtimeLedgerRecord.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('verify timestamps on created object', () => {
        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        describe('verify timestamps on created object', () => {
            it('should have a "createdAt" attribute once object is saved', async () => {
                const downtimeLedgerRecord = new DowntimeReasonLedger(downtimeLedgerAttributes);
                let savedDowntimeLedger = await downtimeLedgerRecord.save({validateBeforeSave: false});
    
                expect(savedDowntimeLedger.createdAt).toBeDefined();
                expect(savedDowntimeLedger.updatedAt).toBeDefined();
            });
        });
    });
});
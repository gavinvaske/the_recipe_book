const chance = require('chance').Chance();
const DowntimeReason = require('../../application/models/downtimeReason');
const databaseService = require('../../application/services/databaseService');

describe('validation', () => {
    let downtimeReasonAttributes;

    beforeEach(() => {
        downtimeReasonAttributes = {
            reason: chance.string()
        };
    });

    it('should not fail validation if all attributes are defined correctly', () => {
        const downtimeReason = new DowntimeReason(downtimeReasonAttributes);

        const error = downtimeReason.validateSync();

        expect(error).toBeUndefined();
    });

    describe('attribute: reason', () => {
        it('should fail validation if attribute is not defined', () => {
            delete downtimeReasonAttributes.reason;
            const downtimeReason = new DowntimeReason(downtimeReasonAttributes);

            const error = downtimeReason.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type String', () => {
            const downtimeReason = new DowntimeReason(downtimeReasonAttributes);

            expect(downtimeReason.reason).toEqual(expect.any(String));
        });

        it('should trim attribute', () => {
            const expectedReason = chance.string();
            downtimeReasonAttributes.reason = '   ' + expectedReason + '  ';
            const downtimeReason = new DowntimeReason(downtimeReasonAttributes);

            expect(downtimeReason.reason).toEqual(expectedReason);
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
                const downtimeReason = new DowntimeReason(downtimeReasonAttributes);
                let savedDowntimeReason = await downtimeReason.save({validateBeforeSave: false});
    
                expect(savedDowntimeReason.createdAt).toBeDefined();
                expect(savedDowntimeReason.updatedAt).toBeDefined();
            });
        });
    });
});
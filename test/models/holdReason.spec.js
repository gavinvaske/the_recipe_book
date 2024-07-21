import Chance from 'chance'
import HoldReason from '../../application/models/holdReason';
import * as databaseService from '../../application/services/databaseService.js';

const chance = Chance();
const DEPARTMENT_NAME = 'PRINTING';

describe('validation', () => {
    let holdReasonAttributes;

    beforeEach(() => {
        holdReasonAttributes = {
            department: DEPARTMENT_NAME,
            reason: chance.string()
        };
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
                const holdReason = new HoldReason(holdReasonAttributes);
                let savedHoldReason = await holdReason.save({validateBeforeSave: false});
    
                expect(savedHoldReason.createdAt).toBeDefined();
            });
    
            it('should have a "updated" attribute once object is saved', async () => {
                const holdReason = new HoldReason(holdReasonAttributes);
                let savedHoldReason = await holdReason.save({validateBeforeSave: false});
    
                expect(savedHoldReason.createdAt).toBeDefined();
            });
        });

        describe('verify soft deletes work', () => {
            it('should be "soft-deletable"', async () => {
                const holdReason = new HoldReason(holdReasonAttributes);
                const holdReasonId = holdReason._id;

                await holdReason.save({validateBeforeSave: false});
                await HoldReason.deleteById(holdReasonId);

                const softDeletedHoldReason = await HoldReason.findOneDeleted({_id: holdReasonId}).exec();

                expect(softDeletedHoldReason).toBeDefined();
                expect(softDeletedHoldReason.deleted).toBe(true);
            });
        });
    });

    describe('attribute: department', () => {
        it('should be of type String', () => {
            const holdReason = new HoldReason(holdReasonAttributes);

            expect(holdReason.department).toEqual(expect.any(String));
        });

        it('should fail if attribute is not defined', async () => {
            delete holdReasonAttributes.department;
            const holdReason = new HoldReason(holdReasonAttributes);

            const error = holdReason.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail if attribute is NOT an accepted value', async () => {
            const invalidDepartment = chance.string();
            holdReasonAttributes.department = invalidDepartment;
            const holdReason = new HoldReason(holdReasonAttributes);

            const error = holdReason.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass if attribute IS an accepted value', () => {
            const validDepartment = DEPARTMENT_NAME;
            holdReasonAttributes.department = validDepartment;
            const holdReason = new HoldReason(holdReasonAttributes);

            const error = holdReason.validateSync();

            expect(error).toBe(undefined);
        });

        it('should pass if attribute IS an accepted value surrounded by whitespace', () => {
            const whitespaceToTrim = '  ';
            const validDepartment = DEPARTMENT_NAME;
            holdReasonAttributes.department = whitespaceToTrim + validDepartment + whitespaceToTrim;
            const holdReason = new HoldReason(holdReasonAttributes);

            const error = holdReason.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: reason', () => {
        it('should be of type String', () => {
            const holdReason = new HoldReason(holdReasonAttributes);

            expect(holdReason.reason).toEqual(expect.any(String));
        });

        it('should fail if attribute is not defined', () => {
            delete holdReasonAttributes.reason;
            const holdReason = new HoldReason(holdReasonAttributes);

            const error = holdReason.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail if attribute is empty', () => {
            holdReasonAttributes.reason = '';
            const holdReason = new HoldReason(holdReasonAttributes);

            const error = holdReason.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should trim the attribute', () => {
            const reason = chance.string().toUpperCase();
            holdReasonAttributes.reason = ' ' + reason + '   ';
            const holdReason = new HoldReason(holdReasonAttributes);

            expect(holdReason.reason).toBe(reason);
        });

        it('should convert to uppercase', () => {
            const lowerCaseReason = chance.string({casing: 'lower'});
            holdReasonAttributes.reason = lowerCaseReason;
            const holdReason = new HoldReason(holdReasonAttributes);

            expect(holdReason.reason).toBe(lowerCaseReason.toUpperCase());
        });
    });
});
import Chance from 'chance';
import { CreditTermModel } from '../../application/api/models/creditTerm.ts';
import * as databaseService from '../../application/api/services/databaseService';

const chance = Chance();

describe('validation', () => {
    let creditTermAttributes;

    beforeEach(() => {
        creditTermAttributes = {
            description: chance.string()
        };
    });

    it('should have the correct indexes', async () => {
        const indexMetaData = CreditTermModel.schema.indexes();
        const expectedIndexes = ['description'];

        console.log('indexMetaData: ', indexMetaData);

        const isEveryExpectedIndexActuallyAnIndex = expectedIndexes.every((expectedIndex) => {
            return indexMetaData.some((metaData) => {
                const index = Object.keys(metaData[0])[0];
                if (index === expectedIndex) return true;
            });
        });

        expect(isEveryExpectedIndexActuallyAnIndex).toBe(true);
    });

    it('should not fail validation if all attributes are defined correctly', () => {
        const creditTerm = new CreditTermModel(creditTermAttributes);

        const error = creditTerm.validateSync();

        expect(error).toBeUndefined();
    });

    describe('attribute: description', () => {
        it('should fail validation if attribute is not defined', () => {
            delete creditTermAttributes.description;
            const creditTerm = new CreditTermModel(creditTermAttributes);

            const error = creditTerm.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type String', () => {
            const creditTerm = new CreditTermModel(creditTermAttributes);

            expect(creditTerm.description).toEqual(expect.any(String));
        });

        it('should upper case attribute', () => {
            const lowerCaseDescription = chance.string().toLowerCase();
            creditTermAttributes.description = lowerCaseDescription;

            const creditTerm = new CreditTermModel(creditTermAttributes);

            expect(creditTerm.description).toEqual(lowerCaseDescription.toUpperCase());
        });

        it('should trim attribute', () => {
            const expectedDescription = chance.string().toUpperCase();
            creditTermAttributes.description = '   ' + expectedDescription + '  ';
            const downtimeReason = new CreditTermModel(creditTermAttributes);

            expect(downtimeReason.description).toEqual(expectedDescription);
        });
    });

    describe('verify database interactions', () => {
        beforeAll(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.clearDatabase();
        });

        afterAll(async () => {
            await databaseService.closeDatabase();
        });

        it('should soft delete items', async () => {
            const creditTerm = new CreditTermModel(creditTermAttributes);
            const id = creditTerm._id;

            await creditTerm.save();
            await CreditTermModel.deleteById(id);

            const softDeletedAdhesiveCategory = await CreditTermModel.findOneDeleted({_id: id}).exec();

            expect(softDeletedAdhesiveCategory).toBeDefined();
            expect(softDeletedAdhesiveCategory.deleted).toBe(true);
        });

        it('should have a "createdAt" attribute once object is saved', async () => {
            const creditTerm = new CreditTermModel(creditTermAttributes);
            let savedCreditTerm = await creditTerm.save({ validateBeforeSave: false });

            expect(savedCreditTerm.createdAt).toBeDefined();
            expect(savedCreditTerm.updatedAt).toBeDefined();
        });
    });
});
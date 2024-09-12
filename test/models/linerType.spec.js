import Chance from 'chance';
import { LinerTypeModel } from '../../application/api/models/linerType.ts';
import * as databaseService from '../../application/api/services/databaseService';

const chance = Chance();

describe('linerType validation', () => {
    let linerTypeAttributes;
  
    beforeEach(() => {
        linerTypeAttributes = {
            name: chance.string() 
        };
    });

    it('should have the correct indexes', async () => {
        const indexMetaData = LinerTypeModel.schema.indexes();
        const expectedIndexes = ['name'];

        console.log('indexMetaData: ', indexMetaData);

        const isEveryExpectedIndexActuallyAnIndex = expectedIndexes.every((expectedIndex) => {
            return indexMetaData.some((metaData) => {
                const index = Object.keys(metaData[0])[0];
                if (index === expectedIndex) return true;
            });
        });

        expect(isEveryExpectedIndexActuallyAnIndex).toBe(true);
    });

    it('should throw error when invalid attribute is set', async () => {
        const unknownAttribute = chance.string();
        linerTypeAttributes[unknownAttribute] = chance.string();
        let errorMessage;

        try {
            new LinerTypeModel(linerTypeAttributes);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBeDefined();  
    });

    describe('attribute: name', () => {
        it('should be required', () => {
            delete linerTypeAttributes.name;
            const linerType = new LinerTypeModel(linerTypeAttributes);
      
            const error = linerType.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a string', () => {
            const linerType = new LinerTypeModel(linerTypeAttributes);

            expect(linerType.name ).toEqual(expect.any(String));
        });

        it('should trim string before saving', () => {
            const expectedName = chance.string().toUpperCase();
            linerTypeAttributes.name = `  ${expectedName}  `;
            const linerType = new LinerTypeModel(linerTypeAttributes);

            expect(linerType.name).toBe(expectedName);
        });

        it('should uppercase name', () => {
            const lowerCaseName = chance.string().toLowerCase();
            linerTypeAttributes.name = lowerCaseName;
            const linerType = new LinerTypeModel(linerTypeAttributes);

            expect(linerType.name).toBe(lowerCaseName.toUpperCase());
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
  
        it('should have timestamps', async () => {
            const linerType = new LinerTypeModel(linerTypeAttributes);

            const savedLinerType = await linerType.save();
      
            expect(savedLinerType.createdAt).toBeDefined();
            expect(savedLinerType.updatedAt).toBeDefined();
        });

        it('should be soft deletable', async () => {
            const linerType = new LinerTypeModel(linerTypeAttributes);
            const id = linerType._id;

            await linerType.save();
            await LinerTypeModel.deleteById(id);

            const softDeletedAdhesiveCategory = await LinerTypeModel.findOneDeleted({ _id: id }).exec();

            expect(softDeletedAdhesiveCategory).toBeDefined();
            expect(softDeletedAdhesiveCategory.deleted).toBe(true);
        });

        it('should be unique', async () => {
            const name = '123456789';
            linerTypeAttributes.name = name;
            const linerType1 = new LinerTypeModel(linerTypeAttributes);
            const linerType2 = new LinerTypeModel(linerTypeAttributes);

            await linerType1.save().then(async () => {
                await expect(linerType2.save()).rejects.toThrow(Error);
            });
        });
    });
});
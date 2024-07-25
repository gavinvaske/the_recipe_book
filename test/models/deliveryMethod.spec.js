import Chance from 'chance';
import { DeliveryMethodModel } from '../../application/api/models/deliveryMethod.ts';
import * as databaseService from '../../application/api/services/databaseService';

const chance = Chance();

describe('File: deliveryMethod.js', () => {
    let deliveryMethodAttributes;

    beforeEach(() => {
        deliveryMethodAttributes = {
            name: chance.string()
        };
    });

    it('should have the correct indexes', async () => {
        const indexMetaData = DeliveryMethodModel.schema.indexes();
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

    describe('attribute: name', () => {
        it('should be a string', () => {
            const deliveryMethod = new DeliveryMethodModel(deliveryMethodAttributes);

            expect(deliveryMethod.name).toEqual(expect.any(String));
        });
        it('should be required', () => {
            delete deliveryMethodAttributes.name;
            const deliveryMethod = new DeliveryMethodModel(deliveryMethodAttributes);

            const error = deliveryMethod.validateSync();

            expect(error).toBeDefined();
        });

        it('should auto uppercase', () => {
            const lowerCaseDeliveryMethod = chance.string().toLowerCase();
            deliveryMethodAttributes.name = lowerCaseDeliveryMethod;
            
            const deliveryMethod = new DeliveryMethodModel(deliveryMethodAttributes);

            expect(deliveryMethod.name).toEqual(lowerCaseDeliveryMethod.toUpperCase());
        });

        it('should trim whitespace', () => {
            const expectedName = chance.string().toUpperCase();
            deliveryMethodAttributes.name = ` ${expectedName} `;
            
            const deliveryMethod = new DeliveryMethodModel(deliveryMethodAttributes);
            
            expect(deliveryMethod.name).toEqual(expectedName);
        });
    });

    describe('database interactions', () => {
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
            const deliveryMethod = new DeliveryMethodModel(deliveryMethodAttributes);
            const id = deliveryMethod._id;

            await deliveryMethod.save();
            await DeliveryMethodModel.deleteById(id);

            const softDeletedDeliveryMethod = await DeliveryMethodModel.findOneDeleted({ _id: id }).exec();

            expect(softDeletedDeliveryMethod).toBeDefined();
            expect(softDeletedDeliveryMethod.deleted).toBe(true);
        });

        it('should have timestamps', async () => {
            const deliveryMethod = new DeliveryMethodModel(deliveryMethodAttributes);
            let savedDeliveryMethod = await deliveryMethod.save();

            expect(savedDeliveryMethod.createdAt).toBeDefined();
            expect(savedDeliveryMethod.updatedAt).toBeDefined();
        });
    });
});
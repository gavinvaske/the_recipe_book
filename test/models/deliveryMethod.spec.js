const chance = require('chance').Chance();
const DeliveryMethod = require('../../application/models/deliveryMethod');
const databaseService = require('../../application/services/databaseService');

describe('File: deliveryMethod.js', () => {
    let deliveryMethodAttributes;

    beforeEach(() => {
        deliveryMethodAttributes = {
            name: chance.string()
        };
    });

    describe('attribute: name', () => {
        it('should be a string', () => {
            const deliveryMethod = new DeliveryMethod(deliveryMethodAttributes);

            expect(deliveryMethod.name).toEqual(expect.any(String));
        });
        it('should be required', () => {
            delete deliveryMethodAttributes.name;
            const deliveryMethod = new DeliveryMethod(deliveryMethodAttributes);

            const error = deliveryMethod.validateSync();

            expect(error).toBeDefined();
        });

        it('should auto uppercase', () => {
            const lowerCaseDeliveryMethod = chance.string().toLowerCase();
            deliveryMethodAttributes.name = lowerCaseDeliveryMethod;
            
            const deliveryMethod = new DeliveryMethod(deliveryMethodAttributes);

            expect(deliveryMethod.name).toEqual(lowerCaseDeliveryMethod.toUpperCase());
        });

        it('should trim whitespace', () => {
            const expectedName = chance.string().toUpperCase();
            deliveryMethodAttributes.name = ` ${expectedName} `;
            
            const deliveryMethod = new DeliveryMethod(deliveryMethodAttributes);
            
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
            const deliveryMethod = new DeliveryMethod(deliveryMethodAttributes);
            const id = deliveryMethod._id;

            await deliveryMethod.save();
            await DeliveryMethod.deleteById(id);

            const softDeletedDeliveryMethod = await DeliveryMethod.findOneDeleted({ _id: id }).exec();

            expect(softDeletedDeliveryMethod).toBeDefined();
            expect(softDeletedDeliveryMethod.deleted).toBe(true);
        });

        it('should have timestamps', async () => {
            const deliveryMethod = new DeliveryMethod(deliveryMethodAttributes);
            let savedDeliveryMethod = await deliveryMethod.save();

            expect(savedDeliveryMethod.createdAt).toBeDefined();
            expect(savedDeliveryMethod.updatedAt).toBeDefined();
        });
    });
});
const chance = require('chance').Chance();
const AdhesiveCategoryModel = require('../../application/models/adhesiveCategory');
const databaseService = require('../../application/services/databaseService');

describe('validation', () => {
    let adhesiveCategoryAttributes;

    beforeEach(() => {
        adhesiveCategoryAttributes = {
            name: chance.string()
        };
    });

    it('should not fail validation if all attributes are defined correctly', () => {
        const adhesiveCategory = new AdhesiveCategoryModel(adhesiveCategoryAttributes);

        const error = adhesiveCategory.validateSync();

        expect(error).toBeUndefined();
    });

    describe('attribute: name', () => {
        it('should be of type String', () => {
            const adhesiveCategory = new AdhesiveCategoryModel(adhesiveCategoryAttributes);

            expect(adhesiveCategory.name).toEqual(expect.any(String));
        });

        it('should fail validation if attribute is not defined', () => {
            delete adhesiveCategoryAttributes.name;
            const adhesiveCategory = new AdhesiveCategoryModel(adhesiveCategoryAttributes);

            const error = adhesiveCategory.validateSync();

            expect(error).toBeDefined();
        });

        it('should trim attribute', () => {
            const expectedName = chance.string();
            adhesiveCategoryAttributes.name = '   ' + expectedName + '  ';
            const downtimeReason = new AdhesiveCategoryModel(adhesiveCategoryAttributes);

            expect(downtimeReason.name).toEqual(expectedName);
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
                const adhesiveCategory = new AdhesiveCategoryModel(adhesiveCategoryAttributes);
                let savedAdhesiveCategory = await adhesiveCategory.save({ validateBeforeSave: false });

                expect(savedAdhesiveCategory.createdAt).toBeDefined();
                expect(savedAdhesiveCategory.updatedAt).toBeDefined();
            });
        });
    });
});
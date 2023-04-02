const chance = require('chance').Chance();
const MaterialCategoryModel = require('../../application/models/materialCategory');
const databaseService = require('../../application/services/databaseService');

describe('validation', () => {
    let materialCategoryAttributes;

    beforeEach(() => {
        materialCategoryAttributes = {
            name: chance.word()
        }
    });

    it('should validate when required attributes are defined', () => {
        const materialCategory = new MaterialCategoryModel(materialCategoryAttributes);

        const error = materialCategory.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: name', () => {
        it('should fail validation if attribute is not defined', () => {
            delete materialCategoryAttributes.name;
            const materialCategory = new MaterialCategoryModel(materialCategoryAttributes);

            const error = materialCategory.validateSync();

            expect(error).toBeDefined();
        });

        it('should trim whitespace', () => {
            const name = chance.word();
            materialCategoryAttributes.name = '  ' + name + ' ';

            const materialCategory = new MaterialCategoryModel(materialCategoryAttributes);

            expect(materialCategory.name).toEqual(name.toUpperCase());
        });

        it('should convert to uppercase', () => {
            const name = chance.word();
            materialCategoryAttributes.name = '  ' + name + ' ';

            const materialCategory = new MaterialCategoryModel(materialCategoryAttributes);

            expect(materialCategory.name).toEqual(name.toUpperCase());
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
                const materialCategory = new MaterialCategoryModel(materialCategoryAttributes);
                let savedMaterialCategory = await materialCategory.save();
    
                expect(savedMaterialCategory.createdAt).toBeDefined();
                expect(savedMaterialCategory.updatedAt).toBeDefined();
            });
        });
    });
});
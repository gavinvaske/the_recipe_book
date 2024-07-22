import Chance from 'chance';
import MaterialCategoryModel from '../../application/models/materialCategory';
import * as databaseService from '../../application/services/databaseService.js';

const chance = Chance();

describe('validation', () => {
    let materialCategoryAttributes;

    beforeEach(() => {
        materialCategoryAttributes = {
            name: chance.word()
        };
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

        it('should fail validation if attribute is empty', () => {
            materialCategoryAttributes.name = '';
            const materialCategory = new MaterialCategoryModel(materialCategoryAttributes);

            const error = materialCategory.validateSync();

            expect(error).toBeDefined();
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

        it('should have a "createdAt" attribute once object is saved', async () => {
            const materialCategory = new MaterialCategoryModel(materialCategoryAttributes);
            let savedMaterialCategory = await materialCategory.save();

            expect(savedMaterialCategory.createdAt).toBeDefined();
            expect(savedMaterialCategory.updatedAt).toBeDefined();
        });

        it('should soft delete items', async () => {
            const materialCategory = new MaterialCategoryModel(materialCategoryAttributes);
            const materialCategoryId = materialCategory._id;

            await materialCategory.save();
            await MaterialCategoryModel.deleteById(materialCategoryId);

            const softDeletedMaterialCategory = await MaterialCategoryModel.findOneDeleted({_id: materialCategoryId}).exec();

            expect(softDeletedMaterialCategory).toBeDefined();
            expect(softDeletedMaterialCategory.deleted).toBe(true);
        });
    });
});
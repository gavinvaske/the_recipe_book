const mongoose = require('mongoose');
const chance = require('chance').Chance();
const MaterialInventoryEntry = require('../../application/models/materialInventoryEntry');
const databaseService = require('../../application/services/databaseService');

describe('File: materialInventoryEntry', () => {
    let materialInventoryEntryAttributes;

    beforeEach(() => {
        materialInventoryEntryAttributes = {
            material: new mongoose.Types.ObjectId(),
            length: chance.integer(),
            notes: chance.string()
        };
    });

    it('should validate successfully', () => {
        const materialInventoryEntry = new MaterialInventoryEntry(materialInventoryEntryAttributes);

        const error = materialInventoryEntry.validateSync();

        expect(error).toBeUndefined();
    });

    it('should throw an error if an unknown attribute is defined', () => {
        const unknownAttribute = chance.string();
        materialInventoryEntryAttributes[unknownAttribute] = chance.string();

        expect(() => new MaterialInventoryEntry(materialInventoryEntryAttributes)).toThrow();
    });

    describe('attribute: material', () => {
        it('should be required', () => {
            delete materialInventoryEntryAttributes.material;
            const materialInventoryEntry = new MaterialInventoryEntry(materialInventoryEntryAttributes);

            const error = materialInventoryEntry.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail if not a valid mongoose object id', () => {
            const invalidValues = [chance.integer(), chance.word()];
            materialInventoryEntryAttributes.material = chance.pickone(invalidValues);
            const materialInventoryEntry = new MaterialInventoryEntry(materialInventoryEntryAttributes);

            const error = materialInventoryEntry.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: length', () => {
        it('should be required', () => {
            delete materialInventoryEntryAttributes.length;
            const materialInventoryEntry = new MaterialInventoryEntry(materialInventoryEntryAttributes);

            const error = materialInventoryEntry.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            const materialInventoryEntry = new MaterialInventoryEntry(materialInventoryEntryAttributes);
      
            expect(materialInventoryEntry.length).toEqual(expect.any(Number));
        });

        it('should be allowed to be negative', () => {
            materialInventoryEntryAttributes.length = chance.integer({max: -1});
            const materialInventoryEntry = new MaterialInventoryEntry(materialInventoryEntryAttributes);

            const error = materialInventoryEntry.validateSync();

            expect(error).toBeUndefined();
        });
    });

    describe('attribute: notes', () => {
        it('should not be required', () => {
            delete materialInventoryEntryAttributes.notes;
            const materialInventoryEntry = new MaterialInventoryEntry(materialInventoryEntryAttributes);

            const error = materialInventoryEntry.validateSync();

            expect(error).toBeUndefined();
        });

        it('should be a string', () => {
            const materialInventoryEntry = new MaterialInventoryEntry(materialInventoryEntryAttributes);

            expect(materialInventoryEntry.notes).toEqual(expect.any(String));
        });

        it('should be trimmed', () => {
            const expectedNotes = chance.string();
            materialInventoryEntryAttributes.notes = `  ${expectedNotes}   `;
            const materialInventoryEntry = new MaterialInventoryEntry(materialInventoryEntryAttributes);

            expect(materialInventoryEntry.notes).toEqual(expectedNotes);
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
            const materialInventoryEntry = new MaterialInventoryEntry(materialInventoryEntryAttributes);

            const savedItem = await materialInventoryEntry.save();

            expect(savedItem.createdAt).toBeDefined();
            expect(savedItem.updatedAt).toBeDefined();
        });

        it('should be soft deletable', async () => {
            const materialInventoryEntry = new MaterialInventoryEntry(materialInventoryEntryAttributes);
            const id = materialInventoryEntry._id;

            await materialInventoryEntry.save();
            await MaterialInventoryEntry.deleteById(id);

            const softDeletedItem = await MaterialInventoryEntry.findOneDeleted({_id: id}).exec();

            expect(softDeletedItem).toBeDefined();
            expect(softDeletedItem.deleted).toBe(true);
        });
    });
});
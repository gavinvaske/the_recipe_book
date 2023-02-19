const dieLineSchema = require('../../application/schemas/dieLine');
const chance = require('chance').Chance();
const mongoose = require('mongoose');
const databaseService = require('../../application/services/databaseService');

describe('validation', () => {
    let dieLineAttributes,
        DieLineModel;

    beforeEach(() => {
        dieLineAttributes = {
            title: chance.string(),
            description: '',
            fileUploads: []
        };
        DieLineModel = mongoose.model('File', dieLineSchema);
    });

    it('should validate if all attributes are defined successfully', () => {
        const dieLineCard = new DieLineModel(dieLineAttributes);

        const error = dieLineCard.validateSync();

        expect(error).toBe(undefined);
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
                const dieLine = new DieLineModel(dieLineAttributes);
                let savedDieLine = await dieLine.save({validateBeforeSave: false});
    
                expect(savedDieLine.createdAt).toBeDefined();
            });
    
            it('should have a "updated" attribute once object is saved', async () => {
                const dieLine = new DieLineModel(dieLineAttributes);
                let savedDieLine = await dieLine.save({validateBeforeSave: false});
    
                expect(savedDieLine.createdAt).toBeDefined();
            });
        });
    });

    describe('attribute: title', () => {
        it('should contain attribute', () => {
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.title).toBeDefined();
        });

        it('should fail validation if attribute is not defined', () => {
            delete dieLineAttributes.title;
            const dieLine = new DieLineModel(dieLineAttributes);

            const error = dieLine.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type String', () => {
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.title).toEqual(expect.any(String));
        });
    });

    describe('attribute: description', () => {
        it('should contain attribute', () => {
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.description).toBeDefined();
        });

        it('should NOT fail validation if attribute is missing', () => {
            delete dieLineAttributes.description;
            const dieLine = new DieLineModel(dieLineAttributes);

            const error = dieLine.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type String', () => {
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.description).toEqual(expect.any(String));
        });
    });

    describe('attribute: fileUploads', () => {
        it('should contain attribute', () => {
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.fileUploads).toBeDefined();
        });

        it('should NOT fail validation if attribute is missing and default to an empty array', () => {
            delete dieLineAttributes.fileUploads;
            const dieLine = new DieLineModel(dieLineAttributes);

            const error = dieLine.validateSync();

            expect(error).toBe(undefined);
            expect(dieLine.fileUploads).toEqual([]);
        });

        it('should be the correct object', () => {
            const file = {
                url: chance.url(),
                fileName: chance.string()
            }
            const expectedFileUploads = [
                file
            ]
            dieLineAttributes.fileUploads = expectedFileUploads
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.fileUploads.length).toEqual(expectedFileUploads.length);
            expect(dieLine.fileUploads[0]).toEqual(expect.objectContaining(file));
            expect(dieLine.fileUploads[0]._id).toBeDefined()
        });
    });
});
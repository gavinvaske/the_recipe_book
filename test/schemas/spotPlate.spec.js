const spotPlateSchema = require('../../application/schemas/spotPlate');
const chance = require('chance').Chance();
const mongoose = require('mongoose');
const databaseService = require('../../application/services/databaseService');

describe('validation', () => {
    let spotPlateAttributes,
        SpotPlateModel;

    beforeEach(() => {
        spotPlateAttributes = {
            title: chance.string(),
            description: '',
            fileUploads: []
        };
        SpotPlateModel = mongoose.model('File', spotPlateSchema);
    });

    it('should validate if all attributes are defined successfully', () => {
        const spotPlate = new SpotPlateModel(spotPlateAttributes);

        const error = spotPlate.validateSync();

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
                const spotPlate = new SpotPlateModel(spotPlateAttributes);
                let savedSpotPlate = await spotPlate.save({validateBeforeSave: false});

                console.log(`blah: ${JSON.stringify(savedSpotPlate)}`);
    
                expect(savedSpotPlate.createdAt).toBeDefined();
            });
    
            it('should have a "updated" attribute once object is saved', async () => {
                const spotPlate = new SpotPlateModel(spotPlateAttributes);
                let savedSpotPlate = await spotPlate.save({validateBeforeSave: false});
    
                expect(savedSpotPlate.createdAt).toBeDefined();
            });
        });
    });

    describe('attribute: title', () => {
        it('should contain attribute', () => {
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.title).toBeDefined();
        });

        it('should fail validation if attribute is not defined', () => {
            delete spotPlateAttributes.title;
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            const error = spotPlate.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type String', () => {
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.title).toEqual(expect.any(String));
        });
    });

    describe('attribute: description', () => {
        it('should contain attribute', () => {
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.description).toBeDefined();
        });

        it('should NOT fail validation if attribute is missing', () => {
            delete spotPlateAttributes.description;
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            const error = spotPlate.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type String', () => {
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.description).toEqual(expect.any(String));
        });
    });

    describe('attribute: fileUploads', () => {
        it('should contain attribute', () => {
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.fileUploads).toBeDefined();
        });

        it('should NOT fail validation if attribute is missing and default to an empty array', () => {
            delete spotPlateAttributes.fileUploads;
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            const error = spotPlate.validateSync();

            expect(error).toBe(undefined);
            expect(spotPlate.fileUploads).toEqual([]);
        });

        it('should be the correct object', () => {
            const file = {
                url: chance.url(),
                fileName: chance.string()
            }
            const expectedFileUploads = [
                file
            ]
            spotPlateAttributes.fileUploads = expectedFileUploads
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.fileUploads.length).toEqual(expectedFileUploads.length);
            expect(spotPlate.fileUploads[0]).toEqual(expect.objectContaining(file));
            expect(spotPlate.fileUploads[0]._id).toBeDefined()
        });
    });
});
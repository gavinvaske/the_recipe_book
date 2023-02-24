const fileSchema = require('../../application/schemas/s3File');
const chance = require('chance').Chance();
const mongoose = require('mongoose');

describe('validation', () => {
    let fileAttributes,
        FileModel;

    beforeEach(() => {
        fileAttributes = {
            url: chance.url(),
            fileName: chance.string()
        };
        FileModel = mongoose.model('File', fileSchema);
    });

    it('should validate if all attributes are defined successfully', () => {
        const file = new FileModel(fileAttributes);

        const error = file.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: url', () => {
        it('should contain attribute', () => {
            const file = new FileModel(fileAttributes);
    
            expect(file.url).toBeDefined();
        });

        it('should fail validation if url is not defined', () => {
            delete fileAttributes.url;
            const file = new FileModel(fileAttributes);

            const error = file.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail validation if url is not a valid URl', () => {
            const invalidUrl = chance.word();
            fileAttributes.url = invalidUrl;
            const file = new FileModel(fileAttributes);

            const error = file.validateSync();
    
            expect(error).not.toBe(undefined);
        });
    });

    describe('attribute: fileName', () => {
        it('should contain attribute', () => {
            const file = new FileModel(fileAttributes);
    
            expect(file.fileName).toBeDefined();
        });

        it('should fail validation if url is not defined', () => {
            delete fileAttributes.fileName;
            const file = new FileModel(fileAttributes);

            const error = file.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should trim leading and trailing whitespace', () => {
            const expectedFileName = fileAttributes.fileName;
            fileAttributes.fileName = ' ' + expectedFileName + '  ';
            const file = new FileModel(fileAttributes);
    
            expect(file.fileName).toBe(expectedFileName);
        });

        it('should be of type String', () => {
            const file = new FileModel(fileAttributes);

            expect(file.fileName).toEqual(expect.any(String));
        });
    });
});
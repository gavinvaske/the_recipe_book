const s3FileSchema = require('../../application/schemas/s3File');
const chance = require('chance').Chance();
import mongoose from 'mongoose'

describe('validation', () => {
    let s3FileAttributes,
        S3FileModel;

    beforeEach(() => {
        s3FileAttributes = {
            url: chance.url(),
            fileName: chance.string(),
            bucket: chance.string()
        };
        S3FileModel = mongoose.model('s3File', s3FileSchema);
    });

    it('should validate if all attributes are defined successfully', () => {
        const file = new S3FileModel(s3FileAttributes);

        const error = file.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: url', () => {
        it('should contain attribute', () => {
            const file = new S3FileModel(s3FileAttributes);
    
            expect(file.url).toBeDefined();
        });

        it('should be alias-able using "Location"', () => {
            delete s3FileAttributes.url;
            
            const url = chance.string();
            s3FileAttributes.Location = url;
    
            const file = new S3FileModel(s3FileAttributes);
    
            expect(file.url).toEqual(url);
        });

        it('should fail validation if url is not defined', () => {
            delete s3FileAttributes.url;
            const file = new S3FileModel(s3FileAttributes);

            const error = file.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail validation if url is not a valid URl', () => {
            const invalidUrl = chance.word();
            s3FileAttributes.url = invalidUrl;
            const file = new S3FileModel(s3FileAttributes);

            const error = file.validateSync();
    
            expect(error).not.toBe(undefined);
        });
    });

    describe('attribute: fileName', () => {
        it('should contain attribute', () => {
            const file = new S3FileModel(s3FileAttributes);
    
            expect(file.fileName).toBeDefined();
        });

        it('should be alias-able using "Key"', () => {
            delete s3FileAttributes.fileName;
            
            const fileName = chance.string();
            s3FileAttributes.Key = fileName;

            const file = new S3FileModel(s3FileAttributes);

            expect(file.fileName).toEqual(fileName);
        });

        it('should fail validation if url is not defined', () => {
            delete s3FileAttributes.fileName;
            const file = new S3FileModel(s3FileAttributes);

            const error = file.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should trim leading and trailing whitespace', () => {
            const expectedFileName = s3FileAttributes.fileName;
            s3FileAttributes.fileName = ' ' + expectedFileName + '  ';
            const file = new S3FileModel(s3FileAttributes);
    
            expect(file.fileName).toBe(expectedFileName);
        });

        it('should be of type String', () => {
            const file = new S3FileModel(s3FileAttributes);

            expect(file.fileName).toEqual(expect.any(String));
        });
    });

    describe('attribute: bucket', () => {
        it('should fail validation if attribute is not defined', () => {
            delete s3FileAttributes.bucket;
            const file = new S3FileModel(s3FileAttributes);

            const error = file.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be alias-able using "Bucket"', () => {
            delete s3FileAttributes.bucket;

            const bucket = chance.string();
            s3FileAttributes.Bucket = bucket;

            const file = new S3FileModel(s3FileAttributes);

            expect(file.bucket).toEqual(bucket);
        });

        it('should be of type String', () => {
            s3FileAttributes.bucket = chance.integer();
            const file = new S3FileModel(s3FileAttributes);

            expect(file.bucket).toEqual(expect.any(String));
        });

        it('should trim leading and trailing whitespace', () => {
            const expectedBucket = s3FileAttributes.bucket;
            s3FileAttributes.bucket = ' ' + expectedBucket + '  ';
            const file = new S3FileModel(s3FileAttributes);
    
            expect(file.bucket).toBe(expectedBucket);
        });
    });
});
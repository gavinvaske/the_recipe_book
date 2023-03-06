const s3Service = require('../../application/services/s3Service');
const awsMock = require('aws-sdk');
const chance = require('chance').Chance();
const mimeMock = require('mime');

jest.mock('mime');

jest.mock('aws-sdk', () => {
    const mockedS3 = {
        deleteObjects: jest.fn().mockReturnThis(),
        upload: jest.fn().mockReturnThis(),
        promise: jest.fn(),
    };
    return { S3: jest.fn(() => mockedS3) };
});

const PDF_CONTENT_TYPE = 'application/pdf';

function buildFileDeleteRequest(file) {
    return {
        Key: file.fileName
    };
}

function buildFileCreateRequest(fileName, fileContents) {
    return {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileContents,
        ContentType: PDF_CONTENT_TYPE
    };
}

function createPdfFile() {
    return {
        fileName: chance.word(),
        fileContents: chance.word()
    };
}

describe('s3Service test suite', () => {
    afterAll(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        mimeMock.getType.mockReturnValue(PDF_CONTENT_TYPE);
    });

    describe('deleteS3Objects', () => {
        it('should not send request to delete files if an empty list of files are passed in', async () => {
            const mockedS3 = new awsMock.S3();
            const emptyList = [];

            await s3Service.deleteS3Objects(emptyList);
    
            expect(mockedS3.deleteObjects).toHaveBeenCalledTimes(0);
        });

        it('should send request to delete files', async () => {
            const mockedS3 = new awsMock.S3();
            const fileToDelete1 = {
                fileName: chance.word()
            };
            const fileToDelete2 = {
                fileName: chance.word()
            };

            await s3Service.deleteS3Objects([fileToDelete1, fileToDelete2]);

            const expectedParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Delete: {
                    Objects: [
                        buildFileDeleteRequest(fileToDelete1),
                        buildFileDeleteRequest(fileToDelete2)
                    ]
                }
            };
    
            expect(mockedS3.deleteObjects).toHaveBeenCalledTimes(1);
            expect(mockedS3.deleteObjects).toHaveBeenCalledWith(expectedParams);
        });
    });

    describe('storeFilesInS3', () => {
        it('should upload each file to S3', async () => {
            const mockedS3 = new awsMock.S3();
            const numberOfFiles = chance.d12();

            const files = chance.n(createPdfFile, numberOfFiles);

            await s3Service.storeFilesInS3(files);

            expect(mockedS3.upload).toHaveBeenCalledTimes(numberOfFiles);

            files.forEach((file) => {
                const expectedParams = buildFileCreateRequest(file.fileName, file.fileContents);
                expect(mockedS3.upload).toHaveBeenCalledWith(expectedParams);
                expect(mimeMock.getType).toHaveBeenCalledWith(file.fileName);
            });

        });

        it('should respond with a mongoose object for each file that was uploaded to s3', async () => {
            const numberOfFiles = chance.d12();
            const files = chance.n(createPdfFile, numberOfFiles);

            const s3FilesAsMongooseObject = await s3Service.storeFilesInS3(files);

            expect(s3FilesAsMongooseObject.length).toEqual(numberOfFiles);

            s3FilesAsMongooseObject.forEach((s3File) => {
                const {_id} = s3File;
                expect(_id).toBeDefined();
            });
        });
    });
});
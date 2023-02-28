const s3Service = require('../../application/services/s3Service');
const awsMock = require('aws-sdk');
const chance = require('chance').Chance();

jest.mock('aws-sdk', () => {
    const mockedS3 = {
        deleteObjects: jest.fn().mockReturnThis(),
        upload: jest.fn().mockReturnThis(),
        promise: jest.fn(),
    };
    return { S3: jest.fn(() => mockedS3) };
});

function buildFileDeleteRequest(file) {
    return {
        Key: file.fileName,
        VersionId: file.versionId
    };
}

function buildFileCreateRequest(fileName, fileContents) {
    return {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileContents
    };
}

describe('s3Service test suite', () => {
    afterAll(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
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
                fileName: chance.word(),
                versionId: chance.word()
            };
            const fileToDelete2 = {
                fileName: chance.word(),
                versionId: chance.word()
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
        it('should throw an error if the length of "fileNames" does not equal the length of "fileContents"', async () => {
            const numberOfFileNames = chance.d12();
            const numberOfFileContents = numberOfFileNames + 1;

            const fileNames = chance.n(chance.word, numberOfFileNames);
            const fileContents = chance.n(chance.word, numberOfFileContents);

            await expect(s3Service.storeFilesInS3(fileNames, fileContents)).rejects.toThrow('\"fileNames\" must be mapped one-to-one with \"contentsOfEachFile\"');
        });

        it('should upload each file to S3', async () => {
            const mockedS3 = new awsMock.S3();
            const numberOfFiles = chance.d12();

            const fileNames = chance.n(chance.word, numberOfFiles);
            const fileContents = chance.n(chance.word, numberOfFiles);

            await s3Service.storeFilesInS3(fileNames, fileContents);

            expect(mockedS3.upload).toHaveBeenCalledTimes(numberOfFiles);

            fileNames.forEach((fileName, index) => {
                const expectedParams = buildFileCreateRequest(fileName, fileContents[index]);
                expect(mockedS3.upload).toHaveBeenCalledWith(expectedParams);
            });
        });
    });
});
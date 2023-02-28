const fileService = require('../../application/services/fileService');
const pathMock = require('path');
const fsMock = require('fs');
const chance = require('chance').Chance();

jest.mock('path');
jest.mock('fs');

const baseDirectory = './../../someRandomDirectoryPath';
const uploadsDirectory = '/uploads';

function getExpectedFilePath(fileName) {
    return baseDirectory + uploadsDirectory + '/' + fileName;
}

describe('fileService test suite', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        pathMock.resolve.mockReturnValue(baseDirectory);
        fsMock.unlinkSync.mockReturnValue();
    });

    describe('getUploadedFilePath', () => {
        it('should return the full path to the file', () => {
            const fileName = chance.word();

            const actualFilePath = fileService.getUploadedFilePath(fileName);

            expect(pathMock.resolve).toHaveBeenCalledTimes(1);
            expect(actualFilePath).toEqual(getExpectedFilePath(fileName))
        });
    });

    describe('getUploadedFilePaths', () => {
        it('should return an empty array if no filesNames are provided', () => {
            const fileNames = [];

            const actualFilePaths = fileService.getUploadedFilePaths(fileNames);

            expect(pathMock.resolve).toHaveBeenCalledTimes(0);
            expect(actualFilePaths).toEqual([]);
        });
        it('should return the full path to each file', () => {
            const fileName1 = chance.word();
            const fileName2 = chance.word();
            const fileNames = [fileName1, fileName2];

            const actualFilePaths = fileService.getUploadedFilePaths(fileNames);

            expect(pathMock.resolve).toHaveBeenCalledTimes(2);
            expect(actualFilePaths.length).toEqual(fileNames.length);
            expect(actualFilePaths[0]).toEqual(getExpectedFilePath(fileName1))
            expect(actualFilePaths[1]).toEqual(getExpectedFilePath(fileName2))
        });
    });

    function createFile() {
        return {
            filename: chance.word()
        }
    }

    describe('getFileNames', () => {
        let files;
        
        beforeEach(() => {
            files = chance.n(createFile, chance.d12());
        });

        it('should return an empty array if attribute is not defined', () => {
            const actualFileNames = fileService.getFileNames(undefined);

            expect(actualFileNames).toEqual([]);
        });

        it('should return the "filename" attribute from each object', () => {
            const expectedFileNames = files.map(({filename}) => filename);

            const actualFileNames = fileService.getFileNames(files);

            expect(actualFileNames).toEqual(expectedFileNames);
        });
    });
    describe('deleteOneFileFromFileSystem', () => {
        it('should unlink the file', () => {
            const filePath = chance.string();

            fileService.deleteOneFileFromFileSystem(filePath);

            expect(fsMock.unlinkSync).toHaveBeenCalledTimes(1);
            expect(fsMock.unlinkSync).toHaveBeenCalledWith(filePath);
        })
    });

    describe('deleteMultipleFilesFromFileSystem', () => {
        it('should unlink the files', () => {
            const filePath1 = chance.word();
            const filePath2 = chance.string();
            const filePaths = [filePath1, filePath2];

            fileService.deleteMultipleFilesFromFileSystem(filePaths);

            expect(fsMock.unlinkSync).toHaveBeenCalledTimes(filePaths.length);
            expect(fsMock.unlinkSync).toHaveBeenCalledWith(filePath1);
            expect(fsMock.unlinkSync).toHaveBeenCalledWith(filePath2);
        })
    });

    describe('getUploadedFileContents', () => {
        beforeEach(() => {
            fsMock.readFileSync.mockReturnValue('');
        });

        it('should get the contents of each file', () => {
            const filePaths = chance.n(chance.word, chance.d12());

            fileService.getUploadedFileContents(filePaths);

            expect(fsMock.readFileSync).toHaveBeenCalledTimes(filePaths.length);
        });

        it('should return the contents of each file', () => {
            const filePath1 = chance.word();
            const filePath2 = chance.word();
            const fileContents1 = chance.string();
            const fileContents2 = chance.string();
            fsMock.readFileSync.mockReturnValueOnce(fileContents1);
            fsMock.readFileSync.mockReturnValueOnce(fileContents2);
            const filePaths = [filePath1, filePath2];

            const actualFileContents = fileService.getUploadedFileContents(filePaths);

            expect(fsMock.readFileSync).toHaveBeenCalledTimes(filePaths.length);
            expect(actualFileContents[0]).toEqual(fileContents1);
            expect(actualFileContents[1]).toEqual(fileContents2);
        });
    });
});
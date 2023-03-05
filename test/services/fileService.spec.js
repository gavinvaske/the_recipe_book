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
            expect(actualFilePath).toEqual(getExpectedFilePath(fileName));
        });
    });

    function createFile() {
        return {
            filename: chance.word()
        };
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
        });
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
        });
    });
});
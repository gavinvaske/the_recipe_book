import * as fileService from '../../application/services/fileService';
import pathMock from 'path';
import fsMock from 'fs';
import Chance from 'chance';

const chance = Chance();

jest.mock('path');
jest.mock('fs');

const baseDirectory = './../../someRandomDirectoryPath';
const uploadsDirectory = '/uploads';

function getExpectedFilePath(fileName) {
    return baseDirectory + uploadsDirectory + '/' + fileName;
}

describe('fileService test suite', () => {
    let fileContents;

    beforeEach(() => {
        jest.resetAllMocks();

        fileContents = chance.string();

        pathMock.resolve.mockReturnValue(baseDirectory);
        fsMock.unlinkSync.mockReturnValue();
        fsMock.readFileSync.mockReturnValue(fileContents);
    });

    describe('getUploadedFilePath', () => {
        it('should return the full path to the file', () => {
            const fileName = chance.word();

            const actualFilePath = fileService.getUploadedFilePath(fileName);

            expect(pathMock.resolve).toHaveBeenCalledTimes(1);
            expect(actualFilePath).toEqual(getExpectedFilePath(fileName));
        });
    });

    describe('getUploadedFile', () => {
        it('should return an object with the correct attributes', () => {
            const fileName = chance.word();
            const expectedFile = {
                fileName: fileName,
                filePath: getExpectedFilePath(fileName),
                fileContents: fileContents
            };

            const actualFile = fileService.getUploadedFile(fileName);

            expect(actualFile).toEqual(expectedFile);
            expect(fsMock.readFileSync).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUploadedFiles', () => {
        it('should return one uploaded file', () => {
            const fileName = chance.word();
            const expectedFile = {
                fileName: fileName,
                filePath: getExpectedFilePath(fileName),
                fileContents: fileContents
            };

            const actualFiles = fileService.getUploadedFiles([fileName]);

            expect(actualFiles.length).toEqual(1);
            expect(actualFiles[0]).toEqual(expectedFile);
            expect(fsMock.readFileSync).toHaveBeenCalledTimes(1);
        });

        it('should return n number of uploaded files', () => {
            const fileNames = chance.n(chance.word, chance.d12());
            const expectedFiles = fileNames.map((fileName) => {
                return {
                    fileName: fileName,
                    filePath: getExpectedFilePath(fileName),
                    fileContents: fileContents
                };
            });

            const actualFiles = fileService.getUploadedFiles(fileNames);

            expect(actualFiles.length).toEqual(fileNames.length);
            expectedFiles.forEach((expectedFile, index) => {
                expect(actualFiles[index]).toEqual(expectedFile);
            });
            expect(fsMock.readFileSync).toHaveBeenCalledTimes(fileNames.length);
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
            const filePath = chance.word();
            const file = {
                filePath: filePath
            };

            fileService.deleteOneFileFromFileSystem(file);

            expect(fsMock.unlinkSync).toHaveBeenCalledTimes(1);
            expect(fsMock.unlinkSync).toHaveBeenCalledWith(filePath);
        });
    });

    describe('deleteMultipleFilesFromFileSystem', () => {
        it('should unlink the files', () => {
            const filePath1 = chance.word();
            const filePath2 = chance.word();
            const files = [
                {filePath: filePath1},
                {filePath: filePath2}
            ];

            fileService.deleteMultipleFilesFromFileSystem(files);

            expect(fsMock.unlinkSync).toHaveBeenCalledTimes(files.length);
            expect(fsMock.unlinkSync).toHaveBeenCalledWith(filePath1);
            expect(fsMock.unlinkSync).toHaveBeenCalledWith(filePath2);
        });
    });
});
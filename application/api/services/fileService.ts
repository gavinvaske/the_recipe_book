import { resolve } from 'path';
import { readFileSync, unlinkSync } from 'fs';

export const PDF_MIME_TYPE = 'application/pdf';

export function getUploadedFilePath(uploadedFileName) {
    return resolve(__dirname, '../../') + '/uploads/' + uploadedFileName;
}

export function doesFileHaveThisMimeType(fileName, mimeType) {
    return mime.getType(fileName) === mimeType;
}

export function getUploadedFile(fileName) {
    const filePath = this.getUploadedFilePath(fileName);
    const fileContents = readFileSync(filePath);

    return {
        fileName,
        filePath,
        fileContents
    };
}

export function getUploadedFiles(fileNames) {
    return fileNames.map((fileName) => {
        return this.getUploadedFile(fileName);
    });
}

export function getFileNames(files) {
    if (!files) {
        return [];
    }
    return files.map(({filename}) => {
        return filename;
    });
}

export function deleteOneFileFromFileSystem(file) {
    const {filePath} = file;

    unlinkSync(filePath);
}

export function deleteMultipleFilesFromFileSystem(files) {
    files.forEach((file) => {
        this.deleteOneFileFromFileSystem(file);
    });
}
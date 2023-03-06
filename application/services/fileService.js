const path = require('path');
const fs = require('fs');

module.exports.PDF_MIME_TYPE = 'application/pdf';

module.exports.getUploadedFilePath = (uploadedFileName) => {
    return path.resolve(__dirname, '../../') + '/uploads/' + uploadedFileName;
};

module.exports.doesFileHaveThisMimeType = (fileName, mimeType) => {
    return mime.getType(fileName) === mimeType;
};

module.exports.getUploadedFile = (fileName) => {
    const filePath = this.getUploadedFilePath(fileName);
    const fileContents = fs.readFileSync(filePath);

    return {
        fileName,
        filePath,
        fileContents
    };
};

module.exports.getUploadedFiles = (fileNames) => {
    return fileNames.map((fileName) => {
        return this.getUploadedFile(fileName);
    });
};

module.exports.getFileNames = (files) => {
    if (!files) {
        return [];
    }
    return files.map(({filename}) => {
        return filename;
    });
};

module.exports.deleteOneFileFromFileSystem = (file) => {
    const {filePath} = file;

    fs.unlinkSync(filePath);
};

module.exports.deleteMultipleFilesFromFileSystem = (files) => {
    files.forEach((file) => {
        this.deleteOneFileFromFileSystem(file);
    });
};
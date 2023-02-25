const path = require('path');
const fs = require('fs');

module.exports.getUploadedFilePath = (uploadedFileName) => {
    return path.join(path.resolve(__dirname, '../../') + '/uploads/' + uploadedFileName);
};

module.exports.getUploadedFilePaths = (uploadedFileNames) => {
    return uploadedFileNames.map((fileName) => {
        return this.getUploadedFilePath(fileName);
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

module.exports.deleteOneFileFromFileSystem = (filePath) => {
    fs.unlinkSync(filePath);
};

module.exports.deleteMultipleFilesFromFileSystem = (filePaths) => {
    filePaths.forEach((filePath) => {
        this.deleteOneFileFromFileSystem(filePath);
    });
};

module.exports.getUploadedFileContents = (filePaths) => {
    return filePaths.map((filePath) => {
        return fs.readFileSync(filePath);
    });
};
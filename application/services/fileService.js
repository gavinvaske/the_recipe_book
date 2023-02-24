const path = require('path');
const fs = require('fs');
const fileSchema = require('../schemas/s3File');
const mongoose = require('mongoose');

module.exports.getUploadedFilePath = (uploadedFileName) => {
    return path.join(path.resolve(__dirname, '../../') + '/uploads/' + uploadedFileName);
}

module.exports.getUploadedFilePaths = (uploadedFileNames) => {
    return uploadedFileNames.map((fileName) => {
        return this.getUploadedFilePath(fileName);
    });
}

module.exports.getFileNames = (files) => {
    if (!files) {
        return [];
    }
    return files.map(({filename}) => {
        return filename;
    })
}

module.exports.deleteOneFileFromFileSystem = (filePath) => {
    fs.unlinkSync(filePath);
}

module.exports.deleteMultipleFilesFromFileSystem = (filePaths) => {
    filePaths.forEach((filePath) => {
        this.deleteOneFileFromFileSystem(filePath);
    })
}

module.exports.buildFiles = (fileNames, fileUrls) => {
    if (fileNames.length != fileUrls.length) {
        throw new Error('"fileNames" must map one-to-one with "fileUrls"')
    }

    FileModel = mongoose.model('File', fileSchema);
    const files = [];

    for (let i = 0; i < fileNames.length; i++) {
        const fileAttributes = {
            fileName: fileNames[i],
            url: fileUrls[i]
        }

        files.push(new FileModel(fileAttributes));
    }
    return files;
};

module.exports.getUploadedFileContents = (filePaths) => {
    return filePaths.map((filePath) => {
        return fs.readFileSync(filePath);
    });
}
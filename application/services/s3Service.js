const AWS = require('aws-sdk');
const mongoose = require('mongoose');
const fileSchema = require('../schemas/s3File');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

function buildS3ObjectToDelete(s3ObjectKey) {
    return {
        Key: s3ObjectKey
    }
}

module.exports.deleteObjects = async (s3ObjectKeys) => {
    const objectsToDelete = s3ObjectKeys.map((s3ObjectKey) => {
        return buildS3ObjectToDelete(s3ObjectKey);
    });

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
            Objects: objectsToDelete
        }
    }

    return s3.deleteObjects(params).promise();
}

function sendFileToS3(fileName, fileContents){
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileContents
    };

    return s3.upload(params).promise();
};

module.exports.storeFilesInS3 = async (fileNames, contentsOfEachFile) => {
    if (fileNames.length !== contentsOfEachFile.length) {
        throw new Error('"fileNames" must be mapped one-to-one with "contentsOfEachFile"')
    }

    const s3FileUploadResponsePromises = [];

    for (let i = 0; i < fileNames.length; i++) {
        s3FileUploadResponsePromises.push(sendFileToS3(fileNames[i], contentsOfEachFile[i]));
    }

    const s3FileUploadResponses = await Promise.all(s3FileUploadResponsePromises);
    const FileModel = mongoose.model('s3File', fileSchema);

    return s3FileUploadResponses.map((fileUploadResponse) => {
        return new FileModel(fileUploadResponse);
    })
}


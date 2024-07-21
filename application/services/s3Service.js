const AWS = require('aws-sdk');
import mongoose from 'mongoose'
const s3FileSchema = require('../schemas/s3File.js').default;
const mime = require('mime');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports.deleteS3Objects = async (s3Files) => {
    if (!s3Files || s3Files.length === 0) {
        return;
    }

    const objectsToDelete = s3Files.map((file) => {
        return {
            Key: file.fileName
        };
    });

    console.log(`Info: Deleting the following Objects from S3 => ${JSON.stringify(objectsToDelete)}`);

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
            Objects: objectsToDelete
        }
    };

    return s3.deleteObjects(params).promise();
};

function sendFileToS3(file) {
    const {fileName, fileContents} = file;
    const contentType = mime.getType(fileName);

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileContents,
        ContentType: contentType
    };

    return s3.upload(params).promise();
};

module.exports.storeFilesInS3 = async (files) => {
    if (!files || files.length === 0) {
        return [];
    }

    const s3FileUploadResponsePromises = files.map((file) => {
        return sendFileToS3(file);
    });

    const s3FileUploadResponses = await Promise.all(s3FileUploadResponsePromises);
    const FileModel = mongoose.model('s3File', s3FileSchema);

    return s3FileUploadResponses.map((fileUploadResponse) => {
        return new FileModel(fileUploadResponse);
    });
};


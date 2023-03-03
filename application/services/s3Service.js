const AWS = require('aws-sdk');
const mongoose = require('mongoose');
const fileSchema = require('../schemas/s3File');

FILE_EXTENSION_IS_PDF_REGEX = /(.pdf)$/;

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

function buildS3ObjectToDelete(s3File) {
    const {fileName, versionId} = s3File;

    if (!fileName || !versionId) {
        throw new Error(`fileName ("${fileName}") and/or versionId "${versionId}" are undefined. Cannot delete s3File if one or more of those attributes is not defined.`);
    }

    return {
        Key: fileName,
        VersionId: versionId ? versionId : undefined
    };
}

module.exports.deleteS3Objects = async (s3Files) => {
    if (!s3Files || s3Files.length === 0) {
        return;
    }

    const objectsToDelete = s3Files.map((file) => {
        return buildS3ObjectToDelete(file);
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

function sendPdfToS3(fileName, fileContents){
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileContents,
        ContentType: 'application/pdf'
    };

    return s3.upload(params).promise();
};

function isEveryFileAPdf(fileNames) {
    return fileNames.every((fileName) => {
        return FILE_EXTENSION_IS_PDF_REGEX.test(fileName);
    });
}

module.exports.storePdfsInS3 = async (fileNames, contentsOfEachFile) => {
    if (fileNames.length !== contentsOfEachFile.length) {
        throw new Error('"fileNames" must be mapped one-to-one with "contentsOfEachFile"');
    }

    if (!isEveryFileAPdf(fileNames)) {
        throw new Error(`These files must be PDFs. At least one of the following files is not a PDF: ${JSON.stringify(fileNames)}`);
    }

    const s3FileUploadResponsePromises = [];

    for (let i = 0; i < fileNames.length; i++) {
        s3FileUploadResponsePromises.push(sendPdfToS3(fileNames[i], contentsOfEachFile[i]));
    }

    const s3FileUploadResponses = await Promise.all(s3FileUploadResponsePromises);
    const FileModel = mongoose.model('s3File', fileSchema);

    return s3FileUploadResponses.map((fileUploadResponse) => {
        return new FileModel(fileUploadResponse);
    });
};


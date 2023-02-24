const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


module.exports.storeFileInS3 = (fileName, fileContents) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileContents
    };

    return s3.upload(params).promise();
};

module.exports.storeFilesInS3 = (fileNames, contentsOfEachFile) => {
    if (fileNames.length !== contentsOfEachFile.length) {
        throw new Error('"fileNames" must be mapped one-to-one with "contentsOfEachFile"')
    }

    const s3FileUploadResponsePromises = [];

    for (let i = 0; i < fileNames.length; i++) {

        s3FileUploadResponsePromises.push(this.storeFileInS3(fileNames[i], contentsOfEachFile[i]));
    }

    return s3FileUploadResponsePromises;
}

module.exports.getUrlsFromS3UploadResponses = (s3UploadResponses) => {
    return s3UploadResponses.map(({Location: url}) => {
        return url;
    })
}


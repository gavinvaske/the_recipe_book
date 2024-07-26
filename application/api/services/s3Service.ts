import AWS from 'aws-sdk';
import mongoose from 'mongoose';
import { s3FileSchema } from '../schemas/s3File.ts';
import mime from 'mime';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export async function deleteS3Objects(s3Files) {
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
}

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

export async function storeFilesInS3(files) {
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
}


const router = require('express').Router();
const DieLineModel = require('../models/dieLine');
const mongooseService = require('../services/mongooseService');
const {upload} = require('../middleware/upload');
const fileService = require('../services/fileService');
const s3Service = require('../services/s3Service');

const MAX_NUMBER_OF_FILES = 100;

router.get('/', (request, response) => {
    return response.render('viewRequests');
});

router.get('/form', (request, response) => {
    return response.render('createDieLine');
});

router.post('/', upload.array('file-uploads', MAX_NUMBER_OF_FILES), async (request, response) => {
    const uploadedFileNames = fileService.getFileNames(request.files);
    const uploadedFilePaths = fileService.getUploadedFilePaths(uploadedFileNames);
    const uploadedFileContents = fileService.getUploadedFileContents(uploadedFilePaths);
    let fileUploads = [];

    try {
        fileUploads = await s3Service.storeFilesInS3(uploadedFileNames, uploadedFileContents)

        const dieLineAttributes = {
            ...request.body,
            fileUploads: fileUploads
        }

        await DieLineModel.create(dieLineAttributes);

        return response.redirect('/die-lines');
    } catch (error) {
        console.log(`Error creating die-line: ${error.message}`);
        request.flash('errors', ['The following error(s) occurred while creating the die-line:', ...mongooseService.parseHumanReadableMessages(error)]);

        const objectKeysToDelete = fileUploads.map((fileUpload) => {
            return fileUpload.fileName;
        })

        await s3Service.deleteObjects(objectKeysToDelete);

        return response.redirect('back');
    } finally {
        fileService.deleteMultipleFilesFromFileSystem(uploadedFilePaths);
    }
});

module.exports = router;
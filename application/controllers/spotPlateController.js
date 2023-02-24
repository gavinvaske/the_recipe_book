const router = require('express').Router();
const SpotPlateModel = require('../models/spotPlate');
const mongooseService = require('../services/mongooseService');
const {upload} = require('../middleware/upload');
const fileService = require('../services/fileService');
const s3Service = require('../services/s3Service');

const MAX_NUMBER_OF_FILES = 100;

router.get('/', (request, response) => {
    return response.render('viewRequests');
});

router.get('/form', (request, response) => {
    return response.render('createSpotPlate');
});

router.post('/', upload.array('file-uploads', MAX_NUMBER_OF_FILES), async (request, response) => {
    const uploadedFileNames = fileService.getFileNames(request.files);
    const uploadedFilePaths = fileService.getUploadedFilePaths(uploadedFileNames);

    try {
        let s3FileUploadResponses = await Promise.all(s3Service.storeFilesInS3(uploadedFileNames, uploadedFilePaths))
        let fileUrls = s3Service.getUrlsFromS3UploadResponses(s3FileUploadResponses);

        const spotPlateAttributes = {
            ...request.body,
            fileUploads: fileService.buildFiles(uploadedFileNames, fileUrls)
        }

        await SpotPlateModel.create(spotPlateAttributes);

        return response.redirect('/spot-plates');
    } catch (error) {
        console.log(`Error creating spot-plate: ${error.message}`);
        request.flash('errors', ['The following error(s) occurred while creating the spot-plate:', ...mongooseService.parseHumanReadableMessages(error)]);
        
        return response.redirect('back');
    } finally {
        fileService.deleteMultipleFilesFromFileSystem(uploadedFilePaths);
    }

});

module.exports = router;
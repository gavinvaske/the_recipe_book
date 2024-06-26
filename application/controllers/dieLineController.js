const router = require('express').Router();
const DieLineModel = require('../models/dieLine');
const mongooseService = require('../services/mongooseService');
const {upload} = require('../middleware/upload');
const fileService = require('../services/fileService');
const s3Service = require('../services/s3Service');
const dieLineService = require('../services/dieLineService');
const {verifyJwtToken} = require('../middleware/authorize');

router.use(verifyJwtToken);

const MAX_NUMBER_OF_FILES = 100;

router.get('/form', (request, response) => {
    const departments = dieLineService.getDepartments();
    const startingDepartment = dieLineService.getStartingDepartment();
    const departmentStatusesForStartingDepartment = dieLineService.getDepartmentStatusesForDepartment(startingDepartment);

    return response.render('createDieLine', {
        departments,
        startingDepartment,
        departmentStatusesForStartingDepartment
    });
});

router.post('/', upload.array('file-uploads', MAX_NUMBER_OF_FILES), async (request, response) => {
    let uploadedFiles = [];
    let s3Files = [];
    
    try {
        const uploadedFileNames = fileService.getFileNames(request.files);
        uploadedFiles = fileService.getUploadedFiles(uploadedFileNames);
        s3Files = await s3Service.storeFilesInS3(uploadedFiles);

        const dieLineAttributes = {
            ...request.body,
            fileUploads: s3Files
        };

        await DieLineModel.create(dieLineAttributes);

        return response.redirect('/die-lines');
    } catch (error) {
        console.log(`Error creating die-line: ${error.message}`);
        request.flash('errors', ['The following error(s) occurred while creating the die-line:', ...mongooseService.parseHumanReadableMessages(error)]);

        await s3Service.deleteS3Objects(s3Files);

        return response.redirect('back');
    } finally {
        fileService.deleteMultipleFilesFromFileSystem(uploadedFiles);
    }
});

router.post('/department-statuses', (request, response) => {
    const {departmentName} = request.body;
    const departmentStatusesForThisDepartment = dieLineService.getDepartmentStatusesForDepartment(departmentName);

    return response.json({
        departmentStatuses: departmentStatusesForThisDepartment
    });
});

module.exports = router;
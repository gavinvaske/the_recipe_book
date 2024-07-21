import { Router } from 'express'
const router = Router();
const SpotPlateModel = require('../models/spotPlate');
const mongooseService = require('../services/mongooseService');
const {upload} = require('../middleware/upload');
const fileService = require('../services/fileService');
const s3Service = require('../services/s3Service');
const spotPlateService = require('../services/spotPlateService');
const {verifyJwtToken} = require('../middleware/authorize');

router.use(verifyJwtToken);

const MAX_NUMBER_OF_FILES = 100;

router.get('/form', (request, response) => {
    const departments = spotPlateService.getDepartments();
    const startingDepartment = spotPlateService.getStartingDepartment();
    const departmentStatusesForStartingDepartment = spotPlateService.getDepartmentStatusesForDepartment(startingDepartment);

    return response.render('createSpotPlate', {
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

        const spotPlateAttributes = {
            ...request.body,
            fileUploads: s3Files
        };

        await SpotPlateModel.create(spotPlateAttributes);

        return response.redirect('/spot-plates');
    } catch (error) {
        console.log(`Error creating spot-plate: ${error.message}`);
        request.flash('errors', ['The following error(s) occurred while creating the spot-plate:', ...mongooseService.parseHumanReadableMessages(error)]);

        await s3Service.deleteS3Objects(s3Files);
        
        return response.redirect('back');
    } finally {
        fileService.deleteMultipleFilesFromFileSystem(uploadedFiles);
    }
});

router.post('/department-statuses', (request, response) => {
    const {departmentName} = request.body;
    const departmentStatusesForThisDepartment = spotPlateService.getDepartmentStatusesForDepartment(departmentName);

    return response.json({
        departmentStatuses: departmentStatusesForThisDepartment
    });
});

module.exports = router;
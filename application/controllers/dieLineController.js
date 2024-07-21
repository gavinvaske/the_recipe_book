import { Router } from 'express'
const router = Router();
import DieLineModel from '../models/dieLine.js';
import * as mongooseService  from '../services/mongooseService.js'
import { upload } from '../middleware/upload.js';
import * as fileService from '../services/fileService.js';
import * as s3Service from '../services/s3Service.js';
import * as dieLineService from '../services/dieLineService.js';
import { verifyJwtToken } from '../middleware/authorize.js'

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

export default router;
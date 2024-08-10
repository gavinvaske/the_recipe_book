import { Router } from 'express';
const router = Router();
import { SpotPlateModel } from '../models/spotPlate.ts';
import * as mongooseService from '../services/mongooseService.ts';
import { upload } from '../middleware/upload.ts';
import * as fileService from '../services/fileService.ts';
import * as s3Service from '../services/s3Service.ts';
import * as spotPlateService from '../services/spotPlateService.ts';
import { verifyBearerToken } from '../middleware/authorize.ts';

router.use(verifyBearerToken);

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

export default router;
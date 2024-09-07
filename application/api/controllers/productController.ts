import { Router } from 'express';
const router = Router();
import { verifyBearerToken } from '../middleware/authorize.ts';
import { upload } from '../middleware/upload.ts';
import { TicketModel } from '../models/ticket.ts';

import * as s3Service from '../services/s3Service.ts';
import * as fileService from '../services/fileService.ts';
import { BaseProductModel } from '../models/baseProduct.ts';
import { BAD_REQUEST, CREATED_SUCCESSFULLY, SERVER_ERROR } from '../enums/httpStatusCodes.ts';

const SERVER_ERROR_CODE = 500;
const INVALID_REQUEST_CODE = 400;

router.use(verifyBearerToken);

router.post('/:productNumber/upload-proof', upload.single('proof'), async (request, response) => {
    const productNumber = request.params.productNumber;
    let fileUploadedToS3, uploadedFile;
    
    try {
        if (request.file.mimetype !== fileService.PDF_MIME_TYPE) {
            return response.status(INVALID_REQUEST_CODE).send('The uploaded file must be a PDF');
        }

        uploadedFile = fileService.getUploadedFile(request.file.filename);
        const ticket = await TicketModel.findOne({'products.productNumber': productNumber});

        [fileUploadedToS3] = await s3Service.storeFilesInS3([uploadedFile]);

        const index = ticket.products.findIndex((product) => product.productNumber === productNumber);

        ticket.products[index].proof = fileUploadedToS3;

        await ticket.save();

        return response.json({});
    } catch (error) {       
        console.log(`Error while uploading proof: ${error.message}`);

        await s3Service.deleteS3Objects([fileUploadedToS3]);

        return response.status(SERVER_ERROR_CODE).send(error.message);
    } finally {
        fileService.deleteOneFileFromFileSystem(uploadedFile);
    }
});

router.get('/:mongooseId', async (request, response) => {
  try {
    const product = await BaseProductModel.findById(request.params.mongooseId);

    return response.json(product);
  } catch (error) {
    console.error('Error searching for product: ', error);
    return response
        .status(SERVER_ERROR)
        .send(error.message);
  }
});

router.post('/', async (request, response) => {
  try {
    const savedProduct = await BaseProductModel.create({
      ...request.body,
      author: request.user._id
    })
    
    return response.status(CREATED_SUCCESSFULLY).send(savedProduct);
  } catch (error) {
    console.error('Failed to create product', error.message);

    return response.status(BAD_REQUEST).send(error.message);
  }
});

export default router;
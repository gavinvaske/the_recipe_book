import { Router, Request, Response } from 'express';
const router = Router();
import { verifyBearerToken } from '../middleware/authorize.ts';
import { upload } from '../middleware/upload.ts';
import { TicketModel } from '../models/ticket.ts';

import * as s3Service from '../services/s3Service.ts';
import * as fileService from '../services/fileService.ts';
import { BaseProductModel } from '../models/baseProduct.ts';
import { BAD_REQUEST, CREATED_SUCCESSFULLY, SERVER_ERROR, SUCCESS } from '../enums/httpStatusCodes.ts';
import { DESCENDING } from '../enums/mongooseSortMethods.ts';

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
    const ticket = await TicketModel.findOne({ 'products.productNumber': productNumber });

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

router.get('/:mongooseId', async (request: Request, response: Response) => {
  try {
    const product = await BaseProductModel.findById(request.params.mongooseId);

    if (!product) throw new Error('Product not found');

    return response.json(product);
  } catch (error) {
    console.error('Error fetching product: ', error.message);
    return response
      .status(BAD_REQUEST)
      .send(error.message);
  }
});

router.post('/', async (request: Request, response: Response) => {
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

router.patch('/:mongooseId', async (request: Request, response: Response) => {
  try {
    const baseProduct = await BaseProductModel.findOneAndUpdate(
      { _id: request.params.mongooseId },
      { $set: request.body },
      { runValidators: true, new: true }
    ).exec();

    return response.json(baseProduct);
  } catch (error) {
    console.log('Failed to update product: ', error.message);

    return response.status(BAD_REQUEST).send(error.message);
  }
})

router.delete('/:mongooseId', async (request: Request, response: Response) => {
  try {
    const deletedProduct = await BaseProductModel.findByIdAndDelete(request.params.mongooseId).exec();

    if (!deletedProduct) throw new Error('Product not found')

    return response.status(SUCCESS).json(deletedProduct);
  } catch (error) {
    console.error('Failed to delete product: ', error);

    return response.status(SERVER_ERROR).send(error.message);
  }
});

router.get('/', async (_: Request, response: Response) => {
  try {
    const products = await BaseProductModel.find().sort({ createdAt: DESCENDING }).exec();

    return response.json(products);
  } catch (error) {
    console.error('Error loading products', error);
    return response.status(SERVER_ERROR).send(error.message);
  }
});


export default router;
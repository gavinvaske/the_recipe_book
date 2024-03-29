const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const {upload} = require('../middleware/upload');
const TicketModel = require('../models/ticket');

const s3Service = require('../services/s3Service');
const productService = require('../services/productService');
const fileService = require('../services/fileService');

const SERVER_ERROR_CODE = 500;
const INVALID_REQUEST_CODE = 400;

router.use(verifyJwtToken);

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

router.get('/:id', async (request, response) => {
    const productObjectId = request.params.id;

    try {
        const ticket = await TicketModel
            .findOne({
                'products._id': productObjectId
            }).exec();

        const product = productService.selectProductFromTicket(ticket, productObjectId);

        if (!product) {
            request.flash('errors', [`No product was found with an ID of "${productObjectId}"`]);
            return response.redirect('/tickets');
        }

        return response.render('viewOneProduct', {
            ticket,
            product
        });
    } catch (error) {
        console.log('Error loading product: ', error);
        request.flash('errors', [`An error occurred while trying to load the product with an id of "${productObjectId}"`]);
        return response.redirect('/tickets');
    }
});

module.exports = router;
const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const {upload} = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const TicketModel = require('../models/ticket');

const s3Service = require('../services/s3Service');
const productService = require('../services/productService');

const SERVER_ERROR_CODE = 500;

router.use(verifyJwtToken);

function deleteFileFromFileSystem(path) {
    fs.unlinkSync(path);
}

router.post('/:productNumber/upload-proof', upload.single('proof'), async (request, response) => {
    const pdfFilePath = path.join(path.resolve(__dirname, '../../') + '/uploads/' + request.file.filename);
    const productNumber = request.params.productNumber;
    let uploadedProofs = [];
    
    try {
        const base64EncodedPdf = fs.readFileSync(pdfFilePath);
        const fileName = request.file.originalname;
        
        const ticket = await TicketModel.findOne({'products.productNumber': productNumber});

        uploadedProofs = await s3Service.storeFilesInS3([fileName], [base64EncodedPdf]);
        const uploadedProof = uploadedProofs[0];

        const index = ticket.products.findIndex((product) => product.productNumber === productNumber);

        ticket.products[index].proof = uploadedProof;

        await ticket.save();

        return response.json({});
    } catch (error) {
        console.log(`Error while uploading proof: ${error.message}`);
        await s3Service.deleteS3Objects(uploadedProofs);

        return response.status(SERVER_ERROR_CODE).json({
            error: error.message
        });
    } finally {
        deleteFileFromFileSystem(pdfFilePath);
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
        console.log(`Error loading product: ${JSON.stringify(error)}`);
        request.flash('errors', [`An error occurred while trying to load the product with an id of "${productObjectId}"`]);
        return response.redirect('/tickets');
    }
});

module.exports = router;
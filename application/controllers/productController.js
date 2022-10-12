const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const {upload} = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const TicketModel = require('../models/ticket');

const s3Service = require('../services/s3Service');
const productService = require('../services/productService');

router.use(verifyJwtToken);

function deleteFileFromFileSystem(path) {
    fs.unlinkSync(path);
}

router.post('/:productNumber/upload-proof', upload.single('proof'), async (request, response) => {
    const pdfFilePath = path.join(path.resolve(__dirname, '../../') + '/uploads/' + request.file.filename);
    const productNumber = request.params.productNumber;
    
    try {
        const base64EncodedPdf = fs.readFileSync(pdfFilePath);
        const fileName = request.file.originalname;
        
        const ticket = await TicketModel.findOne({
            'product.productNumber': productNumber
        }).exec();

        const {Location: urlWhereTheFileIsStored} = await s3Service.storeFileInS3(fileName, base64EncodedPdf);

        const index = ticket.products.findIndex((product) => product.productNumber === productNumber);

        ticket.products[index].proof = {
            url: urlWhereTheFileIsStored,
            fileName
        };

        await ticket.save();

        return response.json({});
    } catch (error) {
        console.log(`Error while uploading proof: ${error}`);
        return response.json({
            error: error.message
        });
    } finally {
        deleteFileFromFileSystem(pdfFilePath);
    }
});

router.get('/:productNumber', async (request, response) => {
    try {
        const productNumber = request.params.productNumber;
        
        const ticket = await TicketModel
            .findOne({
                'product.productNumber': productNumber
            }).exec();
        
        const product = productService.selectProductFromTicket(ticket, productNumber);

        if (!product) {
            request.flash('errors', [`No product exists with a product number of "${productNumber}"`]);
            return response.redirect('/tickets');
        }

        return response.render('viewOneProduct', {
            product
        });
    } catch (error) {
        console.log(error);
        request.flash('errors', ['An error occurred while loading the requested product:', error.message]);
        return response.redirect('back');
    }
});

module.exports = router;
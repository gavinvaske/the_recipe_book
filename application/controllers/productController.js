const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const {upload} = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const TicketModel = require('../models/ticket');

router.use(verifyJwtToken);

function deleteFileFromFileSystem(path) {
    fs.unlinkSync(path);
}

router.post('/:productNumber/upload-proof', upload.single('proof'), async (request, response) => {
    const pdfFilePath = path.join(path.resolve(__dirname, '../../') + '/uploads/' + request.file.filename);
    const productNumber = request.params.productNumber;
    
    try {
        const base64EncodedPdf = fs.readFileSync(pdfFilePath);
        console.log(base64EncodedPdf);
        console.log(`fileName => ${request.file.originalname}`);
        console.log(`${productNumber}`);
        
        const ticket = await TicketModel.findOne({
            'product.productNumber': productNumber
        }).exec();

        const index = ticket.products.findIndex((product) => product.productNumber === productNumber);

        ticket.products[index].proof = {
            data: base64EncodedPdf,
            contentType: request.file.mimetype,
            fileName: request.file.originalname
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

module.exports = router;
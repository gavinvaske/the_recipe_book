const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const {upload} = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const parser = require('xml2json');
const TicketModel = require('../models/ticket');
const ProductModel = require('../models/product');

router.use(verifyJwtToken);

function deleteFileFromFileSystem(path) {
    fs.unlinkSync(path);
}

function getProductsFromJob(jobAsJson) {
    return jobAsJson['TicketItem'];
}

router.get('/test', (request, response) => {
    const alert = new AlertModel({
        test: {
            attribute1: 'attribute #1',
            attribute2: 'attribute #2'
        }
    });

    return response.json(alert);
});

router.get('/upload', (request, response) => {
    response.render('uploadTicket');
});

router.post('/upload', upload.single('job-xml'), (request, response) => {
    const jobFilePath = path.join(path.resolve(__dirname, '../../') + '/uploads/' + request.file.filename);

    try {
        const jobAsXml = fs.readFileSync(jobFilePath);
        const jobAsJson = JSON.parse(parser.toJson(jobAsXml))['Root'];
        let products = [];
        const productsFromJob = getProductsFromJob(jobAsJson);

        const testProduct = new ProductModel(productsFromJob[0]);

        response.json(productsFromJob);

        // .forEach((product) => {
        //     products.push(new ProductModel(product));
        // });

        // console.log(products)
        // // const job = new JobModel(jobAsJson);

        // // console.log(`JOB => ${JSON.stringify(products)}`);

        // return response.json(products);

        // return response.render('editUploadedJob', {
        //     job
        // });
    } catch (error) {
        console.log(`Error uploading job file: ${JSON.stringify(error)}`);
        request.flash('errors', ['The following error occurred while uploading the file:', error.message]);
    
        return response.redirect('/tickets/upload');
    } finally {
        deleteFileFromFileSystem(jobFilePath);
    }    
});

module.exports = router;
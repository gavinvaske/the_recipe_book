const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const {upload} = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const parser = require('xml2json');

router.use(verifyJwtToken);

function deleteFileFromFileSystem(path) {
    fs.unlinkSync(path);
}

function getProductsFromJob(jobAsJson) {
    return jobAsJson['TicketItem'];
}

router.get('/upload', (request, response) => {
    response.render('uploadTicket');
});

router.post('/upload', upload.single('job-xml'), (request, response) => {
    const jobFilePath = path.join(path.resolve(__dirname, '../../') + '/uploads/' + request.file.filename);

    try {
        const jobAsXml = fs.readFileSync(jobFilePath);
        const jobAsJson = JSON.parse(parser.toJson(jobAsXml))['Root'];
        const productsFromJob = getProductsFromJob(jobAsJson);

        response.json(productsFromJob);
    } catch (error) {
        console.log(`Error uploading job file: ${JSON.stringify(error)}`);
        request.flash('errors', ['The following error occurred while uploading the file:', error.message]);
    
        return response.redirect('/tickets/upload');
    } finally {
        deleteFileFromFileSystem(jobFilePath);
    }    
});

module.exports = router;
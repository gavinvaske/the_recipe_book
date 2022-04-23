const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const {upload} = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const parser = require('xml2json');

router.use(verifyJwtToken)

function deleteFileFromFileSystem(path) {
    fs.unlinkSync(path);
}

router.get('/upload', (request, response) => {
    response.render('uploadJob');
});

router.post('/upload', upload.single('job-xml'), (request, response) => {
    const jobFilePath = path.join(path.resolve(__dirname, '../../') + '/uploads/' + request.file.filename);

    try {
        const jobAsXml = fs.readFileSync(jobFilePath);
        const jobAsJson = parser.toJson(jobAsXml)['Root'];

        console.log(jobAsJson)

        // return response.send(jobAsJson);
        return response.render('editUploadedJob', {
            job: jobAsJson
        });
    } catch(error) {
        console.log(`Error uploading job file: ${JSON.stringify(error)}`);
        request.flash('errors', ['The following error occurred while uploading the file:', error.message]);
    
        return response.redirect('/jobs/upload');
    } finally {
        deleteFileFromFileSystem(jobFilePath);
    }    
});

module.exports = router;
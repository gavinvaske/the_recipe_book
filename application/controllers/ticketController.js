const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const {upload} = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const parser = require('xml2json');
const ticketService = require('../services/ticketService');
const TicketModel = require('../models/ticket');
const mongooseService = require('../services/mongooseService');
const MaterialModel = require('../models/material');

router.use(verifyJwtToken);

function deleteFileFromFileSystem(path) {
    fs.unlinkSync(path);
}

router.get('/update/:id', async (request, response) => {
    try {
        const ticket = await TicketModel.findById(request.params.id).exec();
        const materials = await MaterialModel.find().exec();

        const materialIds = materials.map(material => material.materialId);

        response.render('updateTicket', {
            ticket,
            materialIds
        });
    } catch (error) {
        request.flash('errors', [error.message]);
        return response.redirect('back');
    }
});

router.get('/upload', (request, response) => {
    response.render('uploadTicket');
});

router.post('/upload', upload.single('job-xml'), async (request, response) => {
    const jobFilePath = path.join(path.resolve(__dirname, '../../') + '/uploads/' + request.file.filename);

    try {
        const jobAsXml = fs.readFileSync(jobFilePath);
        const rawUploadedTicketAsJson = JSON.parse(parser.toJson(jobAsXml))['Root'];

        ticketService.removeEmptyObjectAttributes(rawUploadedTicketAsJson);

        const ticketAttributes = ticketService.convertedUploadedTicketDataToProperFormat(rawUploadedTicketAsJson);

        const ticket = new TicketModel(ticketAttributes);

        await TicketModel.create(ticket);

        return response.redirect(`/tickets/update/${ticket._id}`);
    } catch (error) {
        console.log(`Error uploading job file: ${JSON.stringify(error)}`);
        request.flash('errors', ['The following error occurred while uploading the file:', ...mongooseService.parseHumanReadableMessages(error)]);
    
        return response.redirect('/tickets/upload');
    } finally {
        deleteFileFromFileSystem(jobFilePath);
    }    
});

module.exports = router;
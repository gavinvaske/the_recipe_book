const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');
const {upload} = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const parser = require('xml2json');
const ticketService = require('../services/ticketService');
const TicketModel = require('../models/ticket');

router.use(verifyJwtToken);

function deleteFileFromFileSystem(path) {
    fs.unlinkSync(path);
}

router.get('/upload', (request, response) => {
    response.render('uploadTicket');
});

router.get('/', async (request, response) => {
    try {
        const tickets = await TicketModel.find({}).exec();
        
        return response.render('viewTickets', {
            tickets
        });

    } catch (error) {
        request.flash('errors', [`Unable to load Tickets, the following error occurred: ${error.message}`]);
        return response.redirect('back');
    }
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

        response.json(ticket);
    } catch (error) {
        console.log(`Error uploading job file: ${JSON.stringify(error)}`);
        request.flash('errors', ['The following error occurred while uploading the file:', error.message]);
    
        return response.redirect('/tickets/upload');
    } finally {
        deleteFileFromFileSystem(jobFilePath);
    }
});

router.get('/:id', async (request, response) => {
    try {
        const ticket = await TicketModel.findById(request.params.id);

        return response.render('viewOneTicket', {
            ticket
        })
    } catch(error) {
        console.log(`Error fetching a ticket: ${error.message}`);
        request.flash('errors', [`An error occurred while attempting to load a Ticket: ${error.message}`]);
        return response.redirect('back');
    }
});

module.exports = router;
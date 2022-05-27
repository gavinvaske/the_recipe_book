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
const {departments} = require('../enums/departmentsEnum');

router.use(verifyJwtToken);

function deleteFileFromFileSystem(path) {
    fs.unlinkSync(path);
}

router.get('/', async (request, response) => {
    const tickets = await TicketModel.find({}, 'ticketNumber destination').exec();

    return response.render('viewTickets', {
        tickets
    });
});

router.get('/delete/:id', async (request, response) => {
    try {
        await TicketModel.findByIdAndDelete(request.params.id).exec();

        request.flash('alerts', 'Deletion was successful');
        response.redirect('/tickets');
    } catch (error) {
        request.flash('errors', error.message);
        return response.redirect('back');
    }
});

router.post('/update/:ticketId/notes', async (request, response) => {
    try {
        const departmentKey = Object.keys(request.body.departmentNotes)[0];
        const newNote = request.body.departmentNotes[departmentKey];

        const ticket = await TicketModel.findById(request.params.ticketId).exec();

        if (!ticket.departmentNotes) {
            ticket.departmentNotes = {};
        }

        const previousNote = ticket.departmentNotes[departmentKey];
        const theNoteHasChanged = previousNote !== newNote;

        if (theNoteHasChanged) {
            ticket.departmentNotes[departmentKey] = newNote;
        
            await ticket.save();
        }

    } catch (error) {
        return response.json({
            error: error.message
        });
    }

    return response.json({});
});

router.post('/find-subdepartments', (request, response) => {
    const departmentName = request.body.departmentName;
    const subDepartments = departments[departmentName];

    try {
        if (!subDepartments) {
            throw new Error(`No subdepartments found for the department named "${departmentName}"`);
        }
    } catch (error) {
        return response.json({
            error: error.message
        });
    }

    return response.json({
        subDepartments
    });
});

router.post('/update/:id', async (request, response) => {
    const ticketId = request.params.id;

    try {
        await TicketModel.findOneAndUpdate({_id: ticketId}, {$set: request.body}, {runValidators: true}).exec();

        return response.json({});
    } catch (error) {
        console.log(`Failed to update ticket with id ${ticketId}: ${error.message}`);
        request.flash('errors', [error.message]);
        return response.json({
            error: error.message
        });
    }
});

router.get('/update/:id', async (request, response) => {
    try {
        const ticket = await TicketModel.findById(request.params.id).exec();
        const materials = await MaterialModel.find().exec();
        const departmentNames = Object.keys(departments);

        const ticketDestination = ticket.destination;
        const selectedPrintingType = ticket.printingType;
        const selectedDepartment = ticketDestination && ticketDestination.department;
        const selectedSubDepartment = ticketDestination && ticketDestination.subDepartment;
        const selectedMaterial = ticket.primaryMaterial;

        const subDepartments = departments ? departments[selectedDepartment] : undefined;

        const materialIds = materials.map(material => material.materialId);

        response.render('updateTicket', {
            ticket,
            materialIds,
            departmentNames,
            selectedPrintingType,
            selectedDepartment,
            selectedSubDepartment,
            subDepartments,
            selectedMaterial
        });
    } catch (error) {
        console.log(`Error rendering ticket update page: ${error.message}`);
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

router.get('/:id', async (request, response) => {
    try {
        const ticket = await TicketModel
            .findById(request.params.id, 'ticketNumber destination')
            .exec();

        return response.render('viewOneTicket', {
            ticket
        });
    } catch (error) {
        console.log(error);
        request.flash('errors', ['An error occurred while loading the requested ticket:', error.message]);
        return response.redirect('back');
    }
});

module.exports = router;
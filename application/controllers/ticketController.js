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
const {departmentStatusesGroupedByDepartment} = require('../enums/departmentsEnum');
const workflowStepService = require('../services/workflowStepService');

router.use(verifyJwtToken);

function deleteFileFromFileSystem(path) {
    fs.unlinkSync(path);
}

router.get('/', async (request, response) => {
    const tickets = await TicketModel
        .find()
        .exec();

    const ticketsGroupedByDestination = ticketService.groupTicketsByDestination(tickets);
    const workflowStepTimeLedger = await workflowStepService.computeTimeTicketsHaveSpentInEachWorkflowStep();   // TODO: Maybe pass in a list of ticket Ids to compute

    return response.render('viewTickets', {
        ticketsGroupedByDestination,
        workflowStepTimeLedger
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

router.post('/find-department-statuses', (request, response) => {
    const departmentName = request.body.departmentName;
    const departmentStatuses = departmentStatusesGroupedByDepartment[departmentName];

    try {
        if (!departmentStatuses) {
            throw new Error(`No departmentStatuses found for the department named "${departmentName}"`);
        }
    } catch (error) {
        return response.json({
            error: error.message
        });
    }

    return response.json({
        departmentStatuses: departmentStatuses
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
        const departmentNames = Object.keys(departmentStatusesGroupedByDepartment);

        const ticketDestination = ticket.destination;
        const selectedDepartment = ticketDestination && ticketDestination.department;
        const selectedDepartmentStatus = ticketDestination && ticketDestination.departmentStatus;
        const selectedMaterial = ticket.primaryMaterial;

        const departmentStatuses = departmentStatusesGroupedByDepartment ? departmentStatusesGroupedByDepartment[selectedDepartment] : undefined;

        const materialIds = materials.map(material => material.materialId);

        response.render('updateTicket', {
            ticket,
            materialIds,
            departmentNames,
            selectedDepartment,
            selectedDepartmentStatus: selectedDepartmentStatus,
            departmentStatuses: departmentStatuses,
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
        console.log(`Error uploading job file: ${error}`);
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
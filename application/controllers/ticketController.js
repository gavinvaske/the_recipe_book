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
const {departmentToStatusesMappingForTicketObjects, isInProgressDepartmentStatus, removeDepartmentStatusesAUserIsNotAllowedToSelect} = require('../enums/departmentsEnum');
const workflowStepService = require('../services/workflowStepService');
const dateTimeService = require('../services/dateTimeService');

router.use(verifyJwtToken);

const SERVER_ERROR_CODE = 500;
const INVALID_REQUEST_ERROR_CODE = 400;

function deleteFileFromFileSystem(path) {
    fs.unlinkSync(path);
}

router.get('/', async (request, response) => {
    const tickets = await TicketModel
        .find()
        .exec();

    const ticketsGroupedByDestination = ticketService.groupTicketsByDestination(tickets);

    return response.render('viewTickets', {
        ticketsGroupedByDestination
    });
});

router.get('/in-progress/:ticketId', async (request, response) => {
    const ticketObjectId = request.params.ticketId;
    try {
        const ticket = await TicketModel.findById(ticketObjectId).exec();

        if (!ticket) {
            throw new Error(`No ticket was found in the database whose object ID is "${ticketObjectId}"`);
        }

        if (!isInProgressDepartmentStatus(ticket.destination.departmentStatus)) {
            return response.status(INVALID_REQUEST_ERROR_CODE).send(`The requested ticket whose object ID is "${ticketObjectId}" does not have a department status of "in-progress"`);
        }

        return response.render('viewOneInProgressTicket', {
            ticket
        });
    } catch (error) {
        return response.status(SERVER_ERROR_CODE).send(error.message);
    }
});

router.get('/delete/:id', async (request, response) => {
    try {
        response.send('TODO: Archive deleted tickets');
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
    const allStatusesForOneDepartment = departmentToStatusesMappingForTicketObjects[departmentName];
    let userSelectableDepartmentStatuses;
    
    try {
        userSelectableDepartmentStatuses = removeDepartmentStatusesAUserIsNotAllowedToSelect(allStatusesForOneDepartment);

        if (!userSelectableDepartmentStatuses) {
            throw new Error(`No departmentStatuses found for the department named "${departmentName}"`);
        }
    } catch (error) {
        return response.json({
            error: error.message
        });
    }

    return response.json({
        departmentStatuses: userSelectableDepartmentStatuses
    });
});

router.post('/update/:id', async (request, response) => {
    const ticketId = request.params.id;

    try {
        const updatedTicket = await TicketModel.findOneAndUpdate({_id: ticketId}, {$set: request.body}, {runValidators: true, new: true}).exec();
        response.send(updatedTicket);
    } catch (error) {
        console.log(`Failed to update ticket with id ${ticketId}. Error message: ${error.message}`);
        request.flash('errors', [error.message]);
        return response.status(SERVER_ERROR_CODE).send(error.message);
    }
});

router.get('/duration/:id', async (request, response) => {
    const ticketId = request.params.id;

    try {
        const ticket = await TicketModel.findById(ticketId).exec();
        const workflowStepTimeLedger = await workflowStepService.computeTimeTicketsHaveSpentInEachWorkflowStep([ticket._id]);

        const workflowStepTimeLedgerForTicket = workflowStepTimeLedger[ticketId];

        const department = ticket.destination.department;
        const departmentStatus = ticket.destination.departmentStatus;

        const overallDuration = workflowStepService.getOverallTicketDuration(workflowStepTimeLedgerForTicket);
        const productionDuration = workflowStepService.getHowLongTicketHasBeenInProduction(workflowStepTimeLedgerForTicket);
        const departmentDuration = workflowStepService.getHowLongTicketHasBeenInDepartment(workflowStepTimeLedgerForTicket, department);
        const listDuration = workflowStepService.getHowLongTicketHasHadADepartmentStatus(workflowStepTimeLedgerForTicket, department, departmentStatus);
        
        return response.json({
            'date-created': dateTimeService.getSimpleDate(ticket.createdAt),
            'overall-duration': dateTimeService.prettifyDuration(overallDuration),
            'production-duration': dateTimeService.prettifyDuration(productionDuration),
            'department-duration': dateTimeService.prettifyDuration(departmentDuration),
            'list-duration': dateTimeService.prettifyDuration(listDuration)
        });
    } catch (error) {
        console.log(`Failed to update ticket with id ${ticketId}. Error message: ${error.message}`);
        request.flash('errors', [error.message]);
        return response.status(SERVER_ERROR_CODE).send(error.message);
    }
});

router.get('/update/:id', async (request, response) => {
    try {
        const ticket = await TicketModel.findById(request.params.id).exec();
        const materials = await MaterialModel.find().exec();
        const departmentNames = Object.keys(departmentToStatusesMappingForTicketObjects);

        const ticketDestination = ticket.destination;
        const selectedDepartment = ticketDestination && ticketDestination.department;
        const selectedDepartmentStatus = ticketDestination && ticketDestination.departmentStatus;
        const selectedMaterial = ticket.primaryMaterial;

        const departmentStatuses = departmentToStatusesMappingForTicketObjects ? departmentToStatusesMappingForTicketObjects[selectedDepartment] : undefined;

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
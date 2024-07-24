import TicketModel from '../models/ticket';
import { COMPLETE_DEPARTMENT, departmentToNextDepartmentAndStatus } from '../enums/departmentsEnum';
import { PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE } from './chargeService';

function isEmptyObject(value) {
    if (!value) {
        return false;
    }
    return JSON.stringify(value) === '{}';
}

function isArrayContainingOnlyEmptyObjects(value) {
    if (!Array.isArray(value)) {
        return false;
    }

    return value.every(isEmptyObject);
}

function parseTicketAttributesOffOfProducts(product) {
    return {
        TicketNumber: product.TicketNumber,
        Ship_by_Date: product.Ship_by_Date,
        OrderDate: product.OrderDate,
        EstFootage: product.EstFootage,
        CustPONum: product.CustPONum,
        Priority: product.Priority,
        Notes: product.Notes,
        BillZip: product.BillZip,
        BillCity: product.BillCity,
        BillAddr1: product.BillAddr1,
        BillAddr2: product.BillAddr2,
        BillLocation: product.BillLocation,
        ShipZip: product.ShipZip,
        ShipSt: product.ShipSt,
        ShipCity: product.ShipCity,
        ShipAddr1: product.ShipAddr1,
        ShipAddr2: product.ShipAddr2,
        ShipLocation: product.ShipLocation,
        ShippingInstruc: product.ShippingInstruc,
        ShipVia: product.ShipVia,
        ShipAttn_EmailAddress: product.ShipAttn_EmailAddress,
        BillState: product.BillState,
        Company: product.Company
    };
}

export async function findDistinctTicketIdsWichAreNotCompletedAndHaveADefinedDestination() {
    const searchQueryThatExcludesTicketsWithoutADestinationAndCompletedTickets = { 
        $or: [ 
            {'destination': null}, 
            {
                'destination.department': {$ne: COMPLETE_DEPARTMENT}
            } 
        ]
    };

    const ticketIds = await TicketModel.find(searchQueryThatExcludesTicketsWithoutADestinationAndCompletedTickets)
        .distinct('_id')
        .exec();

    return ticketIds;
}

export function removeEmptyObjectAttributes(ticketObject) {
    const ticketItemKey = 'TicketItem';

    if (!Array.isArray(ticketObject[ticketItemKey])) {
        ticketObject[ticketItemKey] = [ticketObject[ticketItemKey]];
    }

    ticketObject[ticketItemKey].forEach((ticketItem, index) => {
        Object.keys(ticketItem).forEach((key) => {
            if (isEmptyObject(ticketItem[key]) || isArrayContainingOnlyEmptyObjects(ticketItem[key])) {
                delete ticketObject[ticketItemKey][index][key];
            }
        });
    });
}

export function convertedUploadedTicketDataToProperFormat(rawUploadedTicket) {
    let ticketAttributesPulledFromProducts;
    let products = [];
    let extraCharges = [];
    let hasParsedTicketAttributes = false;

    rawUploadedTicket['TicketItem'].forEach((item) => {
        const isItemAnExtraCharge = PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE.test(item['ProductNumber']);

        if (!hasParsedTicketAttributes && !isItemAnExtraCharge) { // eslint-disable-line no-magic-numbers
            ticketAttributesPulledFromProducts = parseTicketAttributesOffOfProducts(item);
            hasParsedTicketAttributes = true;
        }

        isItemAnExtraCharge ? extraCharges.push(item) : products.push(item);
    });

    return {
        ...ticketAttributesPulledFromProducts,
        products,
        extraCharges
    };
}

export async function getLengthOfEachMaterialUsedByTickets(materialIds) {
    const lengthOfEachMaterialAlreadyUsedByTickets = await TicketModel.aggregate([
        { $match: { primaryMaterial: { $in: materialIds } } },
        { $group: { _id: '$primaryMaterial', lengthUsed: { $sum: '$totalMaterialLength'}}}
    ]);
    const materialIdToLengthUsedByTickets = {};

    lengthOfEachMaterialAlreadyUsedByTickets.forEach((oneMaterialUsage) => {
        const materialId = oneMaterialUsage._id;
        const lengthUsed = oneMaterialUsage.lengthUsed;
        
        materialIdToLengthUsedByTickets[materialId] = lengthUsed;
    });

    return materialIdToLengthUsedByTickets;
}

function getNextTicketDestination(ticket) {
    const currentDepartment = ticket.destination.department;
    const [nextDepartment, nextDepartmentStatus] = departmentToNextDepartmentAndStatus[currentDepartment];

    return {
        department: nextDepartment,
        departmentStatus: nextDepartmentStatus
    };
}

export function transitionTicketToNextDepartment(ticket, attributesToUpdate) {
    const {attempts, totalFramesRan, jobComment} = attributesToUpdate;
    const currentDepartment = ticket.destination.department;

    ticket.attempts = attempts;
    ticket.totalFramesRan = totalFramesRan;
    
    ticket.totalMaterialLength = this.computeTotalMaterialLength(ticket.frameSize, ticket.totalFramesRan, ticket.attempts);

    ticket.destination = getNextTicketDestination(ticket);
    ticket.departmentToJobComment[currentDepartment] = jobComment;
}

export function computeTotalMaterialLength(frameSize, totalFramesRan, attempts) {
    const inchesPerFoot = 12;
    const feetPerAttempt = 50;

    return ((frameSize * totalFramesRan) / inchesPerFoot) + (attempts * feetPerAttempt); 
}
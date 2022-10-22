const {PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE} = require('../services/chargeService');

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

module.exports.removeEmptyObjectAttributes = (ticketObject) => {
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
};

module.exports.convertedUploadedTicketDataToProperFormat = (rawUploadedTicket) => {
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
};

module.exports.groupTicketsByDestination = (tickets) => {
    const ticketsGroupedByDestination = {};

    tickets.forEach((ticket) => {
        const department = ticket.destination ? ticket.destination.department : undefined;
        const subDepartment = ticket.destination ? ticket.destination.subDepartment : undefined;

        if (department && subDepartment) {
            const isFirstTicketFoundForThisDepartment = !ticketsGroupedByDestination[department];

            if (isFirstTicketFoundForThisDepartment) {
                ticketsGroupedByDestination[department] = {};
            }

            const isFirstTicketFoundForThisSubDepartment = !ticketsGroupedByDestination[department][subDepartment];

            if (isFirstTicketFoundForThisSubDepartment) {
                ticketsGroupedByDestination[department][subDepartment] = [];
            }

            ticketsGroupedByDestination[department][subDepartment].push(ticket);
        }
    });
    
    return ticketsGroupedByDestination;
};
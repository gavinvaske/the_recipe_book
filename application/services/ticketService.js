const ProductModel = require('../models/product');
const TicketModel = require('../models/ticket');

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
        BillState: product.BillState
    }
}

module.exports.removeEmptyObjectAttributes = (ticketObject) => {
    const ticketItemKey = 'TicketItem';

    ticketObject[ticketItemKey].forEach((ticketItem, index) => {
        Object.keys(ticketItem).forEach((key) => {
            if (isEmptyObject(ticketItem[key]) || isArrayContainingOnlyEmptyObjects(ticketItem[key])) {
                delete ticketObject[ticketItemKey][index][key];
            }
        });
    });
};

module.exports.convertRawJsonIntoTicketObject = (ticketAsJson) => {
    let ticketAttributesPulledFromProducts;
    let products = [];

    ticketAsJson['TicketItem'].forEach((productAttributes, index) => {
        if (index === 0) {
            ticketAttributesPulledFromProducts = parseTicketAttributesOffOfProducts(productAttributes)
        }

        products.push(productAttributes);
    });

    return {
        ...ticketAttributesPulledFromProducts,
        products
    };
};
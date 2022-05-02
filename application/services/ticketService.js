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
        BillState: product.BillState
    };
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

module.exports.convertedUploadedTicketDataToProperFormat = (rawUploadedTicket) => {
    let ticketAttributesPulledFromProducts;
    let products = [];
    let extraCharges = [];

    rawUploadedTicket['TicketItem'].forEach((item, index) => {
        if (index === 0) { // eslint-disable-line no-magic-numbers
            ticketAttributesPulledFromProducts = parseTicketAttributesOffOfProducts(item);
        }

        PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE.test(item['ProductNumber']) ? extraCharges.push(item) : products.push(item);
    });

    return {
        ...ticketAttributesPulledFromProducts,
        products,
        extraCharges
    };
};
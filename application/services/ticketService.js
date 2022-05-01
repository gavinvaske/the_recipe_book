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
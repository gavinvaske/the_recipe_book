function isEmptyObject(value) {
    if (!value) {
        return false;
    }
    return JSON.stringify(value) === '{}';
}

module.exports.removeEmptyObjectAttributes = (ticketObject) => {
    const ticketItemKey = 'TicketItem';

    ticketObject[ticketItemKey].forEach((ticketItem, index) => {
        Object.keys(ticketItem).forEach((key) => {
            if (isEmptyObject(ticketItem[key])) {
                delete ticketObject[ticketItemKey][index][key];
            }
        });
    });
};
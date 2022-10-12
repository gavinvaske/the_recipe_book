module.exports.selectProductFromTicket = (ticket, productNumberToLookFor) => {
    return ticket.products && ticket.products.find(({productNumber}) => {
        return productNumber === productNumberToLookFor;
    });
};
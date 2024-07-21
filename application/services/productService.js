export function selectProductFromTicket(ticket, productIdToFind) {
    if (!ticket) {
        return;
    }

    return ticket.products && ticket.products.find(({_id}) => {
        const thisProductId = _id && _id.toString();
        return thisProductId === productIdToFind;
    });
}
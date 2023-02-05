const EVENT_TICKET_CREATED = 'TICKET_CREATED';
const EVENT_MATERIAL_INVENTORY_CREATED_OR_UPDATED = 'MATERIAL_INVENTORY_CREATED_OR_UPDATED';

$( document ).ready(function() {
    let socket;

    try {
        socket = io();
    } catch {
        alert('Error, the socket.io library was not imported correctly and made available for a javascript file to use, contact a developer to resolve this.');
        throw new Error('socket.io was not imported correctly for use in a front-end js file and thus none of the socket listeners could be enabled, contact a developer to resolve this.');
    }
    
    socket.on(EVENT_TICKET_CREATED, function(ticket) { // eslint-disable-line no-unused-vars
        location.reload();
    });

    socket.on(EVENT_MATERIAL_INVENTORY_CREATED_OR_UPDATED, function(materialInventoryInformation) {
        const materialObjectId = materialInventoryInformation.materialObjectId;

        const {
            lengthOfAllMaterialsInInventory,
            lengthOfAllMaterialsOrdered,
            totalPurchaseOrders,
            lengthOfMaterialInStock,
            lengthOfMaterialOrdered,
            purchaseOrder
        } = materialInventoryInformation;

        $('.total-length-of-material-in-inventory').text(lengthOfAllMaterialsInInventory);
        $('.total-length-of-material-ordered').text(lengthOfAllMaterialsOrdered);
        $('.total-purchase-ordered').text(totalPurchaseOrders);

        $(`#${materialObjectId} .material-length-in-stock`).text(lengthOfMaterialInStock);
        $(`#${materialObjectId} .material-length-ordered`).text(lengthOfMaterialOrdered);

        $(`.${purchaseOrder._id} .po-number`).text(purchaseOrder.purchaseOrderNumber);
        
        const purchaseOrderArrivalDate = new Date(purchaseOrder.arrivalDate).toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC'}).substring(0, 10); // eslint-disable-line no-magic-numbers
        $(`.${purchaseOrder._id} .po-arrival-date`).text(purchaseOrderArrivalDate);
        
        const purchaseOrderTotalLength = purchaseOrder.feetPerRoll * purchaseOrder.totalRolls;
        $(`.${purchaseOrder._id} .po-total-length`).text(purchaseOrderTotalLength);
    });
});
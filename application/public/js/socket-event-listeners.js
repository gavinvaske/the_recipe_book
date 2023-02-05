import '/socket.io/socket.io.js';

const EVENT_TICKET_CREATED = 'TICKET_CREATED';
const EVENT_MATERIAL_INVENTORY_CREATED_OR_UPDATED = 'MATERIAL_INVENTORY_CREATED_OR_UPDATED';

$( document ).ready(function() {
    const socket = io();
    
    socket.on(EVENT_TICKET_CREATED, function(ticket) {
      location.reload();
    });

    socket.on(EVENT_MATERIAL_INVENTORY_CREATED_OR_UPDATED, function(materialInventoryInformation) {
        const materialObjectId = materialInventoryInformation.materialObjectId

        const {
            lengthOfAllMaterialsInInventory,
            lengthOfAllMaterialsOrdered,
            totalPurchaseOrders,
            lengthOfMaterialInStock,
            lengthOfMaterialOrdered,
            purchaseOrder
        } = materialInventoryInformation

        $(`.total-length-of-material-in-inventory`).text(lengthOfAllMaterialsInInventory);
        $(`.total-length-of-material-ordered`).text(lengthOfAllMaterialsOrdered);
        $(`.total-purchase-ordered`).text(totalPurchaseOrders);

        $(`#${materialObjectId} .material-length-in-stock`).text(lengthOfMaterialInStock);
        $(`#${materialObjectId} .material-length-ordered`).text(lengthOfMaterialOrdered);

        $(`.${purchaseOrder._id} .po-number`).text(purchaseOrder.purchaseOrderNumber);
        
        const purchaseOrderArrivalDate = new Date(purchaseOrder.arrivalDate).toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC'}).substring(0, 10)
        $(`.${purchaseOrder._id} .po-arrival-date`).text(purchaseOrderArrivalDate);
        
        const purchaseOrderTotalLength = purchaseOrder.feetPerRoll * purchaseOrder.totalRolls;
        $(`.${purchaseOrder._id} .po-total-length`).text(purchaseOrderTotalLength);
      });
});
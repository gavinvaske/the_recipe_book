const chance = require('chance').Chance();
const TicketModel = require('../../application/models/ticket');

function convertNumberToString(value) {
    return `${value}`;
}

describe('validation', () => {
    let ticketAttributes;

    beforeEach(() => {
        ticketAttributes = {
            TicketNumber:  convertNumberToString(chance.integer({min: 0})),
            Ship_by_Date: chance.string(),
            OrderDate: chance.string(),
            EstFootage: convertNumberToString(chance.floating()),
            PO_Number: chance.string(),
            Priority: chance.string(),
            Notes: chance.string(),
            BillZip: chance.string(),
            BillCity: chance.string(),
            BillAddr1: chance.string(),
            BillAddr2: chance.string(),
            BillLocation: chance.string(),
            ShipZip: chance.string(),
            ShipState: chance.string(),
            ShipCity: chance.string(),
            ShipAddr1: chance.string(),
            ShipAddr2: chance.string(),
            ShipLocation: chance.string(),
            ShipInstruc: chance.string(),
            ShipVia: chance.string(),
            ShipAttn_EmailAddress: chance.string(),
            BillState: chance.string(),
        };
    });

    it('should validate if all attributes are defined successfully', () => {
        const ticket = new TicketModel(ticketAttributes);
    
        const error = ticket.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: ticketNumber (aka TicketNumber)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.ticketNumber).toBeDefined();
        });

        it('should fail if ticketNumber does not contain ONLY digits', () => {
            const validTicketNumber = chance.integer({min: 0});
            const invalidTicketNumber = validTicketNumber + chance.word();
            ticketAttributes.TicketNumber = invalidTicketNumber;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if attribute is missing', () => {
            delete ticketAttributes.TicketNumber;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type String', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.ticketNumber).toEqual(expect.any(String));
        });
    });

    describe('attribute: shipDate (aka Ship_by_Date)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shipDate).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete ticketAttributes.Ship_by_Date;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });
    });

    describe('attribute: orderDate (aka OrderDate)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.orderDate).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.OrderDate;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: estimatedFootage (aka EstFootage)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.estimatedFootage).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete ticketAttributes.EstFootage;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.estimatedFootage).toEqual(expect.any(Number));
        });
    });

    describe('attribute: poNumber (aka PO_Number)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.poNumber).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete ticketAttributes.PO_Number;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type String', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.poNumber).toEqual(expect.any(String));
        });
    });

    describe('attribute: priority (aka Priority)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.priority).toBeDefined();
        });

        it('should fail validation if attribute is missing', () => {
            delete ticketAttributes.Priority;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type String', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.priority).toEqual(expect.any(String));
        });
    });

    describe('attribute: notes (aka Notes)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.notes).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.Notes;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type String', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.notes).toEqual(expect.any(String));
        });
    });

    describe('attribute: billingZipCode (aka BillZip)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.billingZipCode).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.BillZip;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: billingCity (aka BillCity)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.billingCity).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.BillCity;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: billingAddress (aka BillAddr1)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.billingAddress).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.BillAddr1;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: billingUnitNumber (aka BillAddr2)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.billingUnitNumber).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.BillAddr2;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: billingLocationName (aka BillLocation)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.billingLocationName).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.BillLocation;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shipZipCode (aka ShipZip)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shipZipCode).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipZip;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shipState (aka ShipState)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shipState).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipState;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shipCity (aka ShipCity)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shipCity).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipCity;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shippingAddress (aka ShipAddr1)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shippingAddress).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipAddr1;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shippingUnitNumber (aka ShipAddr2)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shippingUnitNumber).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipAddr2;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shippingLocationName (aka ShipLocation)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shippingLocationName).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipLocation;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shippingInstructions (aka ShipInstruc)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shippingInstructions).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipInstruc;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shippingMethod (aka ShipVia)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shippingMethod).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipVia;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shippingEmailAddress (aka ShipAttn_EmailAddress)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shippingEmailAddress).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipAttn_EmailAddress;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: billingState (aka BillState)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.billingState).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.BillState;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });
});
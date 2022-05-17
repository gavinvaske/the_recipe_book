const chance = require('chance').Chance();
const TicketModel = require('../../application/models/ticket');
const {departments} = require('../../application/enums/departmentsEnum');

describe('validation', () => {
    let ticketAttributes;

    beforeEach(() => {
        ticketAttributes = {
            TicketNumber:  String(chance.integer({min: 0})),
            Ship_by_Date: chance.date({string: true}),
            OrderDate: chance.date({string: true}),
            EstFootage: String(chance.integer({min: 1})),
            CustPONum: chance.string(),
            Priority: chance.string(),
            BillZip: chance.string(),
            BillCity: chance.string(),
            BillAddr1: chance.string(),
            BillAddr2: chance.string(),
            BillLocation: chance.string(),
            ShipZip: chance.string(),
            ShipSt: chance.string(),
            ShipCity: chance.string(),
            ShipAddr1: chance.string(),
            ShipAddr2: chance.string(),
            ShipLocation: chance.string(),
            ShippingInstruc: chance.string(),
            ShipVia: chance.string(),
            ShipAttn_EmailAddress: chance.string(),
            BillState: chance.string(),
            printingType: 'BLACK & WHITE',
            destination: {}
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

        it('should fail if date is invalid', () => {
            const invalidDate = chance.word();
            ticketAttributes.Ship_by_Date = invalidDate;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
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

        it('should fail if date is invalid', () => {
            const invalidDate = chance.word();
            ticketAttributes.OrderDate = invalidDate;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
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

        it('should fail if attribute is not an integer', () => {
            ticketAttributes.EstFootage = chance.floating({fixed: 8});
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail if attribute is less than zero', () => {
            ticketAttributes.EstFootage = chance.integer({max: 0});
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
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

    describe('attribute: poNumber (aka CustPONum)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.poNumber).toBeDefined();
        });

        it('should NOT fail validation if attribute is missing', () => {
            delete ticketAttributes.CustPONum;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
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

    describe('attribute: shipState (aka ShippingInstruc)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shipState).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShippingInstruc;
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

    describe('attribute: shippingInstructions (aka ShippingInstruc)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shippingInstructions).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShippingInstruc;
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

    describe('attribute: totalLabelQty', () => {
        beforeEach(() => {
            ticketAttributes.products = [{labelQty: 99}, {labelQty: 13}];
        });

        it('should be a number', async () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalLabelQty).toEqual(expect.any(Number));
        });

        it('should compute the attribute correctly when products exist', async () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalLabelQty).toEqual(ticketAttributes.products[0].labelQty + ticketAttributes.products[1].labelQty);
        });

        it('should compute the attribute correctly when NO products exist', async () => {
            delete ticketAttributes.products;
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalLabelQty).toEqual(0); // eslint-disable-line no-magic-numbers
        });
    });

    describe('attribute: totalWindingRolls', () => {
        beforeEach(() => {
            ticketAttributes.products = [{totalWindingRolls: chance.integer({min: 1})}, {totalWindingRolls: chance.integer({min: 1})}];
        });
        it('should be a number', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalWindingRolls).toEqual(expect.any(Number));
        });

        it('should compute the attribute correctly', async () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalWindingRolls).toEqual(ticketAttributes.products[0].totalWindingRolls + ticketAttributes.products[1].totalWindingRolls);
        });
    });

    describe('attribute: printingType', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.printingType).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.printingType;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should fail validation if attribute IS NOT an accepted value', () => {
            ticketAttributes.printingType = chance.string();
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass validation if attribute IS an accepted value', () => {
            ticketAttributes.printingType = 'CMYK OV + W';
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: destination', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.destination).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.destination;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should pass validation if attribute exists but department/subdepartment are both not defined', () => {
            ticketAttributes.destination = {};
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should fail validation if subDepartment attribute IS NOT an accepted value', () => {
            const validDepartment = chance.pickone(Object.keys(departments));
            const invalidSubDepartment = chance.string();

            ticketAttributes.destination = {
                department: validDepartment,
                subDepartment: invalidSubDepartment
            };
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if department attribute IS NOT an accepted value', () => {
            const validDepartment = chance.pickone(Object.keys(departments));
            const invalidDepartment = chance.string();
            const validSubDepartment = chance.pickone(departments[validDepartment]);

            ticketAttributes.destination = {
                department: invalidDepartment,
                subDepartment: validSubDepartment
            };
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if exactly one of either department or subdepartment is left blank', () => {
            const validDepartment = chance.pickone(Object.keys(departments));
            const validSubDepartment = chance.pickone(departments[validDepartment]);
            const department = chance.pickone(validDepartment, undefined);
            const subDepartment = !department ? validSubDepartment : undefined;

            ticketAttributes.destination = {
                department,
                subDepartment
            };

            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });
    });
});
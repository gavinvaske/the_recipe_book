const chance = require('chance').Chance();
const TicketModel = require('../../application/models/ticket');
const {subDepartmentsGroupedByDepartment} = require('../../application/enums/departmentsEnum');
const databaseService = require('../../application/services/databaseService');

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
            ShipAttn_EmailAddress: chance.email(),
            BillState: chance.string(),
            destination: {},
            departmentNotes: {},
            Company: chance.string()
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

        it('should fail validation if attribute is defined but not a valid email address', () => {
            ticketAttributes.ShipAttn_EmailAddress = chance.string();
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
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
            const validDepartment = 'PRE-PRESS';
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
            const validDepartment = 'ART-PREP';
            const invalidDepartment = chance.string();
            const validSubDepartment = chance.pickone(subDepartmentsGroupedByDepartment[validDepartment]);

            ticketAttributes.destination = {
                department: invalidDepartment,
                subDepartment: validSubDepartment
            };
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if exactly one of either department or subdepartment is left blank', () => {
            const validDepartment = 'ORDER PREP';
            const invalidSubDepartment = undefined;

            ticketAttributes.destination = {
                department: validDepartment,
                subDepartment: invalidSubDepartment
            };

            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if department is COMPLETED and subDepartment is defined', () => {
            const validDepartment = 'COMPLETED';
            const invalidSubDepartment = chance.word();
    
            ticketAttributes.destination = {
                department: validDepartment,
                subDepartment: invalidSubDepartment
            };
    
            const ticket = new TicketModel(ticketAttributes);
    
            const error = ticket.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should pass validation if department is COMPLETED and subDepartment not defined', () => {
            const validDepartment = 'COMPLETED';

            ticketAttributes.destination = {
                department: validDepartment
            };

            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: departmentNotes', () => {
        let departmentNotes;

        beforeEach(() => {
            departmentNotes = {
                orderPrep: chance.string(),
                artPrep: chance.string(),
                prePress: chance.string(),
                printing: chance.string(),
                cutting: chance.string(),
                winding: chance.string(),
                shipping: chance.string(),
                billing: chance.string(),
            };
        });

        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.departmentNotes).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.departmentNotes;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should store all notes for every department', () => {
            ticketAttributes.departmentNotes = departmentNotes;

            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.departmentNotes.orderPrep).toEqual(departmentNotes.orderPrep);
            expect(ticket.departmentNotes.artPrep).toEqual(departmentNotes.artPrep);
            expect(ticket.departmentNotes.prePress).toEqual(departmentNotes.prePress);
            expect(ticket.departmentNotes.printing).toEqual(departmentNotes.printing);
            expect(ticket.departmentNotes.cutting).toEqual(departmentNotes.cutting);
            expect(ticket.departmentNotes.winding).toEqual(departmentNotes.winding);
            expect(ticket.departmentNotes.shipping).toEqual(departmentNotes.shipping);
            expect(ticket.departmentNotes.billing).toEqual(departmentNotes.billing);
        });

        it('should fail validation if unknown key is used', () => {
            const unknownKey = chance.word();
            ticketAttributes.departmentNotes = {
                [unknownKey]: chance.string()
            };
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });
    });

    describe('attribute: primaryMaterial', () => {

        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        it('should contain attribute', () => {
            ticketAttributes.primaryMaterial = chance.word();
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.primaryMaterial).toBeDefined();
        });

        it('should not fail validation if blank', () => {
            ticketAttributes.primaryMaterial = '';
            const ticket = new TicketModel(ticketAttributes);
    
            const error = ticket.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should fail validation if primaryMaterial is not an existing material ID', async () => {
            ticketAttributes.primaryMaterial = chance.word();
            const ticket = new TicketModel(ticketAttributes);
    
            const error = ticket.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should pass validation if primaryMaterial is not an existing material ID', async () => {
            ticketAttributes.primaryMaterial = chance.word();
            const ticket = new TicketModel(ticketAttributes);
    
            const error = ticket.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should default the ticket.primaryMaterial to product[0].primaryMaterial', async () => {
            delete ticketAttributes.primaryMaterial;

            ticketAttributes.products = [
                {primaryMaterial: chance.word()}
            ];
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.primaryMaterial).toBe(ticketAttributes.products[0].primaryMaterial);
        });

        it('should use the ticket.primaryMaterial to override all ticket.products[n].primaryMaterial before saving', async () => {
            const materialA = chance.word();
            const materialB = chance.word();

            ticketAttributes.primaryMaterial = materialA;

            ticketAttributes.products = [
                {primaryMaterial: materialB},
                {primaryMaterial: materialB},
                {primaryMaterial: undefined},
            ];
            const ticket = new TicketModel(ticketAttributes);

            const savedTicket = await ticket.save({validateBeforeSave: false});

            expect(savedTicket.products[0].primaryMaterial).toBe(savedTicket.primaryMaterial);
            expect(savedTicket.products[1].primaryMaterial).toBe(savedTicket.primaryMaterial);
            expect(savedTicket.products[2].primaryMaterial).toBe(savedTicket.primaryMaterial);
        });
    });

    describe('attribute: Company', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.Company).toBeDefined();
        });

        it('should be of type String', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.Company).toEqual(expect.any(String));
        });

        it('should fail validation if attribute is missing', () => {
            delete ticketAttributes.Company;
            const ticket = new TicketModel(ticketAttributes);
    
            const error = ticket.validateSync();
    
            expect(error).toBeDefined();
        });
    });
});
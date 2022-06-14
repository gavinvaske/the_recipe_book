const chance = require('chance').Chance();
const ticketService = require('../../application/services/ticketService');

const TICKET_ITEM_KEY = 'TicketItem';

function getStandardProduct() {
    return {
        'ProductNumber': chance.word(),
        'TicketNumber': chance.word(),
        'Ship_by_Date': chance.word(),
        'OrderDate': chance.word(),
        'EstFootage': chance.word(),
        'CustPONum': chance.word(),
        'Priority': chance.word(),
        'Notes': chance.word(),
        'BillZip': chance.word(),
        'BillCity': chance.word(),
        'BillAddr1': chance.word(),
        'BillAddr2': chance.word(),
        'BillLocation': chance.word(),
        'ShipZip': chance.word(),
        'ShipSt': chance.word(),
        'ShipCity': chance.word(),
        'ShipAddr1': chance.word(),
        'ShipAddr2': chance.word(),
        'ShipLocation': chance.word(),
        'ShippingInstruc': chance.word(),
        'ShipVia': chance.word(),
        'ShipAttn_EmailAddress': chance.word(),
        'BillState': chance.word()
    };
}

function getExtraCharge() {
    const product = getStandardProduct();
    product.ProductNumber = chance.word() + `-${chance.letter()}`;

    return product;
}

describe('ticketService test suite', () => {
    let ticket;

    describe('pre-parsing ticket object', () => {

        beforeEach(() => {
            ticket = {
                [TICKET_ITEM_KEY]: [
                    {
                        'attribute1': chance.string(),
                        'attribute2': undefined,
                        'attribute3': '',
                        'attribute4': {},
                        'attribute5': [{}, {}],
                        'attribute6': [{}, chance.word()],
                    }
                ]};
        });
    
        it('should remove attributes whose value is an empty object', () => {
            ticketService.removeEmptyObjectAttributes(ticket);
    
            expect('attribute4' in ticket[TICKET_ITEM_KEY][0]).toBeFalsy();
        });
    
        it('should remove attributes whose value is an array of empty objects', () => {
            ticketService.removeEmptyObjectAttributes(ticket);
    
            expect('attribute5' in ticket[TICKET_ITEM_KEY][0]).toBeFalsy();
        });
    
        it('should NOT remove attributes whose value is an array containing non-empty objects', () => {
            ticketService.removeEmptyObjectAttributes(ticket);
    
            expect('attribute6' in ticket[TICKET_ITEM_KEY][0]).toBeTruthy();
        });
    
        it('should remove the correct number of attributes', () => {
            const expectedNumberOfAttributesToBeRemoved = 2;
            const numberOfKeysBeforeDeletion = Object.keys(ticket[TICKET_ITEM_KEY][0]).length;
            
            ticketService.removeEmptyObjectAttributes(ticket);
    
            expect(Object.keys(ticket[TICKET_ITEM_KEY][0]).length).toBe(numberOfKeysBeforeDeletion - expectedNumberOfAttributesToBeRemoved);
        });
    });

    describe('processing raw data from json', () => {
        let rawTicket,
            numberOfProducts,
            numberOfCharges;

    
        beforeEach(() => {
            numberOfProducts = chance.d20();
            numberOfCharges = chance.d20();

            rawTicket = {
                [TICKET_ITEM_KEY]: [
                    ...chance.n(getStandardProduct, numberOfProducts),
                    ...chance.n(getExtraCharge, numberOfCharges)
                ]};
        });
    
        it('should return an object with the correct number of products and charges defined', () => {
            const ticket = ticketService.convertedUploadedTicketDataToProperFormat(rawTicket);

            console.log(`ticket => ${JSON.stringify(ticket)}`);

            expect(ticket.products.length).toBe(numberOfProducts);
            expect(ticket.extraCharges.length).toBe(numberOfCharges);
        });
    });

    describe('groupTicketsByDepartment', () => {
        let ticketsWithDepartments;
        let ticketsWithoutDepartments;
        let allTickets;
        let departmentNames;

        beforeEach(() => {
            departmentNames = [chance.word(), chance.word(), chance.word()];
            subDepartmentNames = [chance.word(), chance.word(), chance.word()];
            ticketsWithDepartments = [
                {
                    destination: {
                        department: departmentNames[0],
                        subDepartment: subDepartmentNames[0],
                    }
                },
                {
                    destination: {
                        department: departmentNames[1],
                        subDepartment: subDepartmentNames[1],
                    }
                },
                {
                    destination: {
                        department: departmentNames[2],
                        subDepartment: subDepartmentNames[2],
                    }
                }
            ];
            ticketsWithoutDepartments = [{}, {}, {}, {}, {}];

            allTickets = [...ticketsWithDepartments, ...ticketsWithoutDepartments];
        });

        it('should generate correct department names', () => {
            const groupedTicketsByDepartment = ticketService.groupTicketsByDestination(allTickets);

            console.log(groupedTicketsByDepartment);

            expect(Object.keys(groupedTicketsByDepartment).length).toEqual(departmentNames.length);
            expect(Object.keys(groupedTicketsByDepartment)).toEqual(expect.arrayContaining([departmentNames[0], departmentNames[1], departmentNames[2]]));
        });

        it('should map list of tickets according to department', () => {
            const groupedTicketsByDepartment = ticketService.groupTicketsByDestination(allTickets);

            expect(Object.keys(groupedTicketsByDepartment).length).toBe(departmentNames.length);
        });

        it('should ignore tickets whose department and/or subDepartment is unknown', () => {
            const numberOfTicketsWithAValidDepartmentAndSubDepartment = allTickets.length;

            ticketsWithoutADepartmentOrSubDepartment = [
                {
                    destination: {
                        department: chance.word(),
                        subDepartment: undefined,
                    }
                },
                {
                    destination: {
                        department: undefined,
                        subDepartment: chance.word(),
                    }
                },
                {
                    destination: {
                        department: undefined,
                        subDepartment: undefined,
                    }
                }
            ];

            allTickets = [
                ...allTickets,
                ...ticketsWithoutADepartmentOrSubDepartment
            ];
            const groupedTicketsByDepartment = ticketService.groupTicketsByDestination(allTickets);

            expect(groupedTicketsByDepartment.length).toBe(numberOfTicketsWithAValidDepartmentAndSubDepartment.length);
        });
    });
});


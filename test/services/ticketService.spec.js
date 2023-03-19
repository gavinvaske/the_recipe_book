const chance = require('chance').Chance();
const ticketService = require('../../application/services/ticketService');
const {
    getAllDepartmentsWithDepartmentStatuses, 
    departmentToStatusesMappingForTicketObjects, 
    COMPLETE_DEPARTMENT,
    departmentToNextDepartmentAndStatus
} = require('../../application/enums/departmentsEnum');
const { when } = require('jest-when');

const mockTicketModel = require('../../application/models/ticket');
jest.mock('../../application/models/ticket');

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

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('findDistinctTicketIdsWichAreNotCompletedAndHaveADefinedDestination()', () => {
        let distinctTicketIdsInDatabase;

        beforeEach(() => {
            distinctTicketIdsInDatabase = [];
            execFunction = jest.fn().mockResolvedValue(distinctTicketIdsInDatabase);
            distinctFunction = jest.fn().mockImplementation(() => {
                return {
                    exec: execFunction
                };
            });
            findFunction = jest.fn().mockImplementation(() => {
                return {
                    distinct: distinctFunction
                };
            });

            mockTicketModel.find.mockImplementation(findFunction);
        });

        it ('should not throw error', async () => {
            await expect(ticketService.findDistinctTicketIdsWichAreNotCompletedAndHaveADefinedDestination()).resolves.not.toThrowError();
        });

        it ('should use the correct query when searching for tickets from database', async () => {
            const expectedFindQuery = { 
                $or: [ 
                    {'destination': null}, 
                    {
                        'destination.department': {$ne: COMPLETE_DEPARTMENT}
                    } 
                ]
            };
            await ticketService.findDistinctTicketIdsWichAreNotCompletedAndHaveADefinedDestination();

            expect(findFunction).toHaveBeenCalledTimes(1);
            expect(findFunction).toHaveBeenCalledWith(expectedFindQuery);
        });

        it ('should only return distinct _ids from the query results', async () => {
            const expectedDistinctAttributes = '_id';
            await ticketService.findDistinctTicketIdsWichAreNotCompletedAndHaveADefinedDestination();

            expect(distinctFunction).toHaveBeenCalledTimes(1);
            expect(distinctFunction).toHaveBeenCalledWith(expectedDistinctAttributes);
        });

        it ('should search for tickets from database using the correct mongoose query methods', async () => {
            await ticketService.findDistinctTicketIdsWichAreNotCompletedAndHaveADefinedDestination();

            expect(findFunction).toHaveBeenCalledTimes(1);
            expect(distinctFunction).toHaveBeenCalledTimes(1);
            expect(execFunction).toHaveBeenCalledTimes(1);
        });

        it ('should return the results from the query', async () => {
            distinctTicketIdsInDatabase = chance.n(chance.integer, chance.integer({min: 1, max: 100}));
            execFunction = jest.fn().mockResolvedValue(distinctTicketIdsInDatabase);

            const distinctTicketIds = await ticketService.findDistinctTicketIdsWichAreNotCompletedAndHaveADefinedDestination();

            expect(distinctTicketIds).toEqual(distinctTicketIdsInDatabase);
        });
    });

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

            expect(ticket.products.length).toBe(numberOfProducts);
            expect(ticket.extraCharges.length).toBe(numberOfCharges);
        });
    });

    describe('groupTicketsByDepartment', () => {
        const allDepartmentsWithAtLeastOneDepartmentStatus = getAllDepartmentsWithDepartmentStatuses();

        it('should generate correct number of departments in the datastructure even if no tickets were passed in', () => {
            const emptyTicketsArray = [];
            const groupedTicketsByDepartment = ticketService.groupTicketsByDestination(emptyTicketsArray);

            expect(Object.keys(groupedTicketsByDepartment).length).toEqual(allDepartmentsWithAtLeastOneDepartmentStatus.length);
        });

        it('should generate correct number of departmentsStatuses in the datastructure even if no tickets were passed in', () => {
            const emptyTicketsArray = [];
            const groupedTicketsByDepartment = ticketService.groupTicketsByDestination(emptyTicketsArray);

            expect(Object.keys(groupedTicketsByDepartment).length).toEqual(allDepartmentsWithAtLeastOneDepartmentStatus.length);
            expect(Object.keys(groupedTicketsByDepartment).sort()).toEqual(allDepartmentsWithAtLeastOneDepartmentStatus.sort());
        });

        it('should map list of tickets according to department', () => {
            const emptyTicketsArray = [];
            const groupedTicketsByDepartment = ticketService.groupTicketsByDestination(emptyTicketsArray);
            let departmentStatusesInDataStructure = [];
            let allDepartmentStatuses = [];

            Object.values(departmentToStatusesMappingForTicketObjects).forEach((departmentStatusesForOneDepartment) => {
                allDepartmentStatuses.push(...departmentStatusesForOneDepartment);
            });

            Object.keys(groupedTicketsByDepartment).forEach((departmentName) => {
                const group = groupedTicketsByDepartment[departmentName];

                departmentStatusesInDataStructure = [
                    ...departmentStatusesInDataStructure,
                    ...Object.keys(group)
                ]; 
            });

            console.log(departmentStatusesInDataStructure);

            expect(departmentStatusesInDataStructure.length).toBe(allDepartmentStatuses.length);
        });

        it('should ignore tickets whose department and/or departmentStatus is unknown', () => {
            const validTickets = chance.n(buildATicketWithAValidDesintation, chance.integer({min: 0, max: 100}));
            const invalidTickets = chance.n(buildTicketWithoutAValidDestination, chance.integer({min: 0, max: 100}));
            
            const tickets = [...validTickets, ...invalidTickets];

            const groupedTicketsByDepartment = ticketService.groupTicketsByDestination(tickets);

            expect(countNumberOfTicketsGroupedByDestination(groupedTicketsByDepartment)).toBe(validTickets.length);
        });
    });

    describe('getLengthOfEachMaterialUsedByTickets()', () => {
        let materialIds;

        beforeEach(() => {
            when(mockTicketModel.aggregate)
                .calledWith(expect.any(Array))
                .mockResolvedValue([]);
        });

        it('should not throw an error', async () => {
            materialIds = [];
            await expect(ticketService.getLengthOfEachMaterialUsedByTickets(materialIds)).resolves.not.toThrowError();
        });

        it('should return an empty object if materialIds is empty', async () => {
            materialIds = [];
            const emptyObject = {};

            const actualMaterialIdToLength = await ticketService.getLengthOfEachMaterialUsedByTickets(materialIds);

            expect(actualMaterialIdToLength).toEqual(emptyObject);
        });

        it('should call mongoose aggregate with correct params', async () => {
            const aggregateParams = [
                { $match: { primaryMaterial: { $in: materialIds } } },
                { $group: { _id: '$primaryMaterial', lengthUsed: { $sum: '$totalMaterialLength'}}}
            ];
            await ticketService.getLengthOfEachMaterialUsedByTickets(materialIds);

            expect(mockTicketModel.aggregate).toHaveBeenCalledWith(aggregateParams);
            expect(mockTicketModel.aggregate).toHaveBeenCalledTimes(1);
        });

        it('should return the a correctly computed object', async () => {
            const materialId1 = chance.word();
            const materialId2 = chance.word();
            const materialId3 = chance.word();
            const materialLengthUsed1 = chance.integer({min: 0});
            const materialLengthUsed2 = chance.integer({min: 0});
            const materialLengthUsed3 = chance.integer({min: 0});

            materialIds = [materialId1, materialId2, materialId3];

            const aggregatedMaterialUsage = [
                {_id: materialId1, lengthUsed: materialLengthUsed1},
                {_id: materialId2, lengthUsed: materialLengthUsed2},
                {_id: materialId3, lengthUsed: materialLengthUsed3}
            ];
            const aggregateParams = [
                { $match: { primaryMaterial: { $in: materialIds } } },
                { $group: { _id: '$primaryMaterial', lengthUsed: { $sum: '$totalMaterialLength'}}}
            ];
            const expectedMaterialIdToLengthUsed = {
                [materialId1]: materialLengthUsed1,
                [materialId2]: materialLengthUsed2,
                [materialId3]: materialLengthUsed3
            };
            when(mockTicketModel.aggregate)
                .calledWith(aggregateParams)
                .mockResolvedValue(aggregatedMaterialUsage);

            const actualMaterialIdToLengthUsed = await ticketService.getLengthOfEachMaterialUsedByTickets(materialIds);

            expect(actualMaterialIdToLengthUsed).toEqual(expectedMaterialIdToLengthUsed);
        });
    });

    describe('transitionTicketToNextDepartment', () => {
        let attributesToUpdate,
            ticket;

        beforeEach(() => {
            const departmentsToPickFrom = Object.keys(departmentToNextDepartmentAndStatus);
            attributesToUpdate = {
                attempts: chance.d100(),
                totalFramesRan: chance.d12(),
                jobComment: chance.string()
            };
            ticket = {
                destination: {
                    department: chance.pickone(departmentsToPickFrom)
                },
                frameSize: chance.floating({min: 1, fixed: 2}),
                departmentToJobComment: {}
            };
        });

        it('should not throw error if neccessary attributes are not provided', () => {
            expect(() => ticketService.transitionTicketToNextDepartment(ticket, attributesToUpdate)).not.toThrow();
        });

        it('should throw error if ticket does not have a destination attribute', () => {
            delete ticket.destination;

            expect(() => ticketService.transitionTicketToNextDepartment(ticket, attributesToUpdate)).toThrow();
        });

        it('should update the attribute "attempts" and "totalFramesRan" attribute on the ticket', () => {
            ticketService.transitionTicketToNextDepartment(ticket, attributesToUpdate);

            expect(ticket.attempts).toEqual(attributesToUpdate.attempts);
            expect(ticket.totalFramesRan).toEqual(attributesToUpdate.totalFramesRan);
        });

        it('should update the attribute "totalMaterialLength" attribute based on the correct formula', () => {
            const feetPerAttempt = 50;
            const inchesPerFoot = 12;
            const expectedTotalMaterialLength = (attributesToUpdate.attempts * feetPerAttempt) + ((attributesToUpdate.totalFramesRan * ticket.frameSize) / inchesPerFoot);

            ticketService.transitionTicketToNextDepartment(ticket, attributesToUpdate);

            expect(ticket.totalMaterialLength).toEqual(expectedTotalMaterialLength);
        });

        it('should update the "destination.department" attribute to the next department', () => {
            const [nextDepartment, nextDepartmentStatus] = departmentToNextDepartmentAndStatus[ticket.destination.department];

            ticketService.transitionTicketToNextDepartment(ticket, attributesToUpdate);

            expect(ticket.destination.department).toEqual(nextDepartment);
            expect(ticket.destination.departmentStatus).toEqual(nextDepartmentStatus);
        });

        it('should update the "departmentToJobComment" attribute with job comment', () => {
            const department = ticket.destination.department;
            const expectedDepartmentToJobComment = {
                [department]: attributesToUpdate.jobComment
            };
            ticketService.transitionTicketToNextDepartment(ticket, attributesToUpdate);

            expect(ticket.departmentToJobComment).toEqual(expectedDepartmentToJobComment);
        });
    });
});

function countNumberOfTicketsGroupedByDestination(ticketsGroupedByDestination) {
    let numberOfTickets = 0;

    Object.keys(ticketsGroupedByDestination).forEach((department) => {
        const departmentStatuses = Object.keys(ticketsGroupedByDestination[department]);
        
        departmentStatuses.forEach((departmentStatus) => {
            numberOfTickets = numberOfTickets + ticketsGroupedByDestination[department][departmentStatus].length;
        });
    });

    return numberOfTickets;
}

function buildATicketWithAValidDesintation() {
    const departmentWithAtLeastOneDepartmentStatus = chance.pickone(getAllDepartmentsWithDepartmentStatuses());
    const departmentStatus = chance.pickone(departmentToStatusesMappingForTicketObjects[departmentWithAtLeastOneDepartmentStatus]);

    return {
        destination: {
            department: departmentWithAtLeastOneDepartmentStatus,
            departmentStatus
        }
    };
}

function buildTicketWithoutAValidDestination() {
    const invalidDepartment = chance.string();
    const invalidDepartmentStatus = chance.string();

    return {
        destination: {
            department: invalidDepartment,
            departmentStatus: invalidDepartmentStatus
        }
    };
}


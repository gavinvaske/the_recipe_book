const destinationService = require('../../application/services/destinationService');
const chance = require('chance').Chance();

describe('destinationService.js', () => {
    describe('groupItemsByDestination()', () => {
        it('should return an empty object if empty list is passed in', () => {
            const items = [];
            const expectedResponse = {};

            const actualResponse = destinationService.groupItemsByDestination(items);

            expect(actualResponse).toEqual(expectedResponse);
        });

        it('should return an empty object if no items in the list have a "destination" attribute', () => {
            const item = getItemWithDestination();
            delete item.destination;

            const items = [item];
            const expectedResponse = {};

            const actualResponse = destinationService.groupItemsByDestination(items);

            expect(actualResponse).toEqual(expectedResponse);
        });

        it('should correctly map the item to the correct department/departmentStatus if item has a "destination" attribute', () => {
            const item = getItemWithDestination();
            const items = [item];
            const expectedResponse = {
                [item.destination.department]: {
                    [item.destination.departmentStatus]: [item]
                } 
            };

            const actualResponse = destinationService.groupItemsByDestination(items);

            expect(actualResponse).toEqual(expectedResponse);
        });

        it('should correctly map N items to the correct department/departmentStatus if items have a "destination" attribute', () => {
            const item1 = getItemWithDestination();
            const item2 = getItemWithDestination();

            const items = [item1, item2, item1, item1, item2];

            const expectedResponse = {
                [item1.destination.department]: {
                    [item1.destination.departmentStatus]: [item1, item1, item1]
                },
                [item2.destination.department]: {
                    [item2.destination.departmentStatus]: [item2, item2]
                },
            };

            const actualResponse = destinationService.groupItemsByDestination(items);

            expect(actualResponse).toEqual(expectedResponse);
        });

        it('should correctly map N items to the correct department/departmentStatus if items have a "destination" attribute while ignoring any items whose destination.departmentStatus or destination.department is undefined', () => {
            const item = getItemWithDestination();
            
            const itemToIgnore1 = getItemWithDestination();
            delete itemToIgnore1.destination.department;

            const itemToIgnore2 = getItemWithDestination();
            delete itemToIgnore2.destination.departmentStatus;

            const items = [item, itemToIgnore1, item, itemToIgnore2, item, itemToIgnore1, itemToIgnore2];

            const expectedResponse = {
                [item.destination.department]: {
                    [item.destination.departmentStatus]: [item, item, item]
                }
            };

            const actualResponse = destinationService.groupItemsByDestination(items);

            expect(actualResponse).toEqual(expectedResponse);
        });
    });
});

function getItemWithDestination() {
    return {
        destination: {
            department: chance.word(),
            departmentStatus: chance.word()
        }
    };
}
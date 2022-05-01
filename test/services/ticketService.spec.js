const chance = require('chance').Chance();
const ticketService = require('../../application/services/ticketService');

describe('pre-parsing ticket object', () => {
    const ticketItemKey = 'TicketItem';
    let ticket;
    beforeEach(() => {
        ticket = {
            [ticketItemKey]: [
                {
                    'attribute1': chance.string(),
                    'attribute2': undefined,
                    'attribute3': '',
                    'attribute4': {}
                }
        ]};
    });

    it('should remove attributes whose value is an empty object', () => {
        const expectedNumberOfAttributesToBeRemoved = 1;
        const numberOfKeysBeforeDeletion = Object.keys(ticket[ticketItemKey][0]).length;

        console.log(`numberOfKeysBeforeDeletion: `, numberOfKeysBeforeDeletion);
        
        ticketService.removeEmptyObjectAttributes(ticket);

        expect(Object.keys(ticket[ticketItemKey][0]).length).toBe(numberOfKeysBeforeDeletion - expectedNumberOfAttributesToBeRemoved);
        expect('attribute4' in ticket[ticketItemKey][0]).toBeFalsy();
    });
});
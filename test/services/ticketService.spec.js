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
                    'attribute4': {},
                    'attribute5': [{}, {}],
                    'attribute6': [{}, chance.word()],
                }
            ]};
    });

    it('should remove attributes whose value is an empty object', () => {
        ticketService.removeEmptyObjectAttributes(ticket);

        expect('attribute4' in ticket[ticketItemKey][0]).toBeFalsy();
    });

    it('should remove attributes whose value is an array of empty objects', () => {
        ticketService.removeEmptyObjectAttributes(ticket);

        expect('attribute5' in ticket[ticketItemKey][0]).toBeFalsy();
    });

    it('should NOT remove attributes whose value is an array containing non-empty objects', () => {
        ticketService.removeEmptyObjectAttributes(ticket);

        expect('attribute6' in ticket[ticketItemKey][0]).toBeTruthy();
    });

    it('should remove the correct number of attributes', () => {
        const expectedNumberOfAttributesToBeRemoved = 2;
        const numberOfKeysBeforeDeletion = Object.keys(ticket[ticketItemKey][0]).length;
        
        ticketService.removeEmptyObjectAttributes(ticket);

        expect(Object.keys(ticket[ticketItemKey][0]).length).toBe(numberOfKeysBeforeDeletion - expectedNumberOfAttributesToBeRemoved);
    });
});
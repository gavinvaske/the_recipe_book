import Chance from 'chance';
import TicketGroupModel from '../../application/api/models/ticketGroup';
import mongoose from 'mongoose';

const chance = Chance();

describe('validation', () => {
    let ticketGroupAttributes;

    beforeEach(() => {
        ticketGroupAttributes = {
            ticketIdsInGroup: [
                new mongoose.Types.ObjectId()
            ]
        };
    });

    it('should validate if all attributes are defined successfully', () => {
        const ticketGroup = new TicketGroupModel(ticketGroupAttributes);
    
        const error = ticketGroup.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: ticketIdsInGroup', () => {
        it('should fail validation if attribute is not defined', () => {
            delete ticketGroupAttributes.ticketIdsInGroup;
            const ticketGroup = new TicketGroupModel(ticketGroupAttributes);

            const error = ticketGroup.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if attribute is an empty array', () => {
            ticketGroupAttributes.ticketIdsInGroup = [];
            const ticketGroup = new TicketGroupModel(ticketGroupAttributes);

            const error = ticketGroup.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass validation if attribute an array of mongoose object Ids', () => {
            const mongooseObjectId = new mongoose.Types.ObjectId();
            ticketGroupAttributes.ticketIdsInGroup = [mongooseObjectId];
            const ticketGroup = new TicketGroupModel(ticketGroupAttributes);

            const error = ticketGroup.validateSync();

            expect(error).toBe(undefined);
        });

        it('should fail validation if attribute an array containing non-mongoose object Id(s)', () => {
            const invalidDataType = chance.integer();
            ticketGroupAttributes.ticketIdsInGroup = [invalidDataType];
            const ticketGroup = new TicketGroupModel(ticketGroupAttributes);

            const error = ticketGroup.validateSync();

            expect(error).not.toBe(undefined);
        });
    });
});
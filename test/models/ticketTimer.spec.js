const TicketTimer = require('../../application/models/ticketTimer');
const { TIMER_TYPES } = require('../../application/enums/timerTypesEnum');
const { TIMER_STATES } = require('../../application/enums/timerStatesEnum');
const databaseService = require('../../application/services/databaseService');
const mongoose = require('mongoose');
const chance = require('chance').Chance();

describe('File: ticketTimer.js', () => {
    let ticketTimerAttributes;
    
    beforeEach(() => {
        ticketTimerAttributes = {
            ticketId: mongoose.Types.ObjectId(),
            timerType: chance.pickone(TIMER_TYPES),
            state: chance.pickone(TIMER_STATES)
        };
    });

    it('should pass validation if all required attributes are defined correctly', () => {
        const ticketTimer = new TicketTimer(ticketTimerAttributes);
        
        const error = ticketTimer.validateSync();
        
        expect(error).toBeUndefined();
    });

    it('should have the correct indexes', async () => {
        const indexMetaData = TicketTimer.schema.indexes();
        const expectedIndexes = ['ticketId'];

        console.log('indexMetaData: ', indexMetaData);

        const isEveryExpectedIndexActuallyAnIndex = expectedIndexes.every((expectedIndex) => {
            return indexMetaData.some((metaData) => {
                const index = Object.keys(metaData[0])[0];
                if (index === expectedIndex) return true;
            });
        });

        expect(isEveryExpectedIndexActuallyAnIndex).toBe(true);
    });

    describe('attribute: ticketId', () => {
        it('should be a mongoose objectId', () => {
            const ticketTimer = new TicketTimer(ticketTimerAttributes);

            const error = ticketTimer.validateSync();

            expect(error).toBeUndefined();
            expect(ticketTimer.ticketId).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should be required', () => {
            delete ticketTimerAttributes.ticketId;
            const ticketTimer = new TicketTimer(ticketTimerAttributes);

            const error = ticketTimer.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: timerType', () => {
        it('should be a string', () => {
            const ticketTimer = new TicketTimer(ticketTimerAttributes);

            expect(ticketTimer.timerType).toEqual(expect.any(String));
        });

        it('should automatically uppercase the value', () => {
            const lowerCaseTimerType = ticketTimerAttributes.timerType.toLowerCase();
            ticketTimerAttributes.timerType = lowerCaseTimerType;
            const ticketTimer = new TicketTimer(ticketTimerAttributes);
            
            expect(ticketTimer.timerType).toEqual(lowerCaseTimerType.toUpperCase());
        });

        it('should fail if value does not equal one of the allowed values', () => {
            const invalidTimerType = chance.string();
            ticketTimerAttributes.timerType = invalidTimerType;
            const ticketTimer = new TicketTimer(ticketTimerAttributes);
            
            const error = ticketTimer.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be required', () => {
            delete ticketTimerAttributes.timerType;
            const ticketTimer = new TicketTimer(ticketTimerAttributes);
            
            const error = ticketTimer.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: state', () => {
        it('should be a string', () => {
            const ticketTimer = new TicketTimer(ticketTimerAttributes);

            expect(ticketTimer.state).toEqual(expect.any(String));
        });

        it('should automatically uppercase the value', () => {
            const lowerCaseState = ticketTimerAttributes.state.toLowerCase();
            ticketTimerAttributes.state = lowerCaseState;
            const ticketTimer = new TicketTimer(ticketTimerAttributes);
            
            expect(ticketTimer.state).toEqual(lowerCaseState.toUpperCase());
        });

        it('should fail if value does not equal one of the allowed values', () => {
            const invalidState = chance.string();
            ticketTimerAttributes.state = invalidState;
            const ticketTimer = new TicketTimer(ticketTimerAttributes);
            
            const error = ticketTimer.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be required', () => {
            delete ticketTimerAttributes.state;
            const ticketTimer = new TicketTimer(ticketTimerAttributes);
            
            const error = ticketTimer.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('database interactions', () => {
        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        it('should have timestamps', async () => {
            const ticketTimer = new TicketTimer(ticketTimerAttributes);

            const savedTicketTimer = await ticketTimer.save();

            expect(savedTicketTimer.createdAt).toBeDefined();
            expect(savedTicketTimer.updatedAt).toBeDefined();
        });

        it('should soft delete items', async () => {
            const ticketTimer = new TicketTimer(ticketTimerAttributes);
            const id = ticketTimer._id;

            await ticketTimer.save();
            await TicketTimer.deleteById(id);

            const softDeletedItem = await TicketTimer.findOneDeleted({_id: id}).exec();

            expect(softDeletedItem).toBeDefined();
            expect(softDeletedItem.deleted).toBe(true);
        });
    });
});
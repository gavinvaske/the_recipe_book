import { TicketTimeLedgerModel } from '../../application/api/models/ticketTimeLedger';
import { TIMER_TYPES } from '../../application/api/enums/timerTypesEnum';
import { TIMER_STATES } from '../../application/api/enums/timerStatesEnum';
import * as databaseService from '../../application/api/services/databaseService';
import mongoose from 'mongoose';
import Chance from 'chance';

const chance = Chance();

describe('File: ticketTimer.js', () => {
    let ticketTimeLedgerAttributes;
    
    beforeEach(() => {
        ticketTimeLedgerAttributes = {
            ticketId: new mongoose.Types.ObjectId(),
            timerType: chance.pickone(TIMER_TYPES),
            state: chance.pickone(TIMER_STATES)
        };
    });

    it('should pass validation if all required attributes are defined correctly', () => {
        const ticketTimer = new TicketTimeLedgerModel(ticketTimeLedgerAttributes);
        
        const error = ticketTimer.validateSync();
        
        expect(error).toBeUndefined();
    });

    it('should have the correct indexes', async () => {
        const indexMetaData = TicketTimeLedgerModel.schema.indexes();
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
            const ticketTimer = new TicketTimeLedgerModel(ticketTimeLedgerAttributes);

            const error = ticketTimer.validateSync();

            expect(error).toBeUndefined();
            expect(ticketTimer.ticketId).toBeInstanceOf(mongoose.Types.ObjectId);
        });

        it('should be required', () => {
            delete ticketTimeLedgerAttributes.ticketId;
            const ticketTimer = new TicketTimeLedgerModel(ticketTimeLedgerAttributes);

            const error = ticketTimer.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: timerType', () => {
        it('should be a string', () => {
            const ticketTimer = new TicketTimeLedgerModel(ticketTimeLedgerAttributes);

            expect(ticketTimer.timerType).toEqual(expect.any(String));
        });

        it('should automatically uppercase the value', () => {
            const lowerCaseTimerType = ticketTimeLedgerAttributes.timerType.toLowerCase();
            ticketTimeLedgerAttributes.timerType = lowerCaseTimerType;
            const ticketTimer = new TicketTimeLedgerModel(ticketTimeLedgerAttributes);
            
            expect(ticketTimer.timerType).toEqual(lowerCaseTimerType.toUpperCase());
        });

        it('should fail if value does not equal one of the allowed values', () => {
            const invalidTimerType = chance.string();
            ticketTimeLedgerAttributes.timerType = invalidTimerType;
            const ticketTimer = new TicketTimeLedgerModel(ticketTimeLedgerAttributes);
            
            const error = ticketTimer.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be required', () => {
            delete ticketTimeLedgerAttributes.timerType;
            const ticketTimer = new TicketTimeLedgerModel(ticketTimeLedgerAttributes);
            
            const error = ticketTimer.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: state', () => {
        it('should be a string', () => {
            const ticketTimer = new TicketTimeLedgerModel(ticketTimeLedgerAttributes);

            expect(ticketTimer.state).toEqual(expect.any(String));
        });

        it('should automatically uppercase the value', () => {
            const lowerCaseState = ticketTimeLedgerAttributes.state.toLowerCase();
            ticketTimeLedgerAttributes.state = lowerCaseState;
            const ticketTimer = new TicketTimeLedgerModel(ticketTimeLedgerAttributes);
            
            expect(ticketTimer.state).toEqual(lowerCaseState.toUpperCase());
        });

        it('should fail if value does not equal one of the allowed values', () => {
            const invalidState = chance.string();
            ticketTimeLedgerAttributes.state = invalidState;
            const ticketTimer = new TicketTimeLedgerModel(ticketTimeLedgerAttributes);
            
            const error = ticketTimer.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be required', () => {
            delete ticketTimeLedgerAttributes.state;
            const ticketTimer = new TicketTimeLedgerModel(ticketTimeLedgerAttributes);
            
            const error = ticketTimer.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('database interactions', () => {
        beforeAll(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.clearDatabase();
        });

        afterAll(async () => {
            await databaseService.closeDatabase();
        });

        it('should have timestamps', async () => {
            const ticketTimer = new TicketTimeLedgerModel(ticketTimeLedgerAttributes);

            const savedTicketTimer = await ticketTimer.save();

            expect(savedTicketTimer.createdAt).toBeDefined();
            expect(savedTicketTimer.updatedAt).toBeDefined();
        });

        it('should soft delete items', async () => {
            const ticketTimer = new TicketTimeLedgerModel(ticketTimeLedgerAttributes);
            const id = ticketTimer._id;

            await ticketTimer.save();
            await TicketTimeLedgerModel.deleteById(id);

            const softDeletedItem = await TicketTimeLedgerModel.findOneDeleted({_id: id}).exec();

            expect(softDeletedItem).toBeDefined();
            expect(softDeletedItem.deleted).toBe(true);
        });
    });
});
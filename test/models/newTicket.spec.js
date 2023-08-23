const chance = require('chance').Chance();
const Ticket = require('../../application/models/newTicket');
const databaseService = require('../../application/services/databaseService');

describe('Ticket validation', () => {
    let ticketAttributes;

    beforeEach(() => {
        ticketAttributes = {
            shipDate: chance.date(),
            totalStockLength: chance.d100(),
            totalFramesRan: chance.d100(),
            endingImpressions: chance.d100()
        };
    });

    it('should pass validation when all attributes are valid', () => {
        const ticket = new Ticket(ticketAttributes);
        const error = ticket.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: ticketNumber', () => {
        it('should be a number', () => {
            ticketAttributes.ticketNumber = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.ticketNumber).toEqual(expect.any(Number));
        });
    });

    describe('attribute: shipDate', () => {
        it('should be a date', () => {
            ticketAttributes.shipDate = chance.date();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.shipDate).toEqual(expect.any(Date));
        });

        it('should be required', () => {
            delete ticketAttributes.shipDate;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: customerPo', () => {
        it('should be a string', () => {
            ticketAttributes.customerPo = chance.string();
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.customerPo).toEqual(expect.any(String));
        });

        it('should not be required', () => {
            delete ticketAttributes.customerPo;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });
    });

    describe('attribute: startingImpressions', () => {
        it('should be a number', () => {
            ticketAttributes.startingImpressions = chance.d100();
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.startingImpressions).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.startingImpressions;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.startingImpressions = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: totalStockLength', () => {
        it('should be a number', () => {
            ticketAttributes.totalStockLength = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.totalStockLength).toEqual(expect.any(Number));
        });

        it('should be required', () => {
            delete ticketAttributes.totalStockLength;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.totalStockLength = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: totalFramesRan', () => {
        it('should be a number', () => {
            ticketAttributes.totalFramesRan = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.totalFramesRan).toEqual(expect.any(Number));
        });

        it('should be required', () => {
            delete ticketAttributes.totalFramesRan;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.totalFramesRan = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: endingImpressions', () => {
        it('should be a number', () => {
            ticketAttributes.endingImpressions = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.endingImpressions).toEqual(expect.any(Number));
        });

        it('should be required', () => {
            delete ticketAttributes.endingImpressions;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.endingImpressions = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: outsideRollWaste', () => {
        it('should be a number', () => {
            ticketAttributes.outsideRollWaste = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.outsideRollWaste).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.outsideRollWaste;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.outsideRollWaste;
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.outsideRollWaste).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.outsideRollWaste = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: stockDefectWaste', () => {
        it('should be a number', () => {
            ticketAttributes.stockDefectWaste = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.stockDefectWaste).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.stockDefectWaste;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.stockDefectWaste;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.stockDefectWaste).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.stockDefectWaste = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: printDefectWaste', () => {
        it('should be a number', () => {
            ticketAttributes.printDefectWaste = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.printDefectWaste).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.printDefectWaste;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.printDefectWaste;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.printDefectWaste).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.printDefectWaste = -1;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: operatorErrorStockWaste', () => {
        it('should be a number', () => {
            ticketAttributes.operatorErrorStockWaste = chance.d100();
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.operatorErrorStockWaste).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.operatorErrorStockWaste;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.operatorErrorStockWaste;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.operatorErrorStockWaste).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.operatorErrorStockWaste = -1;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: bcsCleaners', () => {
        it('should be a number', () => {
            ticketAttributes.bcsCleaners = chance.d100();
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.bcsCleaners).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.bcsCleaners;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();

            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.bcsCleaners;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.bcsCleaners).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.bcsCleaners = -1;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: dieLineFrames', () => {
        it('should be a number', () => {
            ticketAttributes.dieLineFrames = chance.d100();
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeUndefined();
        });

        it('should not be required', () => {
            delete ticketAttributes.dieLineFrames;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.dieLineFrames;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.dieLineFrames).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.dieLineFrames = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: extraDieCuttingFrames', () => {
        it('should be a number', () => {
            ticketAttributes.extraDieCuttingFrames = chance.d100();
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.extraDieCuttingFrames).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.extraDieCuttingFrames;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.extraDieCuttingFrames;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.extraDieCuttingFrames).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.extraDieCuttingFrames = -1;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: imagePlacementTime', () => {
        it('should be a number', () => {
            ticketAttributes.imagePlacementTime = chance.d100();
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.imagePlacementTime).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.imagePlacementTime;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.imagePlacementTime;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.imagePlacementTime).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.imagePlacementTime = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: colorSeperations', () => {
        it('should be a number', () => {
            ticketAttributes.colorSeperations = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.colorSeperations).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.colorSeperations;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.colorSeperations;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.colorSeperations).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.colorSeperations = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a whole number', () => {
            ticketAttributes.colorSeperations = 0.5;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: trailingEdges', () => {
        it('should be a number', () => {
            ticketAttributes.trailingEdges = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.trailingEdges).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.trailingEdges;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.trailingEdges;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.trailingEdges).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.trailingEdges = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a whole number', () => {
            ticketAttributes.trailingEdges = 0.5;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: leadingEdges', () => {
        it('should be a number', () => {
            ticketAttributes.leadingEdges = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.leadingEdges).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.leadingEdges;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.leadingEdges;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.leadingEdges).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.leadingEdges = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a whole number', () => {
            ticketAttributes.leadingEdges = 0.5;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: jobComments', () => {
        it('should be a string', () => {
            ticketAttributes.jobComments = chance.string();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.jobComments).toEqual(expect.any(String));
        });

        it('should not be required', () => {
            delete ticketAttributes.jobComments;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should trim whitespace', () => {
            const jobComments = chance.string();
            ticketAttributes.jobComments = ` ${jobComments} `;
            
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.jobComments).toEqual(jobComments.trim());
        });
    });

    describe('database interaction validations', () => {
        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        describe('attribute: ticketNumber', () => {
            it('should generate upon save', async () => {
                delete ticketAttributes.ticketNumber;
                const ticket = new Ticket(ticketAttributes);
                const savedTicket = await ticket.save();
                
                expect(savedTicket.ticketNumber).toEqual(expect.any(Number));
            });

            it('should set the first ticketNumber at 60000 and incriment future tickets by 1', async () => {
                const startingTicketNumber = 60000;
                const ticket1 = new Ticket(ticketAttributes);
                const ticket2 = new Ticket(ticketAttributes);
                const ticket3 = new Ticket(ticketAttributes);

                const savedTicket1 = await ticket1.save();
                const savedTicket2 = await ticket2.save();
                const savedTicket3 = await ticket3.save();

                expect(savedTicket1.ticketNumber).toEqual(startingTicketNumber);
                expect(savedTicket2.ticketNumber).toEqual(startingTicketNumber + 1);
                expect(savedTicket3.ticketNumber).toEqual(startingTicketNumber + 2);
            });
        });
    });
});
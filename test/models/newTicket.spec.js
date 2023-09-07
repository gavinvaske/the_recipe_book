const chance = require('chance').Chance();
const Ticket = require('../../application/models/newTicket');
const Customer = require('../../application/models/customer');
const databaseService = require('../../application/services/databaseService');
const mongoose = require('mongoose');

const testDataGenerator = require('../testDataGenerator');

function verifyTimeFieldInSeconds(ticketAttributes, fieldName) {
    let ticket, error;
    
    ticketAttributes[fieldName] = chance.d100();
    ticket = new Ticket(ticketAttributes);
    // Should be a number
    expect(ticket[fieldName]).toEqual(expect.any(Number));

    ticketAttributes[fieldName] = -1;
    ticket = new Ticket(ticketAttributes);
    error = ticket.validateSync();
    // should not allow negative numbers
    expect(error).toBeDefined();

    ticketAttributes[fieldName] = 99.99;
    ticket = new Ticket(ticketAttributes);
    error = ticket.validateSync();
    // should not allow floating point numbers
    expect(error).toBeDefined();

    delete ticketAttributes[fieldName];
    ticket = new Ticket(ticketAttributes);
    // should defualt to 0
    expect(ticket[fieldName]).toEqual(0);
}

describe('Ticket validation', () => {
    let ticketAttributes;

    beforeEach(() => {
        ticketAttributes = {
            customer: mongoose.Types.ObjectId(),
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

    it('should have the correct indexes', async () => {
        const indexMetaData = Ticket.schema.indexes();
        const expectedIndexes = ['ticketNumber'];

        console.log('indexMetaData: ', indexMetaData);

        const isEveryExpectedIndexActuallyAnIndex = expectedIndexes.every((expectedIndex) => {
            return indexMetaData.some((metaData) => {
                const index = Object.keys(metaData[0])[0];
                if (index === expectedIndex) return true;
            });
        });

        expect(isEveryExpectedIndexActuallyAnIndex).toBe(true);
    });

    describe('attribute: customer', () => {
        it('should be required', () => {
            delete ticketAttributes.customer;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a mongoose ObjectId', () => {
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.customer).toEqual(expect.any(mongoose.Types.ObjectId));
        })
    })

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

    describe('attribute: printingOutsideRollWaste', () => {
        it('should be a number', () => {
            ticketAttributes.printingOutsideRollWaste = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.printingOutsideRollWaste).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.printingOutsideRollWaste;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.printingOutsideRollWaste;
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.printingOutsideRollWaste).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.printingOutsideRollWaste = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: printingStockDefectWaste', () => {
        it('should be a number', () => {
            ticketAttributes.printingStockDefectWaste = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.printingStockDefectWaste).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.printingStockDefectWaste;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.printingStockDefectWaste;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.printingStockDefectWaste).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.printingStockDefectWaste = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: printingDefectWaste', () => {
        it('should be a number', () => {
            ticketAttributes.printingDefectWaste = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.printingDefectWaste).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.printingDefectWaste;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.printingDefectWaste;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.printingDefectWaste).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.printingDefectWaste = -1;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: printingOperatorErrorStockWaste', () => {
        it('should be a number', () => {
            ticketAttributes.printingOperatorErrorStockWaste = chance.d100();
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.printingOperatorErrorStockWaste).toEqual(expect.any(Number));
        });

        it('should not be required', () => {
            delete ticketAttributes.printingOperatorErrorStockWaste;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.printingOperatorErrorStockWaste;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.printingOperatorErrorStockWaste).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.printingOperatorErrorStockWaste = -1;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: colorCalibrations', () => {
        it('should default to an empty array', () => {
            delete ticketAttributes.colorCalibrations;
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.colorCalibrations).toEqual([]);
        });

        it('should have a time and feet field', () => {
            const time = chance.d100();
            const feet = chance.d100();
            ticketAttributes.colorCalibrations = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.colorCalibrations[0].time).toEqual(time);
            expect(ticket.colorCalibrations[0].feet).toEqual(feet);
        });

        it('should throw an error if the feet is not a whole number', () => {
            const feet = 100.50;
            const time = chance.d100();
            ticketAttributes.colorCalibrations = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should throw an error if the time is negative', () => {
            const feet = chance.d100();
            const time = -1;
            ticketAttributes.colorCalibrations = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should throw an error if the feet is negative', () => {
            const feet = -1;
            const time = chance.d100();
            ticketAttributes.colorCalibrations = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should default the time to 0', () => {
            const feet = chance.d100();
            const time = undefined;
            ticketAttributes.colorCalibrations = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.colorCalibrations[0].time).toEqual(0);
        });
    });

    describe('attribute: scalings', () => {
        it('should default to an empty array', () => {
            delete ticketAttributes.scalings;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.scalings).toEqual([]);
        });

        it('should have a time and feet field', () => {
            const time = chance.d100();
            const feet = chance.d100();
            ticketAttributes.scalings = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.scalings[0].time).toEqual(time);
            expect(ticket.scalings[0].feet).toEqual(feet);
        });

        it('should throw an error if the feet is not a whole number', () => {
            const feet = 100.50;
            const time = chance.d100();
            ticketAttributes.scalings = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should throw an error if the time is negative', () => {
            const feet = chance.d100();
            const time = -1;
            ticketAttributes.scalings = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should throw an error if the feet is negative', () => {
            const feet = -1;
            const time = chance.d100();
            ticketAttributes.scalings = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should default the time to 0', () => {
            const feet = chance.d100();
            const time = undefined;
            ticketAttributes.scalings = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.scalings[0].time).toEqual(0);
        });
    });

    describe('attribute: printCleaners', () => {
        it('should default to an empty array', () => {
            delete ticketAttributes.printCleaners;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.printCleaners).toEqual([]);
        });

        it('should have a time and feet field', () => {
            const time = chance.d100();
            const feet = chance.d100();
            ticketAttributes.printCleaners = [ { time, feet } ];
            
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.printCleaners[0].time).toEqual(time);
            expect(ticket.printCleaners[0].feet).toEqual(feet);
        });

        it('should throw an error if the feet is not a whole number', () => {
            const feet = 100.50;
            const time = chance.d100();
            ticketAttributes.printCleaners = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should throw an error if the time is negative', () => {
            const feet = chance.d100();
            const time = -1;
            ticketAttributes.printCleaners = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should throw an error if the feet is negative', () => {
            const feet = -1;
            const time = chance.d100();
            ticketAttributes.scalings = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should default the time to 0', () => {
            const feet = chance.d100();
            const time = undefined;
            ticketAttributes.scalings = [ { time, feet } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.scalings[0].time).toEqual(0);
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

        it('should be a whole number', () => {
            ticketAttributes.bcsCleaners = chance.floating({ min: 0, max: 100 });
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: proofRunups', () => {
        it('should default to an empty array', () => {
            delete ticketAttributes.proofRunups;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.proofRunups).toEqual([]);
        });

        it('should have a time and imagePlacement field', () => {
            const time = chance.d100();
            const imagePlacement = chance.bool();
            ticketAttributes.proofRunups = [ { time, imagePlacement } ];
            
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.proofRunups[0].time).toEqual(time);
            expect(ticket.proofRunups[0].imagePlacement).toEqual(imagePlacement);
        });

        it('should have throw an error if the time field is negative', () => {
            const time = -1;
            const imagePlacement = chance.bool();
            ticketAttributes.proofRunups = [ { time, imagePlacement } ];
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should default the time to 0', () => {
            const time = undefined;
            const imagePlacement = chance.bool();
            ticketAttributes.proofRunups = [ { time, imagePlacement } ];
            
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.proofRunups[0].time).toEqual(0);
        });

        it('should throw an error if the time is not a whole number', () => {
            const time = 34.01;
            const imagePlacement = chance.bool();
            ticketAttributes.proofRunups = [ { time, imagePlacement } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should throw an error if the imagePlacement field is undefined', () => {
            const time = chance.d100();
            const imagePlacement = undefined;
            ticketAttributes.proofRunups = [ { time, imagePlacement } ];
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

        it('should be a whole number', () => {
            ticketAttributes.dieLineFrames = chance.floating({ min: 0, max: 100 });
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

        it('should be a whole number', () => {
            ticketAttributes.extraDieCuttingFrames = chance.floating({ min: 0, max: 100 });
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: newMaterialSpliceTime', () => {
        it('should not be required', () => {
            delete ticketAttributes.newMaterialSpliceTime;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a field containing a positive integer representing a number of seconds', () => {
            verifyTimeFieldInSeconds(ticketAttributes, 'newMaterialSpliceTime');
        });
    });

    describe('attribute: existingMaterialSpliceTimes', () => {
        it('should default to an empty array', () => {
            delete ticketAttributes.existingMaterialSpliceTimes;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.existingMaterialSpliceTimes).toEqual([]);
        });

        it('should have a time field that is a number', () => {
            const time = chance.d100();
            ticketAttributes.existingMaterialSpliceTimes = [ { time } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.existingMaterialSpliceTimes[0].time).toEqual(time);
        });

        it('should have a time field that defaults to 0', () => {
            const time = undefined;
            ticketAttributes.existingMaterialSpliceTimes = [ { time } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.existingMaterialSpliceTimes[0].time).toEqual(0);
        });

        it('should throw an error if the time field is negative', () => {
            const time = -1;
            ticketAttributes.existingMaterialSpliceTimes = [ { time } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should throw an error if the time field is not a whole number', () => {
            const time = 9.7;
            ticketAttributes.existingMaterialSpliceTimes = [ { time } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: materialWrapUps', () => {
        it('should default to an empty array', () => {
            delete ticketAttributes.materialWrapUps;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.materialWrapUps).toEqual([]);
        });

        it('should default time and feetLost and framesAdded to 0', () => {
            const time = undefined;
            const feetLost = undefined;
            const framesAdded = undefined;
            ticketAttributes.materialWrapUps = [ { time, feetLost, framesAdded } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.materialWrapUps[0].time).toEqual(0);
            expect(ticket.materialWrapUps[0].feetLost).toEqual(0);
            expect(ticket.materialWrapUps[0].framesAdded).toEqual(0);
        });

        it('should fail if the time field is negative', () => {
            const time = -1;
            ticketAttributes.materialWrapUps = [ { time, feetLost: chance.d100(), framesAdded: chance.d100() } ];
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail if the time field is not a whole number', () => {
            const time = 34.3;
            ticketAttributes.materialWrapUps = [ { time, feetLost: chance.d100(), framesAdded: chance.d100() } ];
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail if the feetLost field is negative', () => {
            const feetLost = -1;
            ticketAttributes.materialWrapUps = [ { time: chance.d100(), feetLost, framesAdded: chance.d100() } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail if the feetLost field is not a whole number', () => {
            const feetLost = 34.8;
            ticketAttributes.materialWrapUps = [ { time: chance.d100(), feetLost, framesAdded: chance.d100() } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if the framesAdded field is not a whole number', () => {
            const framesAdded = 87.76;
            ticketAttributes.materialWrapUps = [ { time: chance.d100(), feetLost: chance.d100(), framesAdded } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if the framesAdded field is negative', () => {
            const framesAdded = -1;
            ticketAttributes.materialWrapUps = [ { time: chance.d100(), feetLost: chance.d100(), framesAdded } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: webBreaks', () => {
        it('should default to an empty array', () => {
            delete ticketAttributes.webBreaks;
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.webBreaks).toEqual([]);
        });

        it('should default time and feetLost and framesAdded to 0', () => {
            const time = undefined;
            const feetLost = undefined;
            const framesAdded = undefined;
            ticketAttributes.webBreaks = [ { time, feetLost, framesAdded } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.webBreaks[0].time).toEqual(0);
            expect(ticket.webBreaks[0].feetLost).toEqual(0);
            expect(ticket.webBreaks[0].framesAdded).toEqual(0);
        });

        it('should fail validation if the time field is not a whole number', () => {
            const time = 99.99;
            ticketAttributes.webBreaks = [ { time, feetLost: chance.d100(), framesAdded: chance.d100() } ];
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail validaiton if the feetLost field is not a whole number', () => {
            const feetLost = 99.99;
            ticketAttributes.webBreaks = [ { time: chance.d100(), feetLost, framesAdded: chance.d100() } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if the framesAdded field is not a whole number', () => {
            const framesAdded = 99.99;
            ticketAttributes.webBreaks = [ { time: chance.d100(), feetLost: chance.d100(), framesAdded } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: newInkBuildTimes', () => {
        it('should default to an empty array', () => {
            delete ticketAttributes.newInkBuildTimes;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.newInkBuildTimes).toEqual([]);
        });

        it('should have a time field that is a number', () => {
            const time = chance.d100();
            ticketAttributes.newInkBuildTimes = [ { time } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.newInkBuildTimes[0].time).toEqual(time);
        });

        it('should fail if the time field is not a whole number', () => {
            const time = 99.99;
            ticketAttributes.newInkBuildTimes = [ { time } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if the time field is negative', () => {
            const time = -1;
            ticketAttributes.newInkBuildTimes = [ { time } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: imagePlacementTimes', () => {
        it('should default to an empty array', () => {
            delete ticketAttributes.imagePlacementTimes;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.imagePlacementTimes).toEqual([]);
        });

        it('should have a time field that is a number', () => {
            const time = chance.d100();
            ticketAttributes.imagePlacementTimes = [ { time } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.imagePlacementTimes[0].time).toEqual(time);
        });

        it('should fail validation if the time field is not a whole number', () => {
            const time = 99.99;
            ticketAttributes.imagePlacementTimes = [ { time } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if the time field is negative', () => {
            const time = -1;
            ticketAttributes.imagePlacementTimes = [ { time } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: colorSeperations', () => {
        it('should default to an empty array', () => {
            delete ticketAttributes.colorSeperations;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.colorSeperations).toEqual([]);
        });

        it('should have a value field that is a number', () => {
            const value = chance.d100();
            ticketAttributes.colorSeperations = [ { value } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.colorSeperations[0].value).toEqual(value);
        });

        it('should fail validation if the value field is not a whole number', () => {
            const value = 99.99;
            ticketAttributes.colorSeperations = [ { value } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if the value field is negative', () => {
            const value = -1;
            ticketAttributes.colorSeperations = [ { value } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should default the value field to 0 if the value field is not specified', () => {
            const value = undefined;
            ticketAttributes.colorSeperations = [ { value } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.colorSeperations[0].value).toEqual(0);
        });
    });

    describe('attribute: trailingEdges', () => {
        it('should default to an empty array', () => {
            delete ticketAttributes.trailingEdges;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.trailingEdges).toEqual([]);
        });

        it('should have a value field that is a number', () => {
            const value = chance.d100();
            ticketAttributes.trailingEdges = [ { value } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.trailingEdges[0].value).toEqual(value);
        });

        it('should fail validation if the value field is not a whole number', () => {
            const value = 99.99;
            ticketAttributes.trailingEdges = [ { value } ];
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if the value field is negative', () => {
            const value = -1;
            ticketAttributes.trailingEdges = [ { value } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should default the value field to 0 if the value field is not specified', () => {
            const value = undefined;
            ticketAttributes.trailingEdges = [ { value } ];
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.trailingEdges[0].value).toEqual(0);
        });
    });

    describe('attribute: leadingEdges', () => {
        it('should default to an empty array', () => {
            delete ticketAttributes.leadingEdges;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.leadingEdges).toEqual([]);
        });

        it('should have a value field that is a number', () => {
            const value = chance.d100();
            ticketAttributes.leadingEdges = [ { value } ];
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.leadingEdges[0].value).toEqual(value);
        });

        it('should fail validation if the value field is not a whole number', () => {
            const value = 100.50;
            ticketAttributes.leadingEdges = [ { value } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if the value field is negative', () => {
            const value = -1;
            ticketAttributes.leadingEdges = [ { value } ];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: printingJobComments', () => {
        it('should be a string', () => {
            ticketAttributes.printingJobComments = chance.string();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.printingJobComments).toEqual(expect.any(String));
        });

        it('should not be required', () => {
            delete ticketAttributes.printingJobComments;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should trim whitespace', () => {
            const jobComments = chance.string();
            ticketAttributes.printingJobComments = ` ${jobComments} `;
            
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.printingJobComments).toEqual(jobComments.trim());
        });
    });

    describe('attribute: jobSetup', () => {
        it('should not be required', () => {
            delete ticketAttributes.jobSetup;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should have a time and feet fields that are numbers', () => {
            const time = chance.d100();
            const feet = chance.d100();
            ticketAttributes.jobSetup = { time, feet };
            
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.jobSetup.time).toEqual(time);
            expect(ticket.jobSetup.feet).toEqual(feet);
        });

        it('should fail validation if the time field is negative', () => {
            ticketAttributes.jobSetup = { time: -1, feet: chance.d100() };

            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: jobRun', () => {
        it('should not be required', () => {
            delete ticketAttributes.jobRun;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should have a time and feet fields that are numbers', () => {
            const time = chance.d100();
            const feet = chance.d100();
            ticketAttributes.jobRun = { time, feet };
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.jobRun.time).toEqual(time);
            expect(ticket.jobRun.feet).toEqual(feet);
        });

        it('should fail validation if the time field is negative', () => {
            const time = -1;
            const feet = chance.d100();
            ticketAttributes.jobRun = { time, feet };
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail validation if the footage field is negative', () => {
            const time = chance.d100();
            const feet = -1;
            ticketAttributes.jobRun = { time, feet };
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: tearDownTime', () => {
        it('should not be required', () => {
            delete ticketAttributes.tearDownTime;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeUndefined();
        });

        it('should be a field containing a positive integer representing a number of seconds', () => {
            verifyTimeFieldInSeconds(ticketAttributes, 'tearDownTime');
        });
    });

    describe('attribute: dieCutterDown', () => {
        it('should not be required', () => {
            delete ticketAttributes.dieCutterDown;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be an object with a time, reason and footageLost fields', () => {
            const time = chance.d100();
            const reason = chance.string();
            const footageLost = chance.d100();
            ticketAttributes.dieCutterDown = { time, reason, footageLost };
            
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.dieCutterDown.time).toEqual(time);
            expect(ticket.dieCutterDown.reason).toEqual(reason);
            expect(ticket.dieCutterDown.footageLost).toEqual(footageLost);
        });

        it('should have a footageLost field that is a whole number', () => {
            const nonIntegerFootageLost = 1.50;
            ticketAttributes.dieCutterDown = {
                footageLost: nonIntegerFootageLost
            };
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not have a negative value for the footageLost field', () => {
            const negativeFootageLost = -1;
            ticketAttributes.dieCutterDown = {
                footageLost: negativeFootageLost
            };
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: cuttingOutsideRollWaste', () => {
        it('should be a number', () => {
            ticketAttributes.cuttingOutsideRollWaste = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.cuttingOutsideRollWaste).toEqual(expect.any(Number));
        });

        it('should default to 0', () => {
            delete ticketAttributes.cuttingOutsideRollWaste;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.cuttingOutsideRollWaste).toEqual(0);
        });

        it('should not be less than 0', () => {
            ticketAttributes.cuttingOutsideRollWaste = -1;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: cuttingStockDefectWaste', () => {
        it('should be a number', () => {
            ticketAttributes.cuttingStockDefectWaste = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.cuttingStockDefectWaste).toEqual(expect.any(Number));
        });

        it('should default to 0', () => {
            delete ticketAttributes.cuttingStockDefectWaste;
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.cuttingStockDefectWaste).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.cuttingStockDefectWaste = -1;
            const ticket = new Ticket(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: cuttingDefectWaste', () => {
        it('should be a number', () => {
            ticketAttributes.cuttingDefectWaste = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.cuttingDefectWaste).toEqual(expect.any(Number));
        });

        it('should default to 0', () => {
            delete ticketAttributes.cuttingDefectWaste;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.cuttingDefectWaste).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.cuttingDefectWaste = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: cuttingOperatorErrorStockWaste', () => {
        it('should be a number', () => {
            ticketAttributes.cuttingOperatorErrorStockWaste = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.cuttingOperatorErrorStockWaste).toEqual(expect.any(Number));
        });

        it('should default to 0', () => {
            delete ticketAttributes.cuttingOperatorErrorStockWaste;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.cuttingOperatorErrorStockWaste).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.cuttingOperatorErrorStockWaste = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: cuttingJobComments', () => {
        it('should be a string', () => {
            ticketAttributes.cuttingJobComments = chance.string();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.cuttingJobComments).toEqual(expect.any(String));
        });

        it('should not be required', () => {
            delete ticketAttributes.cuttingJobComments;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should trim whitespace', () => {
            const jobComments = chance.string();
            ticketAttributes.cuttingJobComments = ` ${jobComments} `;
            
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.cuttingJobComments).toEqual(jobComments.trim());
        });
    });

    describe('attribute: rewindingDuration', () => {
        it('should not be required', () => {
            delete ticketAttributes.rewindingDuration;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a number', () => {
            const rewindingDuration = chance.d100();
            ticketAttributes.rewindingDuration = rewindingDuration;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.rewindingDuration).toEqual(rewindingDuration);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.rewindingDuration = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail validation if attribute is not a whole number', () => {
            ticketAttributes.rewindingDuration = 932.43;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should default to 0 if attribute is not defined', () => {
            delete ticketAttributes.rewindingDuration;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.rewindingDuration).toEqual(0);
        });
    });

    describe('attribute: productIdToNumberOfFinishedRolls', () => {
        it('should not be required', () => {
            delete ticketAttributes.productIdToNumberOfFinishedRolls;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a map whose id is a mongoose object id and the value is a number representing the number of finished rolls for that product', () => {
            const productIdToNumberOfFinishedRolls = {
                [new mongoose.Types.ObjectId()]: chance.d100(),
                [new mongoose.Types.ObjectId()]: chance.d100()
            };
            ticketAttributes.productIdToNumberOfFinishedRolls = productIdToNumberOfFinishedRolls;
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.productIdToNumberOfFinishedRolls.toJSON()).toEqual(productIdToNumberOfFinishedRolls);
        });
    });

    describe('attribute: windingJobComments', () => {
        it('should not be required', () => {
            delete ticketAttributes.windingJobComments;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a string', () => {
            const windingJobComments = chance.string();
            ticketAttributes.windingJobComments = windingJobComments;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.windingJobComments).toEqual(windingJobComments);
        });
    });

    describe('attribute: packagingDuration', () => {
        it ('should not be required', () => {
            delete ticketAttributes.packagingDuration;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a field containing a positive integer representing a number of seconds', () => {
            verifyTimeFieldInSeconds(ticketAttributes, 'packagingDuration');
        });
    });

    describe('attribute: boxes', () => {
        it('should default to an empty array', () => {
            delete ticketAttributes.boxes;
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.boxes).toEqual([]);
        });

        it('should be an array of objects which contain the correct attributes', () => {
            const rollsPerBox = chance.d100();
            const boxSize = chance.d100();
            const quantityOfBoxes = chance.d100();
            const box = {rollsPerBox, boxSize, quantityOfBoxes};
            ticketAttributes.boxes = [box];

            const ticket = new Ticket(ticketAttributes);
            const [box1] = ticket.boxes;
            
            expect(box1.rollsPerBox).toEqual(rollsPerBox);
            expect(box1.boxSize).toEqual(boxSize);
            expect(box1.quantityOfBoxes).toEqual(quantityOfBoxes);
        });

        it('should default rollsPerBox, boxSize, and quantityOfBoxes to 0', () => {
            const emtpyBox = {};
            ticketAttributes.boxes = [emtpyBox];
            const ticket = new Ticket(ticketAttributes);
            const [box] = ticket.boxes;
            
            expect(box.rollsPerBox).toEqual(0);
            expect(box.boxSize).toEqual(0);
            expect(box.quantityOfBoxes).toEqual(0);
        });

        it('should fail validation boxes[n].rollsPerBox is negative', () => {
            ticketAttributes.boxes = [{rollsPerBox: -1, boxSize: chance.d100(), quantityOfBoxes: chance.d100() }];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation boxes[n].boxSize is negative', () => {
            ticketAttributes.boxes = [{rollsPerBox: chance.d100(), boxSize: -1, quantityOfBoxes: chance.d100() }];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation boxes[n].quantityOfBoxes is negative', () => {
            ticketAttributes.boxes = [{rollsPerBox: chance.d100(), boxSize: chance.d100(), quantityOfBoxes: -1 }];
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: totalRollsBoxed', () => {
        it('should not be required', () => {
            delete ticketAttributes.totalRollsBoxed;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a calculated field', () => {
            const valueToIgnoreCompletely = chance.d100();
            ticketAttributes.totalRollsBoxed = valueToIgnoreCompletely;
            const boxes = [
                { rollsPerBox: chance.d100() },
                { rollsPerBox: chance.d100() },
                { rollsPerBox: chance.d100() }
            ];
            const expectedTotalRollsBoxed = boxes[0].rollsPerBox + boxes[1].rollsPerBox + boxes[2].rollsPerBox;
            ticketAttributes.boxes = boxes;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.totalRollsBoxed).toEqual(expectedTotalRollsBoxed);
        });
    });
    
    describe('attribute: totalQtyBoxed', () => {
        it('should not be required', () => {
            delete ticketAttributes.totalQtyBoxed;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();

            expect(error).toBeUndefined();
        });

        it('should default to 0', () => {
            delete ticketAttributes.totalQtyBoxed;
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.totalQtyBoxed).toEqual(0);
        });

        it('should be greater than or equal to 0', () => {
            ticketAttributes.totalQtyBoxed = -1;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: productIdToFinishedLabelQty', () => {
        it('should not be required', () => {
            delete ticketAttributes.productIdToFinishedLabelQty;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a map whose id is a mongoose object id and the value is a number representing the number of finished rolls for that product', () => {
            const productIdToFinishedLabelQty = {
                [new mongoose.Types.ObjectId()]: chance.d100(),
                [new mongoose.Types.ObjectId()]: chance.d100()
            };
            ticketAttributes.productIdToFinishedLabelQty = productIdToFinishedLabelQty;
            const ticket = new Ticket(ticketAttributes);

            expect(ticket.productIdToFinishedLabelQty.toJSON()).toEqual(productIdToFinishedLabelQty);
        });
    });

    describe('attribute: packagingJobComments', () => {
        it('should be a string', () => {
            ticketAttributes.packagingJobComments = chance.d100();
            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.packagingJobComments).toEqual(expect.any(String));
        });

        it('should not be required', () => {
            delete ticketAttributes.packagingJobComments;
            const ticket = new Ticket(ticketAttributes);
            
            const error = ticket.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should trim whitespace', () => {
            const jobComments = chance.string();
            ticketAttributes.packagingJobComments = ` ${jobComments} `;

            const ticket = new Ticket(ticketAttributes);
            
            expect(ticket.packagingJobComments).toEqual(jobComments.trim());
        });
    });

    describe('database interaction validations', () => {
        let customerAttributes, savedCustomer;

        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();
            customerAttributes = testDataGenerator.mockData.Customer();
            const customer = new Customer(customerAttributes);
            savedCustomer = await customer.save();
            ticketAttributes.customer = savedCustomer._id;
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

        describe('attribute: ticketNotes', () => {
            it('should append ticket.customer.notes to ticket.ticketNotes', async () => {
                ticketAttributes.ticketNotes = chance.string();
                const ticket = new Ticket(ticketAttributes);
                const savedTicket = await ticket.save();
                const expectedTicketNotesAfterSaving = `${ticketAttributes.ticketNotes}\n\nCustomer Notes:\n${savedCustomer.notes}`

                console.log(savedTicket.ticketNotes);

                expect(savedTicket.ticketNotes).toEqual(expectedTicketNotesAfterSaving);
            })
        })
    });
});
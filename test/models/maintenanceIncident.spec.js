const mongoose = require('mongoose');
const MaintenanceIncidentModel = require('../../application/models/maintenanceIncident');
const databaseService = require('../../application/services/databaseService');
const chance = require('chance').Chance();

describe('MaintenanceIncident', () => {
    let maintenanceIncidentAttributes;

    beforeEach(() => {
        maintenanceIncidentAttributes = {
            incidentName: 'ABC',
            timeToComplete: chance.d100(),
            notes: chance.paragraph(),
            author: new mongoose.Types.ObjectId()
        };
    });

    it('should pass validation if all required fields are present', () => {
        const maintenanceIncident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);
        
        const error = maintenanceIncident.validateSync();

        expect(error).toBeUndefined();
    });

    describe('attribute: incidentName', () => {
        it('should be a string', () => {
            const maintenanceIncident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);

            expect(maintenanceIncident.incidentName).toEqual(expect.any(String));
        });

        it('should be required', () => {
            delete maintenanceIncidentAttributes.incidentName;
            const maintenanceIncident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);
            
            const error = maintenanceIncident.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should convert to uppercase', () => {
            const lowerCaseIncidentName = chance.string().toLowerCase();
            maintenanceIncidentAttributes.incidentName = lowerCaseIncidentName;
            const maintenanceIncident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);

            expect(maintenanceIncident.incidentName).toEqual(lowerCaseIncidentName.toUpperCase());
        });
    });

    describe('attribute: timeToComplete', () => {
        it('should be a number', () => {
            const maintenanceIncident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);
            
            expect(maintenanceIncident.timeToComplete).toEqual(expect.any(Number));
        });

        it('should be required', () => {
            delete maintenanceIncidentAttributes.timeToComplete;
            const maintenanceIncident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);
            
            const error = maintenanceIncident.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should NOT be less than 0', () => {
            const negativeTimeToComplete = chance.d100() * -1;
            maintenanceIncidentAttributes.timeToComplete = negativeTimeToComplete;
            const maintenanceIncident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);

            const error = maintenanceIncident.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: notes', () => {
        it('should be a string', () => {
            const maintenanceIncident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);
            
            expect(maintenanceIncident.notes).toEqual(expect.any(String));
        });
        
        it('should not be required', () => {
            delete maintenanceIncidentAttributes.notes;
            const maintenanceIncident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);

            const error = maintenanceIncident.validateSync();

            expect(error).toBeUndefined();
        });

        it('should trim whitespace', () => {
            const expectedNotes = chance.paragraph();
            maintenanceIncidentAttributes.notes = `  ${expectedNotes}  `;
            const maintenanceIncident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);
            
            expect(maintenanceIncident.notes).toEqual(expectedNotes);
        });
    });

    describe('attribute: author', () => {
        it('should be a mongoose objectId', () => {
            const maintenanceIncident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);
            
            expect(maintenanceIncident.author).toEqual(expect.any(mongoose.Types.ObjectId));
        });
        
        it('should be required', () => {
            delete maintenanceIncidentAttributes.author;
            const maintenanceIncident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);
            
            const error = maintenanceIncident.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('verify database interactions', () => {
        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        it('should soft delete items', async () => {
            const incident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);
            const id = incident._id;

            await incident.save();
            await MaintenanceIncidentModel.deleteById(id);

            const softDeletedIncident = await MaintenanceIncidentModel.findOneDeleted({_id: id}).exec();

            expect(softDeletedIncident).toBeDefined();
            expect(softDeletedIncident.deleted).toBe(true);
        });

        it('should have timestamps once object is saved', async () => {
            const maintenanceIncident = new MaintenanceIncidentModel(maintenanceIncidentAttributes);

            let savedMaintenanceIncident = await maintenanceIncident.save({ validateBeforeSave: false });

            expect(savedMaintenanceIncident.createdAt).toBeDefined();
            expect(savedMaintenanceIncident.updatedAt).toBeDefined();
        });
    });
});
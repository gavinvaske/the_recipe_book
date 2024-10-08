import { MaintenanceIncidentTypeModel } from '../../application/api/models/maintenanceIncidentType';
import Chance from 'chance';
import * as databaseService from '../../application/api/services/databaseService';

const chance = Chance();

describe('MaintenanceIncidentType', () => {
    let maintenanceIncidentTypeAttributes;

    beforeEach(() => {
        maintenanceIncidentTypeAttributes = {
            incidentName: chance.string()
        };
    });

    it('should pass validation if all required fields are present', async () => {
        const maintenanceIncidentType = new MaintenanceIncidentTypeModel(maintenanceIncidentTypeAttributes);
        
        const error = maintenanceIncidentType.validateSync();

        expect(error).toBeFalsy();
    });

    describe('attribute: incidentName', () => {
        it('should be a string', async () => {
            const maintenanceIncidentType = new MaintenanceIncidentTypeModel(maintenanceIncidentTypeAttributes);
            
            expect(maintenanceIncidentType.incidentName).toEqual(expect.any(String));
        });

        it('should convert to upper case', async () => {
            const lowerCaseIncidentName = chance.string().toLowerCase();
            maintenanceIncidentTypeAttributes.incidentName = lowerCaseIncidentName;
            
            const maintenanceIncidentType = new MaintenanceIncidentTypeModel(maintenanceIncidentTypeAttributes);
            
            expect(maintenanceIncidentType.incidentName).toEqual(lowerCaseIncidentName.toUpperCase());
        });

        it('should be required', async () => {
            delete maintenanceIncidentTypeAttributes.incidentName;
            
            const maintenanceIncidentType = new MaintenanceIncidentTypeModel(maintenanceIncidentTypeAttributes);
            
            const error = maintenanceIncidentType.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should trim whitespace', async () => {
            const expectedMaintenanceIncidentName = chance.string();
            maintenanceIncidentTypeAttributes.incidentName = ` ${expectedMaintenanceIncidentName} `;
            
            const maintenanceIncidentType = new MaintenanceIncidentTypeModel(maintenanceIncidentTypeAttributes);
            
            expect(maintenanceIncidentType.incidentName.toUpperCase()).toEqual(expectedMaintenanceIncidentName.toUpperCase());
        });
    });

    describe('verify database interactions', () => {
        beforeAll(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.clearDatabase();
        });

        afterAll(async () => {
            await databaseService.closeDatabase();
        });

        it('should have timestamps once object is saved', async () => {
            const maintenanceIncidentType = new MaintenanceIncidentTypeModel(maintenanceIncidentTypeAttributes);

            let savedMaintenanceIncidentType = await maintenanceIncidentType.save({ validateBeforeSave: false });

            expect(savedMaintenanceIncidentType.createdAt).toBeDefined();
            expect(savedMaintenanceIncidentType.updatedAt).toBeDefined();
        });
    });
});
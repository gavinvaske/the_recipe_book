import Chance from 'chance'
const chance = Chance();;
const departmentNotesSchema = require('../../application/schemas/departmentNotes');
const departmentsEnum = require('../../application/enums/departmentsEnum');
import mongoose from 'mongoose'
import * as databaseService from '../../application/services/databaseService.js';

describe('validation', () => {
    let departmentNotesAttributes,
        DepartmentNotesModel;

    beforeEach(async () => {
        departmentNotesAttributes = {
            orderPrep: chance.string(),
            artPrep: chance.string(),
            prePrinting: chance.string(),
            printing: chance.string(),
            cutting: chance.string(),
            winding: chance.string(),
            packaging: chance.string(),
            shipping: chance.string(),
            billing: chance.string()
        };
        DepartmentNotesModel = mongoose.model('DepartmentNotes', departmentNotesSchema);
    });

    it('should validate if all attributes are defined successfully', () => {
        const departmentNotes = new DepartmentNotesModel(departmentNotesAttributes);
    
        const error = departmentNotes.validateSync();

        expect(error).toBe(undefined);
    });

    it('should have one key for every department', () => {
        const departmentNotes = new DepartmentNotesModel(departmentNotesAttributes);
        const actualNumberOfKeys = Object.keys(departmentNotes.toJSON()).length;
        const numberOfMongooseKeysToIgnore = 1;
        const expectedNumberOfKeys = departmentsEnum.getAllDepartmentsWithDepartmentStatuses().length;

        expect(actualNumberOfKeys - numberOfMongooseKeysToIgnore).toBe(expectedNumberOfKeys);
    });

    it('should trim values', () => {
        const department = chance.pickone(departmentsEnum.getAllDepartmentsWithDepartmentStatuses());
        const note = chance.string();
        departmentNotesAttributes[department] = '  ' + note + '   ';
        const departmentNotes = new DepartmentNotesModel(departmentNotesAttributes);
        
        expect(departmentNotes[department]).toEqual(note);
    });

    describe('aliases', () => {
        beforeEach(() => {
            departmentNotesAttributes = {
                [departmentsEnum.ORDER_PREP_DEPARTMENT]: chance.string(),
                [departmentsEnum.ART_PREP_DEPARTMENT]: chance.string(),
                [departmentsEnum.PRE_PRINTING_DEPARTMENT]: chance.string(),
                [departmentsEnum.PRINTING_DEPARTMENT]: chance.string(),
                [departmentsEnum.CUTTING_DEPARTMENT]: chance.string(),
                [departmentsEnum.WINDING_DEPARTMENT]: chance.string(),
                [departmentsEnum.PACKAGING_DEPARTMENT]: chance.string(),
                [departmentsEnum.SHIPPING_DEPARTMENT]: chance.string(),
                [departmentsEnum.BILLING_DEPARTMENT]: chance.string()
            };
        });

        it('should validate if all attributes are defined successfully', () => {
            const departmentNotes = new DepartmentNotesModel(departmentNotesAttributes);
        
            const error = departmentNotes.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should have one key for every department', () => {
            const departmentNotes = new DepartmentNotesModel(departmentNotesAttributes);
            const actualNumberOfKeys = Object.keys(departmentNotes.toJSON()).length;
            const numberOfMongooseKeysToIgnore = 1;
            const expectedNumberOfKeys = departmentsEnum.getAllDepartmentsWithDepartmentStatuses().length;
    
            expect(actualNumberOfKeys - numberOfMongooseKeysToIgnore).toBe(expectedNumberOfKeys);
        });

        it('should throw an error if an unknown key is attempted to be set onto the schema', () => {
            const someRandomKey = chance.string();
            departmentNotesAttributes[someRandomKey] = chance.string();

            expect(() => new DepartmentNotesModel(departmentNotesAttributes)).toThrow();
        });
    });

    describe('verify timestamps on created object', () => {
        beforeAll(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.clearDatabase();
        });

        afterAll(async () => {
            await databaseService.closeDatabase();
        });

        describe('verify timestamps on created object', () => {
            it('should have a "createdAt" attribute once object is saved', async () => {
                const departmentNotes = new DepartmentNotesModel(departmentNotesAttributes);
                let savedDepartmentNotes = await departmentNotes.save({validateBeforeSave: false});
    
                expect(savedDepartmentNotes.createdAt).toBeDefined();
                expect(savedDepartmentNotes.updatedAt).toBeDefined();
            });
        });
    });
});
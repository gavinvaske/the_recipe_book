const SpotPlateModel = require('../../application/models/spotPlate');
const chance = require('chance').Chance();
const databaseService = require('../../application/services/databaseService');
const departmentsEnum = require('../../application/enums/departmentsEnum');

describe('validation', () => {
    let spotPlateAttributes;

    beforeEach(() => {
        spotPlateAttributes = {
            title: chance.string(),
            description: '',
            fileUploads: []
        };
    });

    it('should validate if all attributes are defined successfully', () => {
        const spotPlate = new SpotPlateModel(spotPlateAttributes);

        const error = spotPlate.validateSync();

        expect(error).toBe(undefined);
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
                const spotPlate = new SpotPlateModel(spotPlateAttributes);
                let savedSpotPlate = await spotPlate.save({validateBeforeSave: false});
    
                expect(savedSpotPlate.createdAt).toBeDefined();
            });
    
            it('should have a "updated" attribute once object is saved', async () => {
                const spotPlate = new SpotPlateModel(spotPlateAttributes);
                let savedSpotPlate = await spotPlate.save({validateBeforeSave: false});
    
                expect(savedSpotPlate.createdAt).toBeDefined();
            });
        });
    });

    describe('attribute: title', () => {
        it('should contain attribute', () => {
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.title).toBeDefined();
        });

        it('should fail validation if attribute is not defined', () => {
            delete spotPlateAttributes.title;
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            const error = spotPlate.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should trim leading and trailing whitespace', () => {
            const expectedTitle = chance.string();
            spotPlateAttributes.title = '  ' + expectedTitle + '  ';
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.title).toEqual(expectedTitle);
        });

        it('should be of type String', () => {
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.title).toEqual(expect.any(String));
        });
    });

    describe('attribute: description', () => {
        it('should contain attribute', () => {
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.description).toBeDefined();
        });

        it('should NOT fail validation if attribute is missing', () => {
            delete spotPlateAttributes.description;
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            const error = spotPlate.validateSync();

            expect(error).toBe(undefined);
        });

        it('should trim leading and trailing whitespace', () => {
            const expectedDescription = chance.string();
            spotPlateAttributes.description = '  ' + expectedDescription + '  ';
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.description).toEqual(expectedDescription);
        });

        it('should be of type String', () => {
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.description).toEqual(expect.any(String));
        });
    });

    describe('attribute: fileUploads', () => {
        it('should contain attribute', () => {
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.fileUploads).toBeDefined();
        });

        it('should NOT fail validation if attribute is missing and default to an empty array', () => {
            delete spotPlateAttributes.fileUploads;
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            const error = spotPlate.validateSync();

            expect(error).toBe(undefined);
            expect(spotPlate.fileUploads).toEqual([]);
        });

        it('should be the correct object', () => {
            const file = {
                url: chance.url(),
                fileName: chance.string()
            };
            const expectedFileUploads = [
                file
            ];
            spotPlateAttributes.fileUploads = expectedFileUploads;
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            expect(spotPlate.fileUploads.length).toEqual(expectedFileUploads.length);
            expect(spotPlate.fileUploads[0]).toEqual(expect.objectContaining(file));
            expect(spotPlate.fileUploads[0]._id).toBeDefined();
        });
    });

    describe('attribute: destination', () => {
        it('should NOT fail validaiton if attribute is not set', () => {
            delete spotPlateAttributes.destination;
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            const error = spotPlate.validateSync();

            expect(error).toBeUndefined();
        });

        it('should fail validation if destination is empty object', () => {
            spotPlateAttributes.destination = {};
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            const error = spotPlate.validateSync();

            expect(error).toBeDefined();
        });

        it('should pass validation if destination.department and destination.departmentStatus are defined correctly', () => {
            const validSpotPlateDepartment = getRandomValidSpotPlateDepartment();
            const validSpotPlateDepartmentStatus = getRandomValidSpotPlateDepartmentStatus(validSpotPlateDepartment);

            spotPlateAttributes.destination = {
                department: validSpotPlateDepartment,
                departmentStatus: validSpotPlateDepartmentStatus
            };
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            const error = spotPlate.validateSync();

            expect(error).toBeUndefined();
        });

        it('should fail validation if destination.department is defined correctly but destination.departmentStatus is not', () => {
            const validSpotPlateDepartment = getRandomValidSpotPlateDepartment();
            const invalidSpotPlateDepartmentStatus = chance.word();

            spotPlateAttributes.destination = {
                department: validSpotPlateDepartment,
                departmentStatus: invalidSpotPlateDepartmentStatus
            };
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            const error = spotPlate.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail validation if destination.department is not allowed, regardless of what destination.departmentStatus is', () => {
            const invalidSpotPlateDepartment = chance.word();

            const validDepartment = getRandomValidSpotPlateDepartment();
            const validSpotPlateDepartment = getRandomValidSpotPlateDepartmentStatus(validDepartment);

            spotPlateAttributes.destination = {
                department: invalidSpotPlateDepartment,
                departmentStatus: validSpotPlateDepartment
            };
            const spotPlate = new SpotPlateModel(spotPlateAttributes);

            const error = spotPlate.validateSync();

            expect(error).toBeDefined();
        });
    });
});

function getRandomValidSpotPlateDepartment() {
    return chance.pickone(Object.keys(departmentsEnum.departmentToDepartmentStatusesForSpotPlateRequests));
}

function getRandomValidSpotPlateDepartmentStatus(department) {
    const validDepartmentStatusesToChoseFrom = departmentsEnum.departmentToDepartmentStatusesForSpotPlateRequests[department];

    return validDepartmentStatusesToChoseFrom.length > 0 
        ? chance.pickone(validDepartmentStatusesToChoseFrom) 
        : undefined;
}
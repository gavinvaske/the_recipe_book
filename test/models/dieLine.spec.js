const DieLineModel = require('../../application/models/dieLine');
const chance = require('chance').Chance();
const databaseService = require('../../application/services/databaseService');
const departmentsEnum = require('../../application/enums/departmentsEnum');

describe('validation', () => {
    let dieLineAttributes;

    beforeEach(() => {
        dieLineAttributes = {
            title: chance.string(),
            description: '',
            fileUploads: []
        };
    });

    it('should validate if all attributes are defined successfully', () => {
        const dieLineCard = new DieLineModel(dieLineAttributes);

        const error = dieLineCard.validateSync();

        expect(error).toBe(undefined);
    });

    describe('verify timestamps on created object', () => {
        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        describe('verify timestamps on created object', () => {
            it('should have a "createdAt" attribute once object is saved', async () => {
                const dieLine = new DieLineModel(dieLineAttributes);
                let savedDieLine = await dieLine.save({validateBeforeSave: false});
    
                expect(savedDieLine.createdAt).toBeDefined();
            });
    
            it('should have a "updated" attribute once object is saved', async () => {
                const dieLine = new DieLineModel(dieLineAttributes);
                let savedDieLine = await dieLine.save({validateBeforeSave: false});
    
                expect(savedDieLine.createdAt).toBeDefined();
            });
        });
    });

    describe('attribute: title', () => {
        it('should contain attribute', () => {
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.title).toBeDefined();
        });

        it('should fail validation if attribute is not defined', () => {
            delete dieLineAttributes.title;
            const dieLine = new DieLineModel(dieLineAttributes);

            const error = dieLine.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type String', () => {
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.title).toEqual(expect.any(String));
        });

        it('should trim leading and trailing whitespace', () => {
            const expectedTitle = chance.string();
            dieLineAttributes.title = '  ' + expectedTitle + '  ';
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.title).toEqual(expectedTitle);
        });
    });

    describe('attribute: description', () => {
        it('should contain attribute', () => {
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.description).toBeDefined();
        });

        it('should NOT fail validation if attribute is missing', () => {
            delete dieLineAttributes.description;
            const dieLine = new DieLineModel(dieLineAttributes);

            const error = dieLine.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type String', () => {
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.description).toEqual(expect.any(String));
        });

        it('should trim leading and trailing whitespace', () => {
            const expectedDescription = chance.string();
            dieLineAttributes.description = '  ' + expectedDescription + '  ';
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.description).toEqual(expectedDescription);
        });
    });

    describe('attribute: fileUploads', () => {
        it('should contain attribute', () => {
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.fileUploads).toBeDefined();
        });

        it('should NOT fail validation if attribute is missing and default to an empty array', () => {
            delete dieLineAttributes.fileUploads;
            const dieLine = new DieLineModel(dieLineAttributes);

            const error = dieLine.validateSync();

            expect(error).toBe(undefined);
            expect(dieLine.fileUploads).toEqual([]);
        });

        it('should be the correct object', () => {
            const file = {
                url: chance.url(),
                fileName: chance.string()
            };
            const expectedFileUploads = [
                file
            ];
            dieLineAttributes.fileUploads = expectedFileUploads;
            const dieLine = new DieLineModel(dieLineAttributes);

            expect(dieLine.fileUploads.length).toEqual(expectedFileUploads.length);
            expect(dieLine.fileUploads[0]).toEqual(expect.objectContaining(file));
            expect(dieLine.fileUploads[0]._id).toBeDefined();
        });
    });

    describe('attribute: destination', () => {
        it('should NOT fail validaiton if attribute is not set', () => {
            delete dieLineAttributes.destination;
            const dieLine = new DieLineModel(dieLineAttributes);

            const error = dieLine.validateSync();

            expect(error).toBeUndefined();
        });

        it('should fail validation if destination is empty object', () => {
            dieLineAttributes.destination = {};
            const dieLine = new DieLineModel(dieLineAttributes);

            const error = dieLine.validateSync();

            console.log(error)

            expect(error).toBeDefined();
        });

        it('should pass validation if destination.department and destination.departmentStatus are defined correctly', () => {
            const validDieLineDepartment = getRandomValidDieLineDepartment();
            const validDieLineDepartmentStatus = getRandomValidDieLineDepartmentStatus(validDieLineDepartment);

            dieLineAttributes.destination = {
                department: validDieLineDepartment,
                departmentStatus: validDieLineDepartmentStatus
            };
            const dieLine = new DieLineModel(dieLineAttributes);

            const error = dieLine.validateSync();

            expect(error).toBeUndefined();
        });

        it('should fail validation if destination.department is defined correctly but destination.departmentStatus is not', () => {
            const validDieLineDepartment = getRandomValidDieLineDepartment();
            const invalidDieLineDepartmentStatus = chance.word();

            dieLineAttributes.destination = {
                department: validDieLineDepartment,
                departmentStatus: invalidDieLineDepartmentStatus
            };
            const dieLine = new DieLineModel(dieLineAttributes);

            const error = dieLine.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail validation if destination.department is not allowed, regardless of what destination.departmentStatus is', () => {
            const invalidSpotPlateDepartment = chance.word();

            const validDepartment = getRandomValidDieLineDepartment();
            const validDieLineDepartment = getRandomValidDieLineDepartmentStatus(validDepartment);

            dieLineAttributes.destination = {
                department: invalidSpotPlateDepartment,
                departmentStatus: validDieLineDepartment
            };
            const dieLine = new DieLineModel(dieLineAttributes);

            const error = dieLine.validateSync();

            expect(error).toBeDefined();
        });
    });
});

function getRandomValidDieLineDepartment() {
    return chance.pickone(Object.keys(departmentsEnum.departmentToDepartmentStatusesForDieLineRequests));
}

function getRandomValidDieLineDepartmentStatus(department) {
    const validDepartmentStatusesToChoseFrom = departmentsEnum.departmentToDepartmentStatusesForDieLineRequests[department];

    return validDepartmentStatusesToChoseFrom.length > 0
        ? chance.pickone(validDepartmentStatusesToChoseFrom)
        : undefined;
}
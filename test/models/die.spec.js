const chance = require('chance').Chance();
const DieModel = require('../../application/models/Die');
const { dieShapes } = require('../../application/enums/dieShapesEnum');
const { toolTypes } = require('../../application/enums/toolTypesEnum');
const { dieVendors } = require('../../application/enums/dieVendorsEnum');
const { dieMagCylinders } = require('../../application/enums/dieMagCylindersEnum');
const { dieStatuses, IN_STOCK_DIE_STATUS, ORDERED_DIE_STATUS } = require('../../application/enums/dieStatusesEnum');
const databaseService = require('../../application/services/databaseService');

function getRandomCost() {
    return chance.floating({ min: 0, fixed: 2 });
}

const delay = (delayInMs) => {
    return new Promise(resolve => setTimeout(resolve, delayInMs));
};

describe('validation', () => {
    let dieAttributes;

    beforeEach(() => {
        dieAttributes = {
            dieShape: chance.pickone(dieShapes),
            sizeAcross: chance.floating({ min: 0 }),
            sizeAround: chance.floating({ min: 0 }),
            dieNumber: 'DC-1234',
            numberAcross: chance.d100(),
            numberAround: chance.d100(),
            gear: chance.d100(),
            toolType: chance.pickone(toolTypes),
            notes: chance.string(),
            cost: getRandomCost(),
            vendor: chance.pickone(dieVendors),
            magCylinder: chance.pickone(dieMagCylinders),
            cornerRadius: chance.floating(),
            spaceAcross: chance.floating(),
            spaceAround: chance.floating(),
            facestock: chance.string(),
            liner: chance.string(),
            specialType: chance.string(),
            serialNumber: chance.string(),
            status: chance.pickone(dieStatuses),
            quantity: chance.d100()
        };
    });

    it('should not fail validation if all attributes are defined correctly', () => {
        const die = new DieModel(dieAttributes);

        const error = die.validateSync();

        expect(error).toBeUndefined();
    });

    describe('attribute: dieShape', () => {
        it('should fail validation if attribute is not defined', () => {
            delete dieAttributes.dieShape;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail if string is not an accepted enum value', () => {
            const definitlyNotARealShape = chance.string();
            dieAttributes.dieShape = definitlyNotARealShape;

            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        });

        it('should NOT fail if string IS AN accepted enum value', () => {
            const acceptableShape = chance.pickone(dieShapes);
            dieAttributes.dieShape = acceptableShape;

            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should NOT fail if string IS A accepted enum value but lowercased', () => {
            const acceptableShape = chance.pickone(dieShapes);
            dieAttributes.dieShape = acceptableShape.toLowerCase();

            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).not.toBeDefined();
        });
    });

    describe('attribute: sizeAcross', () => {
        it('should fail if attribute is undefined', () => {
            delete dieAttributes.sizeAcross;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            const expectedSizeAcross = 123.123;
            dieAttributes.sizeAcross = String(expectedSizeAcross);

            const die = new DieModel(dieAttributes);

            expect(die.sizeAcross).toEqual(expect.any(Number));
        });

        it('should fail if attribute is negative', () => {
            const negativeSizeAcross = chance.floating( {max: -1} );
            dieAttributes.sizeAcross = negativeSizeAcross;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        });
    });
    describe('attribute: sizeAround', () => {
        it('should fail if attribute is undefined', () => {
            delete dieAttributes.sizeAround;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            const expectedSizeAround = 123.123;
            dieAttributes.sizeAround = String(expectedSizeAround);

            const die = new DieModel(dieAttributes);

            expect(die.sizeAround).toEqual(expect.any(Number));
        });

        it('should fail if attribute is negative', () => {
            const negativeSizeAround = chance.floating( {max: -1} );
            dieAttributes.sizeAround = negativeSizeAround;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: dieNumber', () => {
        it('should fail validation if attribute is undefined', () => {
            delete dieAttributes.dieNumber;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a string', () => {
            const die = new DieModel(dieAttributes);
        
            expect(die.dieNumber).toEqual(expect.any(String));
        });

        it('should fail if the string DOES NOT follow the correct regex pattern', () => {
            const invalidDieNumber = chance.word();
            dieAttributes.dieNumber = invalidDieNumber;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should automatically capitalize dieNumber and not fail if dieNumber is valid', () => {
            const lowercaseDieNumber = 'xldr-0001';
            dieAttributes.dieNumber = lowercaseDieNumber;
            const die = new DieModel(dieAttributes);

            expect(die.dieNumber).toEqual(die.dieNumber.toUpperCase());
        });

        it('should pass validation if dieNumbers are valid', () => {
            const validDieNumbers = ['DC-0001', 'DR-9999', 'DRC-6666', 'DO-3212', 'DS-0987', 'XLDR-0001', 'DSS-7777', 'DB-1234'];

            validDieNumbers.forEach((dieNumber) => {
                dieAttributes.dieNumber = dieNumber;
                const die = new DieModel(dieAttributes);
                
                const error = die.validateSync();
                
                expect(error).toBeUndefined();
            });
        });
    });

    describe('attribute: numberAcross', () => {
        it('should fail validation if attribute is undefined', () => {
            delete dieAttributes.numberAcross;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if value IS NOT a whole number', () => {
            dieAttributes.numberAcross = chance.floating({ min: 0 });
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if value IS NEGATIVE', () => {
            const negativeValue = chance.d100() * -1;
            dieAttributes.numberAcross = negativeValue;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            const expectedNumberAcross = chance.d100();
            dieAttributes.numberAcross = String(expectedNumberAcross);
            const die = new DieModel(dieAttributes);

            expect(die.numberAcross).toEqual(expect.any(Number));
        });
    });

    describe('attribute: numberAround', () => {
        it('should fail validation if attribute is undefined', () => {
            delete dieAttributes.numberAround;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if value IS NOT a whole number', () => {
            dieAttributes.numberAround = chance.floating({ min: 0 });
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if value IS NEGATIVE', () => {
            const negativeValue = chance.d100() * -1;
            dieAttributes.numberAround = negativeValue;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            const numberAroundAsNumber = chance.d100();
            dieAttributes.numberAround = String(numberAroundAsNumber);
            const die = new DieModel(dieAttributes);

            expect(die.numberAround).toEqual(expect.any(Number));
        });
    });

    describe('attribute: gear', () => {
        it('should fail validation if attribute is undefined', () => {
            delete dieAttributes.gear;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if value IS NOT a whole number', () => {
            dieAttributes.gear = chance.floating({ min: 0 });
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if value IS NEGATIVE', () => {
            const negativeValue = chance.d100() * -1;
            dieAttributes.gear = negativeValue;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            const gear = chance.d100();
            dieAttributes.gear = String(gear);
            const die = new DieModel(dieAttributes);

            expect(die.gear).toEqual(expect.any(Number));
        });
    });


    describe('attribute: toolType', () => {
        it('should fail validation if attribute is not defined', () => {
            delete dieAttributes.toolType;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail if string is not an accepted enum value', () => {
            const invalidToolType = chance.string();
            dieAttributes.toolType = invalidToolType;

            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        });

        it('should NOT fail if string IS AN accepted enum value', () => {
            const validToolType = chance.pickone(toolTypes);
            dieAttributes.toolType = validToolType;

            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should get converted to uppercase', () => {
            const lowercaseToolType = chance.pickone(toolTypes).toLowerCase();;
            dieAttributes.toolType = lowercaseToolType;
            const die = new DieModel(dieAttributes);

            expect(die.toolType).toEqual(lowercaseToolType.toUpperCase());
        });

        it('should NOT fail if string IS A accepted enum value but lowercased', () => {
            const validToolType = chance.pickone(toolTypes);
            dieAttributes.toolType = validToolType.toLowerCase();

            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).not.toBeDefined();
        });
    });

    describe('attribute: notes', () => {
        it('should fail validation if attribute is undefined', () => {
            delete dieAttributes.notes;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a string', () => {
            dieAttributes.notes = chance.floating();
            const die = new DieModel(dieAttributes);
            
            expect(die.notes).toEqual(expect.any(String));
        });

        it('should trim whitespace', () => {
            const expectedNotes = chance.string();
            dieAttributes.notes = '  ' + expectedNotes + ' ';
            const die = new DieModel(dieAttributes);
            
            expect(die.notes).toEqual(expectedNotes);
        });
    });

    describe('attribute: cost', () => {
        it('should fail validation if attribute is undefined', () => {
            delete dieAttributes.cost;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            dieAttributes.cost = getRandomCost();
            const die = new DieModel(dieAttributes);
            
            expect(die.cost).toEqual(expect.any(Number));
        });

        it('should fail validation if attribute is negative', () => {
            dieAttributes.cost = getRandomCost() * -1;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should only store up to 2 decimal places', () => {
            const expectedCost = 123.11;
            const smallDecimalToIgnore = 0.009;
            dieAttributes.cost = expectedCost + smallDecimalToIgnore;
            const die = new DieModel(dieAttributes);
            
            expect(die.cost).toEqual(expectedCost);
        });
    });

    describe('attribute: vendor', () => {
        it('should fail validation if attribute is not defined', () => {
            delete dieAttributes.vendor;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a string', () => {
            const vendor = chance.pickone(dieVendors);
            dieAttributes.vendor = vendor;

            const die = new DieModel(dieAttributes);

            expect(die.vendor).toEqual(expect.any(String));
        });

        it('should fail validation if string is not an accepted enum value', () => {
            const invalidVendor = chance.string();
            dieAttributes.vendor = invalidVendor;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should pass validation if string IS AN accepted enum value', () => {
            const validVendor = chance.pickone(dieVendors);
            dieAttributes.vendor = validVendor;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();
            
            expect(error).not.toBeDefined();
        });

        it('should convert to uppercase', () => {
            const lowercaseVendor = chance.pickone(dieVendors).toLowerCase();
            dieAttributes.vendor = lowercaseVendor;
            const die = new DieModel(dieAttributes);
            
            expect(die.vendor).toEqual(lowercaseVendor.toUpperCase());
        });
    });

    describe('attribute: magCylinder', () => {
        it('should fail validation if attribute is not defined', () => {
            delete dieAttributes.magCylinder;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            dieAttributes.magCylinder = String(chance.pickone(dieMagCylinders));
            const die = new DieModel(dieAttributes);

            expect(die.magCylinder).toEqual(expect.any(Number));
        });

        it('should fail if number is not an accepted enum value', () => {
            const invalidMagCylinder = 999999;
            dieAttributes.magCylinder = invalidMagCylinder;

            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should pass validation if number IS AN accepted enum value', () => {
            const validMagCylinder = chance.pickone(dieMagCylinders);
            dieAttributes.magCylinder = validMagCylinder;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).not.toBeDefined();
        });
    });
    describe('attribute: cornerRadius', () => {
        it('should fail validation if attribute is not defined', () => {
            delete dieAttributes.cornerRadius;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            dieAttributes.cornerRadius = String(chance.floating());
            const die = new DieModel(dieAttributes);
            
            expect(die.cornerRadius).toEqual(expect.any(Number));
        });
    });
    describe('attribute: spaceAcross', () => {
        it('should fail validation if attribute is not defined', () => {
            delete dieAttributes.spaceAcross;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            dieAttributes.spaceAcross = String(chance.floating());
            const die = new DieModel(dieAttributes);
            
            expect(die.spaceAcross).toEqual(expect.any(Number));
        });
    });

    describe('attribute: spaceAround', () => {
        it('should fail validation if attribute is not defined', () => {
            delete dieAttributes.spaceAround;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            dieAttributes.spaceAround = String(chance.floating());
            const die = new DieModel(dieAttributes);
            
            expect(die.spaceAround).toEqual(expect.any(Number));
        });
    });

    describe('attribute: facestock', () => {
        it('should fail validation if attribute is not defined', () => {
            delete dieAttributes.facestock;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a string', () => {
            dieAttributes.facestock = chance.string();
            const die = new DieModel(dieAttributes);
            
            expect(die.facestock).toEqual(expect.any(String));
        });

        it('should trim whitespace', () => {
            const expectedFacestock = chance.string();
            dieAttributes.facestock = '  ' + expectedFacestock + ' ';
            const die = new DieModel(dieAttributes);
            
            expect(die.facestock).toEqual(expectedFacestock);
        });
    });

    describe('attribute: liner', () => {
        it('should fail validation if attribute is not defined', () => {
            delete dieAttributes.liner;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a string', () => {
            dieAttributes.liner = chance.floating();
            
            const die = new DieModel(dieAttributes);
            
            expect(die.liner).toEqual(expect.any(String));
        });

        it('should trim whitespace', () => {
            const expectedLiner = chance.string();
            dieAttributes.liner ='  ' + expectedLiner + '  ';
            
            const die = new DieModel(dieAttributes);
            
            expect(die.liner).toEqual(expectedLiner);
        });
    });

    describe('attribute: specialType', () => {
        it('should NOT fail validation if attribute is not defined', () => {
            delete dieAttributes.specialType;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).not.toBeDefined();
        });

        it('should be a string', () => {
            dieAttributes.specialType = chance.floating();
            
            const die = new DieModel(dieAttributes);
            
            expect(die.specialType).toEqual(expect.any(String));
        });
    });

    describe('attribute: serialNumber', () => {
        it('should fail validation if attribute is not defined', () => {
            delete dieAttributes.serialNumber;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a string', () => {
            dieAttributes.serialNumber = chance.floating();
            
            const die = new DieModel(dieAttributes);
            
            expect(die.serialNumber).toEqual(expect.any(String));
        });

        it('should trim whitespace', () => {
            const expectedSerialNumber = chance.string();
            dieAttributes.serialNumber =' ' + expectedSerialNumber + ' ';
            
            const die = new DieModel(dieAttributes);
            
            expect(die.serialNumber).toEqual(expectedSerialNumber);
        });
    });

    describe('attribute: status', () => {
        it('should fail validation if attribute is not defined', () => {
            delete dieAttributes.status;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a string', () => {
            dieAttributes.status = chance.floating();
            
            const die = new DieModel(dieAttributes);
            
            expect(die.status).toEqual(expect.any(String));
        });

        it('should fail if the string DOES NOT follow the correct enum value', () => {
            const invalidStatus = chance.word();
            dieAttributes.status = invalidStatus;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not fail validation if the string DOES follow the correct enum value', () => {
            const validStatus = chance.pickone(dieStatuses);
            dieAttributes.status = validStatus;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).not.toBeDefined();
        });

        it('should convert to upper case', () => {
            const validLowercaseStatus = chance.pickone(dieStatuses).toLowerCase();
            dieAttributes.status = validLowercaseStatus;
            const die = new DieModel(dieAttributes);
            
            expect(die.status).toEqual(validLowercaseStatus.toUpperCase());
        });
    });

    describe('attribute: quantity', () => {
        it('should default to 1 if attribute is not defined', () => {
            const expectedQuantity = 1;
            delete dieAttributes.quantity;

            const die = new DieModel(dieAttributes);
            
            expect(die.quantity).toEqual(expectedQuantity);
        });

        it('should fail if value is not an integer', () => {
            const invalidDieNumber = chance.floating();
            dieAttributes.quantity = invalidDieNumber;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail if value is negative', () => {
            const invalidDieNumber = chance.d100() * -1;
            dieAttributes.quantity = invalidDieNumber;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            const validDieNumber = String(chance.d100());
            dieAttributes.quantity = validDieNumber;
            const die = new DieModel(dieAttributes);

            expect(die.quantity).toEqual(expect.any(Number));
        });
    });

    describe('attribute: orderDate', () => {
        it('should not fail validation if attribute is not defined', () => {
            delete dieAttributes.orderDate;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).not.toBeDefined();
        });

        it('should be set to a date when die.status is set to "ORDERED"', () => {
            delete dieAttributes.orderDate;
            dieAttributes.status = ORDERED_DIE_STATUS;
            
            const die = new DieModel(dieAttributes);
            
            expect(die.orderDate).toBeDefined();
            expect(die.orderDate instanceof Date).toEqual(true);
        });

        it('should not update the date again if die.status is unchanged from "ORDERED"', async () => {
            delete dieAttributes.orderDate;
            dieAttributes.status = ORDERED_DIE_STATUS;

            const die = new DieModel(dieAttributes);
            const originalDate = die.orderDate;
            
            var delayInMilliseconds = 10;

            await delay(delayInMilliseconds);

            die.status = ORDERED_DIE_STATUS;
            expect(die.orderDate).toEqual(originalDate);
        });
    });

    describe('attribute: arrivalDate', () => {
        it('should not fail validation if attribute is not defined', () => {
            delete dieAttributes.arrivalDate;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();
            
            expect(error).not.toBeDefined();
        });

        it('should be set to a date when die.status is set to "IN-STOCK"', () => {
            delete dieAttributes.arrivalDate;
            dieAttributes.status = IN_STOCK_DIE_STATUS;

            const die = new DieModel(dieAttributes);

            expect(die.arrivalDate).toBeDefined();
            expect(die.arrivalDate instanceof Date).toEqual(true);
        });

        it('should not update the date again if die.status is unchanged from "IN-STOCK"', async () => {
            delete dieAttributes.arrivalDate;
            dieAttributes.status = IN_STOCK_DIE_STATUS;

            const die = new DieModel(dieAttributes);
            const originalDate = die.arrivalDate;
            
            var delayInMilliseconds = 10;

            await delay(delayInMilliseconds);

            die.status = IN_STOCK_DIE_STATUS;
            expect(die.arrivalDate).toEqual(originalDate);
        });
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
                const Die = new DieModel(dieAttributes);
                let savedDie = await Die.save({ validateBeforeSave: false });

                expect(savedDie.createdAt).toBeDefined();
                expect(savedDie.updatedAt).toBeDefined();
            });
        });
    });


});
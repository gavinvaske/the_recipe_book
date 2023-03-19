const chance = require('chance').Chance();
const TicketModel = require('../../application/models/ticket');
const WorkflowStepModel = require('../../application/models/WorkflowStep');
const databaseService = require('../../application/services/databaseService');
const {standardPriority, getAllPriorities} = require('../../application/enums/priorityEnum');
const departmentsEnum = require('../../application/enums/departmentsEnum');
const mongoose = require('mongoose');

const LENGTH_OF_ONE = 1;
const EMPTY_LENGTH = 0;

describe('validation', () => {
    let ticketAttributes;

    beforeEach(() => {
        ticketAttributes = {
            TicketNumber:  String(chance.integer({min: 0})),
            Ship_by_Date: chance.date({string: true}),
            OrderDate: chance.date({string: true}),
            CustPONum: chance.string(),
            Priority: chance.pickone(getAllPriorities()),
            BillZip: chance.string(),
            BillCity: chance.string(),
            BillAddr1: chance.string(),
            BillAddr2: chance.string(),
            BillLocation: chance.string(),
            ShipZip: chance.string(),
            ShipSt: chance.string(),
            ShipCity: chance.string(),
            ShipAddr1: chance.string(),
            ShipAddr2: chance.string(),
            ShipLocation: chance.string(),
            ShippingInstruc: chance.string(),
            ShipVia: chance.string(),
            ShipAttn_EmailAddress: chance.email(),
            BillState: chance.string(),
            destination: undefined,
            departmentNotes: {},
            Company: chance.string(),
            sentDate: chance.date({string: true}),
            followUpDate: chance.date({string: true}),
            departmentToHoldReason: {},
            ticketGroup: new mongoose.Types.ObjectId(),
            attempts: chance.integer({min: 0}),
            departmentToJobComment: {}
        };
    });

    it('should validate if all attributes are defined successfully', () => {
        const ticket = new TicketModel(ticketAttributes);
    
        const error = ticket.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: ticketNumber (aka TicketNumber)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.ticketNumber).toBeDefined();
        });

        it('should trim whitespace', () => {
            const ticketNumberWithoutWhitespace = chance.word();
            ticketAttributes.TicketNumber = ' ' + ticketNumberWithoutWhitespace + '   ';
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.ticketNumber).toBe(ticketNumberWithoutWhitespace);
        });

        it('should fail if ticketNumber does not contain ONLY digits', () => {
            const validTicketNumber = String(chance.integer({min: 0}));
            const invalidTicketNumber = validTicketNumber + chance.word();
            ticketAttributes.TicketNumber = invalidTicketNumber;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if attribute is missing', () => {
            delete ticketAttributes.TicketNumber;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type String', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.ticketNumber).toEqual(expect.any(String));
        });
    });

    describe('attribute: shipDate (aka Ship_by_Date)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shipDate).toBeDefined();
        });

        it('should fail if date is invalid', () => {
            const invalidDate = chance.word();
            ticketAttributes.Ship_by_Date = invalidDate;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if attribute is missing', () => {
            delete ticketAttributes.Ship_by_Date;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });
    });

    describe('attribute: orderDate (aka OrderDate)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.orderDate).toBeDefined();
        });

        it('should fail if date is invalid', () => {
            const invalidDate = chance.word();
            ticketAttributes.OrderDate = invalidDate;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.OrderDate;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: estimatedTotalMaterialLength', () => {
        beforeEach(() => {
            const products = [ 
                { totalFeet: chance.integer({min: 1}) },
                { totalFeet: chance.integer({min: 1}) }
            ];
            ticketAttributes.products = products;
            ticketAttributes.attempts = 0;
        });

        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.estimatedTotalMaterialLength).toBeDefined();
        });

        it('should fail if attribute is less than zero', () => {
            ticketAttributes.products = [];
            const negativeMaterialLength = -1;
            ticketAttributes.estimatedTotalMaterialLength = negativeMaterialLength;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error['errors']['estimatedTotalMaterialLength']).not.toBe(undefined);
        });

        it('should fail validation if attribute is missing', () => {
            delete ticketAttributes.estimatedTotalMaterialLength;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.estimatedTotalMaterialLength).toEqual(expect.any(Number));
        });

        it('should override the default value when estimatedTotalMaterialLength is set explicitly', () => {
            const expectedMaterialLength = chance.integer({min: 1});
            ticketAttributes.estimatedTotalMaterialLength = expectedMaterialLength;
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.estimatedTotalMaterialLength).toEqual(expectedMaterialLength);
        });

        it('should compute the attribute correctly by summing each product[n].totalFeet', async () => {
            const ticket = new TicketModel(ticketAttributes);
            const expectedMaterialLength = 
                ticketAttributes.products[0].totalFeet + 
                ticketAttributes.products[1].totalFeet;

            expect(ticket.estimatedTotalMaterialLength).toEqual(expectedMaterialLength);
        });

        it('should equal zero when no products exist', async () => {
            ticketAttributes.products = [];
            const ticket = new TicketModel(ticketAttributes);
            const expectedMaterialLength = 0;

            expect(ticket.estimatedTotalMaterialLength).toEqual(expectedMaterialLength);
        });
    });

    describe('attribute: poNumber (aka CustPONum)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.poNumber).toBeDefined();
        });

        it('should NOT fail validation if attribute is missing', () => {
            delete ticketAttributes.CustPONum;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should be of type String', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.poNumber).toEqual(expect.any(String));
        });
    });

    describe('attribute: priority (aka Priority)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.priority).toBeDefined();
        });

        it('should NOT fail validation if attribute is missing', () => {
            delete ticketAttributes.Priority;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should default to "Standard" priority if attribute is missing', () => {
            delete ticketAttributes.Priority;
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.priority).toBe(standardPriority);
        });

        it('should fail validation if attribute is not one of the accepted values', () => {
            ticketAttributes.Priority = chance.string();
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type String', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.priority).toEqual(expect.any(String));
        });
    });

    describe('attribute: billingZipCode (aka BillZip)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.billingZipCode).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.BillZip;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: billingCity (aka BillCity)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.billingCity).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.BillCity;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: billingAddress (aka BillAddr1)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.billingAddress).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.BillAddr1;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: billingUnitNumber (aka BillAddr2)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.billingUnitNumber).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.BillAddr2;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: billingLocationName (aka BillLocation)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.billingLocationName).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.BillLocation;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shipZipCode (aka ShipZip)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shipZipCode).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipZip;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shipState (aka ShippingInstruc)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shipState).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShippingInstruc;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shipCity (aka ShipCity)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shipCity).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipCity;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shippingAddress (aka ShipAddr1)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shippingAddress).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipAddr1;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shippingUnitNumber (aka ShipAddr2)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shippingUnitNumber).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipAddr2;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shippingLocationName (aka ShipLocation)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shippingLocationName).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipLocation;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shippingInstructions (aka ShippingInstruc)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shippingInstructions).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShippingInstruc;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shippingMethod (aka ShipVia)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shippingMethod).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipVia;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: shippingEmailAddress (aka ShipAttn_EmailAddress)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.shippingEmailAddress).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.ShipAttn_EmailAddress;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should fail validation if attribute is defined but not a valid email address', () => {
            ticketAttributes.ShipAttn_EmailAddress = chance.string();
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: billingState (aka BillState)', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.billingState).toBeDefined();
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.BillState;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: totalLabelQty', () => {
        beforeEach(() => {
            ticketAttributes.products = [{labelQty: 99}, {labelQty: 13}];
        });

        it('should be a number', async () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalLabelQty).toEqual(expect.any(Number));
        });

        it('should compute the attribute correctly when products exist', async () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalLabelQty).toEqual(ticketAttributes.products[0].labelQty + ticketAttributes.products[1].labelQty);
        });

        it('should compute the attribute correctly when NO products exist', async () => {
            delete ticketAttributes.products;
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalLabelQty).toEqual(0); // eslint-disable-line no-magic-numbers
        });
    });

    describe('attribute: totalWindingRolls', () => {
        beforeEach(() => {
            ticketAttributes.products = [{totalWindingRolls: chance.integer({min: 1})}, {totalWindingRolls: chance.integer({min: 1})}];
        });
        it('should be a number', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalWindingRolls).toEqual(expect.any(Number));
        });

        it('should compute the attribute correctly', async () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalWindingRolls).toEqual(ticketAttributes.products[0].totalWindingRolls + ticketAttributes.products[1].totalWindingRolls);
        });
    });

    describe('attribute: totalMaterialLength', () => {
        const inchesPerFoot = 12;

        beforeEach(() => {
            const products = [
                {
                    totalFeet: chance.integer({min: 1}),
                    measureAround: chance.d12(),
                    labelsAround: chance.d12()
                }
            ];
            ticketAttributes.products = products;
            ticketAttributes.attempts = 0;
        });

        it('should be a number', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalMaterialLength).toEqual(expect.any(Number));
        });

        it('should pass validation if ticket.totalFramesRan is not defined yet', async () => {
            delete ticketAttributes.totalFramesRan;

            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error['errors']['totalMaterialLength']).toBe(undefined);
        });

        it('should fail validation if ticket.totalFramesRan is defined and ticket.totalMaterialLength is not computed correctly', async () => {
            ticketAttributes.totalFramesRan = chance.d100();
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error['errors']['totalMaterialLength']).not.toBe(undefined);
        });

        it('should pass validation when the attribute is computed correctly', async () => {
            ticketAttributes.totalFramesRan = chance.d100();
            ticketAttributes.attempts = chance.d100();

            const totalMaterialLength = computeTotalMaterialLength(ticketAttributes);
            ticketAttributes.totalMaterialLength = totalMaterialLength;

            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error['errors']['totalMaterialLength']).toBe(undefined);
            expect(ticket.totalMaterialLength).toBe(totalMaterialLength);
        });

        it('should pass validation when ticket.attempts is not defined', async () => {
            ticketAttributes.totalFramesRan = chance.d100();
            delete ticketAttributes.attempts;
            const totalMaterialLength = computeTotalMaterialLength(ticketAttributes);
            ticketAttributes.totalMaterialLength = totalMaterialLength;

            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error['errors']['totalMaterialLength']).toBe(undefined);
            expect(ticket.totalMaterialLength).toBe(totalMaterialLength);
        });

        it('should fail validation if material length is less than zero', async () => {
            const negativeLength = -1;
            ticketAttributes.products = [];
            ticketAttributes.totalMaterialLength = negativeLength;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error['errors']['totalMaterialLength']).not.toBe(undefined);
        });

        it('should be set to the value of ticket.estimatedTotalMaterialLength by default', async () => {
            const expectedMaterialLength = chance.integer({min: 1});
            delete ticketAttributes.totalMaterialLength;
            ticketAttributes.estimatedTotalMaterialLength = expectedMaterialLength;

            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalMaterialLength).toEqual(expectedMaterialLength);
        });

        it('should pass validation if attribute is is less than 1/100 foot off the real value', async () => {
            ticketAttributes.totalFramesRan = chance.d12();
            delete ticketAttributes.attempts;
            const tinyErrorThatShouldNotCauseValidationError = 0.009;

            const totalMaterialLength = computeTotalMaterialLength(ticketAttributes);
            ticketAttributes.totalMaterialLength = totalMaterialLength + tinyErrorThatShouldNotCauseValidationError;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error['errors']['totalMaterialLength']).toBe(undefined);
        });

        it('should fail validation if attribute is greater than 1/100 foot off the real value', async () => {
            ticketAttributes.totalFramesRan = chance.d12();
            delete ticketAttributes.attempts;
            const feetPerAttempt = 50;
            const frameSize = ticketAttributes.products[0].measureAround * ticketAttributes.products[0].labelsAround;
            const errorThatShouldCauseValidationFailure = 0.011;

            const totalMaterialLength = ((ticketAttributes.totalFramesRan * frameSize) / inchesPerFoot) + (0 * feetPerAttempt);
            ticketAttributes.totalMaterialLength = totalMaterialLength + errorThatShouldCauseValidationFailure;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error['errors']['totalMaterialLength']).not.toBe(undefined);
        });
    });

    describe('attribute: totalFramesRan', () => {
        it('should be set correctly', () => {
            const expectedTotalFramesRan = chance.d100();
            ticketAttributes.totalFramesRan = expectedTotalFramesRan;

            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalFramesRan).toEqual(expectedTotalFramesRan);
        });

        it('should NOT fail validation if attribute is not defined', () => {
            delete ticketAttributes.totalFramesRan;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeUndefined();
        });

        it('should fail validation if attribute is less than 0', () => {
            const negativeNumber = -1;
            ticketAttributes.totalFramesRan = negativeNumber;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type number', () => {
            ticketAttributes.totalFramesRan = chance.d12();
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.totalFramesRan).toEqual(expect.any(Number));
        });
    });

    describe('attribute: destination', () => {
        it('should pass validation if attribute is not defined', () => {
            delete ticketAttributes.destination;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should fail validation if attribute is not the correct type', () => {
            ticketAttributes.destination = chance.word();
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be a mongoose object with an _id attribute', () => {
            const randomDepartment = chance.pickone(departmentsEnum.getAllDepartmentsWithDepartmentStatuses());
            ticketAttributes.destination = {
                department: randomDepartment,
                departmentStatus: chance.pickone(departmentsEnum.departmentToStatusesMappingForTicketObjects[randomDepartment])
            };

            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.destination._id).not.toBe(undefined);
        });
    });

    describe('attribute: departmentNotes', () => {
        let departmentNotes;

        beforeEach(() => {
            departmentNotes = {
                orderPrep: chance.string(),
                artPrep: chance.string(),
                prePrinting: chance.string(),
                printing: chance.string(),
                cutting: chance.string(),
                winding: chance.string(),
                packaging: chance.string(),
                shipping: chance.string(),
                billing: chance.string(),
            };
        });

        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.departmentNotes).toBeDefined();
        });

        it('should default to an object when attribute is not defined', () => {
            delete ticketAttributes.departmentNotes;
            const ticket = new TicketModel(ticketAttributes);

            expect(typeof ticket.departmentNotes).toEqual('object');
        });

        it('should pass validation if attribute is missing', () => {
            delete ticketAttributes.departmentNotes;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should store all notes for every department', () => {
            ticketAttributes.departmentNotes = departmentNotes;

            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.departmentNotes.orderPrep).toEqual(departmentNotes.orderPrep);
            expect(ticket.departmentNotes.artPrep).toEqual(departmentNotes.artPrep);
            expect(ticket.departmentNotes.prePrinting).toEqual(departmentNotes.prePrinting);
            expect(ticket.departmentNotes.printing).toEqual(departmentNotes.printing);
            expect(ticket.departmentNotes.cutting).toEqual(departmentNotes.cutting);
            expect(ticket.departmentNotes.winding).toEqual(departmentNotes.winding);
            expect(ticket.departmentNotes.packaging).toEqual(departmentNotes.packaging);
            expect(ticket.departmentNotes.shipping).toEqual(departmentNotes.shipping);
            expect(ticket.departmentNotes.billing).toEqual(departmentNotes.billing);
        });

        it('should fail validation if unknown key is used', () => {
            const unknownKey = chance.word();
            ticketAttributes.departmentNotes = {
                [unknownKey]: chance.string()
            };
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });
    });

    describe('attribute: primaryMaterial', () => {

        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        it('should contain attribute', () => {
            ticketAttributes.primaryMaterial = chance.word();
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.primaryMaterial).toBeDefined();
        });

        it('should not fail validation if blank', () => {
            ticketAttributes.primaryMaterial = '';
            const ticket = new TicketModel(ticketAttributes);
    
            const error = ticket.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should fail validation if primaryMaterial is not an existing material ID', async () => {
            ticketAttributes.primaryMaterial = chance.word();
            const ticket = new TicketModel(ticketAttributes);
    
            const error = ticket.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should pass validation if primaryMaterial is not an existing material ID', async () => {
            ticketAttributes.primaryMaterial = chance.word();
            const ticket = new TicketModel(ticketAttributes);
    
            const error = ticket.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should default the ticket.primaryMaterial to product[0].primaryMaterial', async () => {
            delete ticketAttributes.primaryMaterial;

            ticketAttributes.products = [
                {primaryMaterial: chance.word()}
            ];
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.primaryMaterial).toBe(ticketAttributes.products[0].primaryMaterial);
        });

        it('should use the ticket.primaryMaterial to override all ticket.products[n].primaryMaterial before saving', async () => {
            const materialA = chance.word();
            const materialB = chance.word();

            ticketAttributes.primaryMaterial = materialA;

            ticketAttributes.products = [
                {primaryMaterial: materialB},
                {primaryMaterial: materialB},
                {primaryMaterial: undefined},
            ];
            const ticket = new TicketModel(ticketAttributes);

            const savedTicket = await ticket.save({validateBeforeSave: false});

            expect(savedTicket.products[0].primaryMaterial).toBe(savedTicket.primaryMaterial);
            expect(savedTicket.products[1].primaryMaterial).toBe(savedTicket.primaryMaterial);
            expect(savedTicket.products[2].primaryMaterial).toBe(savedTicket.primaryMaterial);
        });
    });

    describe('attribute: Company', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.Company).toBeDefined();
        });

        it('should be of type String', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.Company).toEqual(expect.any(String));
        });

        it('should fail validation if attribute is missing', () => {
            delete ticketAttributes.Company;
            const ticket = new TicketModel(ticketAttributes);
    
            const error = ticket.validateSync();
    
            expect(error).toBeDefined();
        });
    });

    describe('attribute: sentDate', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.sentDate).toBeDefined();
        });

        it('should fail if date is invalid', () => {
            const invalidDate = chance.word();
            ticketAttributes.sentDate = invalidDate;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should NOT fail validation if attribute is missing', () => {
            delete ticketAttributes.sentDate;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: followUpDate', () => {
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.followUpDate).toBeDefined();
        });

        it('should fail if date is invalid', () => {
            const invalidDate = chance.word();
            ticketAttributes.followUpDate = invalidDate;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should NOT fail validation if attribute is missing', () => {
            delete ticketAttributes.followUpDate;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });
    });

    describe('attribute: departmentToHoldReason', () => {
        let nonImportantString;
        beforeEach(() => {
            nonImportantString = chance.word();
        });
        it('should contain attribute', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.departmentToHoldReason).toBeDefined();
        });

        it('should default to an empty object if attribute is not defined', () => {
            delete ticketAttributes.departmentToHoldReason;
            const ticket = new TicketModel(ticketAttributes);
            const emptyObject = {};

            expect(ticket.departmentToHoldReason.toJSON()).toStrictEqual(emptyObject);
        });

        it('should pass validation is attribute is not defined', () => {
            delete ticketAttributes.departmentToHoldReason;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should pass validation is attribute is an empty object', () => {
            ticketAttributes.departmentToHoldReason = {};
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should convert the value of each map record to a string', () => {
            const aNumber = chance.integer();
            ticketAttributes.departmentToHoldReason[nonImportantString] = aNumber;
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.departmentToHoldReason.get(nonImportantString)).toBe(`${aNumber}`);
        });

        it('should fail validation if a non-valid department is used as a key', () => {
            const invalidDepartment = chance.string();
            ticketAttributes.departmentToHoldReason[invalidDepartment] = nonImportantString;
            const ticket = new TicketModel(ticketAttributes);
            
            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should pass validation if only valid departments are used as keys', () => {
            const firstValidDepartment = departmentsEnum.getAllDepartments()[0];
            const secondValidDepartment = departmentsEnum.getAllDepartments()[1];
            ticketAttributes.departmentToHoldReason = {
                [firstValidDepartment]: chance.string(),
                [secondValidDepartment]: chance.string()
            };
            const ticket = new TicketModel(ticketAttributes);
            
            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should fail validation if a single invalid department is used as a key', () => {
            const firstValidDepartment = departmentsEnum.getAllDepartments()[0];
            const secondValidDepartment = departmentsEnum.getAllDepartments()[1];
            const firstInvalidDepartment = chance.string();
            ticketAttributes.departmentToHoldReason = {
                [firstValidDepartment]: nonImportantString,
                [secondValidDepartment]: nonImportantString,
                [firstInvalidDepartment]: nonImportantString
            };
            const ticket = new TicketModel(ticketAttributes);
            
            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });
    });

    describe('attribute: ticketGroup', () => {
        it('should pass validation if attribute is not defined', () => {
            delete ticketAttributes.ticketGroup;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should pass validation when attribute is a valid mongoose objectId', () => {
            ticketAttributes.ticketGroup = new mongoose.Types.ObjectId();
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();
            const isAttributeAValidMongooseObjectId = mongoose.Types.ObjectId.isValid(ticket.ticketGroup);

            expect(error).toBe(undefined);
            expect(isAttributeAValidMongooseObjectId).toBe(true);
        });   

        it('should fail validation if attribute is not a valid mongoose objectId', () => {
            const invalidTicketGroup = 123;
            ticketAttributes.ticketGroup = invalidTicketGroup;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });
    });

    describe('attribute: attempts', () => {
        beforeEach(() => {
            ticketAttributes.attempts = chance.integer({min: 0});
        });

        it('should default to zero if not defined', () => {
            delete ticketAttributes.attempts;

            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.attempts).toBe(0);
        });

        it('should throw an error if value is a negative number', () => {
            ticketAttributes.attempts = chance.integer({max: -1});
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.attempts).toEqual(expect.any(Number));
        });
    });

    describe('attribute: departmentToJobComment', () => {
        it('should NOT fail validation if attribute is not defined', () => {
            delete ticketAttributes.departmentToJobComment;
            const ticket = new TicketModel(ticketAttributes);

            const error = ticket.validateSync();

            expect(error).toBe(undefined);
        });

        it('should default to an empty object when not defined', () => {
            delete ticketAttributes.departmentToJobComment;
            const ticket = new TicketModel(ticketAttributes);

            expect(typeof ticket.departmentToJobComment).toEqual('object');
        });

        it('should store the note on the correct department', () => {
            const department = chance.pickone(departmentsEnum.getAllDepartmentsWithDepartmentStatuses());
            const jobComment = chance.string();
            ticketAttributes.departmentToJobComment[department] = jobComment;
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.departmentToJobComment[department]).toEqual(jobComment);
        });
    });

    describe('attribute: numberOfProofsThatHaveNotBeenUploadedYet', () => {
        it('should be calculated on its own without the need for a user to define it', () => {
            delete ticketAttributes.numberOfProofsThatHaveNotBeenUploadedYet;
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.numberOfProofsThatHaveNotBeenUploadedYet).toEqual(expect.any(Number));
        });

        it('should be equal to the number of ticket.products whose proof attribute is not defined', () => {
            const productsWithoutProofs = [
                {proof: undefined},
                {proof: null}
            ];
            const productsWithProofs = [
                {
                    proof: {
                        url: chance.string(),
                        fileName: chance.string()
                    },
                }
            ];
            ticketAttributes.products = [...productsWithoutProofs, ...productsWithProofs];
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.numberOfProofsThatHaveNotBeenUploadedYet).toEqual(productsWithoutProofs.length);
        });

        it('should consider a proof missing if the ticket.products[n].proof.url is not defined', () => {
            const productsWithoutProofs = [
                {proof: undefined},
                {proof: null}
            ];
            const productsWithAProofAttributeButAnUndefinedUrl = [
                {
                    proof: {
                        url: undefined,
                        fileName: chance.string()
                    },
                }
            ];
            ticketAttributes.products = [...productsWithoutProofs, ...productsWithAProofAttributeButAnUndefinedUrl];
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.numberOfProofsThatHaveNotBeenUploadedYet).toEqual(productsWithoutProofs.length + productsWithAProofAttributeButAnUndefinedUrl.length);
        });

        it('should default to 0 if no products exist', () => {
            const numberOfProductsWhoseProofAttributeIsUndefined = 0;
            delete ticketAttributes.products;
            const ticket = new TicketModel(ticketAttributes);

            expect(ticket.numberOfProofsThatHaveNotBeenUploadedYet).toEqual(numberOfProductsWhoseProofAttributeIsUndefined);
        });
    });

    describe('mongoose post hooks test suite', () => {
        beforeEach(async () => {
            jest.resetAllMocks();
            await databaseService.connectToTestMongoDatabase();
            await databaseService.clearDatabase();
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        describe('mongoose ticketSchema.post("save")', () => {
            it('should not allow two objects with duplicate ticketNumbers to be saved to the database', async () => {
                delete ticketAttributes.destination;
                ticketAttributes.ticketNumber = '123';
                const ticket = new TicketModel(ticketAttributes);
                const duplicateTicket = new TicketModel(ticketAttributes);
                let errorMessage = '';
                const numberOfUniqueTickets = 1;

                try {
                    await ticket.save();
                    await duplicateTicket.save();
                } catch (error) {
                    errorMessage = error.message;
                }

                const ticketsInDatabase = await TicketModel.find({});

                expect(ticketsInDatabase.length).toEqual(numberOfUniqueTickets);
                expect(errorMessage).toBe(`Cannot create this ticket whose ticket number is "${duplicateTicket.ticketNumber}" because it is a duplicate of an existing ticket already saved to the database!`);
            });
        });
    });

    describe('mongoose pre hooks test suite', () => {
        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        describe('mongoose ticketSchema.pre("findOneAndUpdate")', () => {
        
            it('should add item to workflow database when one ticket is updated', async () => {
                const ticket = new TicketModel(ticketAttributes);
                const randomDepartment = chance.pickone(departmentsEnum.getAllDepartmentsWithDepartmentStatuses());
                const newTicketDestination = {
                    department: randomDepartment,
                    departmentStatus: chance.pickone(departmentsEnum.departmentToStatusesMappingForTicketObjects[randomDepartment])
                };
    
                let savedTicket = await ticket.save({validateBeforeSave: false});
                await TicketModel.findOneAndUpdate({_id: savedTicket._id}, {$set: {destination: newTicketDestination}}, {runValidators: true}).exec();
    
                const allWorkflowStepsInDatabase = await WorkflowStepModel.find({});
                
                expect(allWorkflowStepsInDatabase.length).toBe(LENGTH_OF_ONE);
            });
    
            it('should add item to workflow database with the correct attributes when one ticket is updated', async () => {
                const ticket = new TicketModel(ticketAttributes);
                const randomDepartment = chance.pickone(departmentsEnum.getAllDepartmentsWithDepartmentStatuses());
                const newTicketDestination = {
                    department: randomDepartment,
                    departmentStatus: chance.pickone(departmentsEnum.departmentToStatusesMappingForTicketObjects[randomDepartment])
                };
                let savedTicket = await ticket.save({validateBeforeSave: false});
                await TicketModel.findOneAndUpdate({_id: savedTicket._id}, {$set: {destination: newTicketDestination}}, {runValidators: true}).exec();
    
                const allWorkflowStepsInDatabase = await WorkflowStepModel.find({});
                const workflowStep = allWorkflowStepsInDatabase[0];
                
                expect(allWorkflowStepsInDatabase.length).toBe(LENGTH_OF_ONE);
                expect(String(workflowStep.ticketId)).toBe(String(savedTicket._id));
                expect(workflowStep.destination.department).toBe(newTicketDestination.department);
                expect(workflowStep.destination.departmentStatus).toBe(newTicketDestination.departmentStatus);
                expect(workflowStep.destination.createdAt).toBeDefined();
                expect(workflowStep.destination.updatedAt).toBeDefined();
                expect(workflowStep.createdAt).toBeDefined();
                expect(workflowStep.updatedAt).toBeDefined();
            });
    
            it('should NOT add item to workflow database when one ticket is updated but the destination attribute was NOT updated', async () => {
                const ticket = new TicketModel(ticketAttributes);
                let savedTicket = await ticket.save({validateBeforeSave: false});
                const ticketAttributesOtherThanDestinationToUpdate = {};
                await TicketModel.findOneAndUpdate({_id: savedTicket._id}, {$set: ticketAttributesOtherThanDestinationToUpdate}, {runValidators: true}).exec();
    
                const allWorkflowStepsInDatabase = await WorkflowStepModel.find({});
                
                expect(allWorkflowStepsInDatabase.length).toBe(EMPTY_LENGTH);
            });
    
            it('should add a new item to workflow database N times where N is the number of times a tickets destination attribute was updated', async () => {
                const ticket = new TicketModel(ticketAttributes);
                const numberOfUpdatesToTicketDestination = chance.integer({min: 10, max: 100});
                const departments = departmentsEnum.getAllDepartmentsWithDepartmentStatuses();
                let savedTicket = await ticket.save({validateBeforeSave: false});
    
                for (let i=0; i < numberOfUpdatesToTicketDestination; i++) {
                    const department = chance.pickone(departments);
                    const departmentStatus = chance.pickone(departmentsEnum.departmentToStatusesMappingForTicketObjects[department]);
    
                    newTicketDestination = {
                        department,
                        departmentStatus
                    };
    
                    await TicketModel.findOneAndUpdate({_id: savedTicket._id}, {$set: {destination: newTicketDestination}}, {runValidators: true}).exec();
                }
    
                const allWorkflowStepsInDatabase = await WorkflowStepModel.find({});
                
                expect(allWorkflowStepsInDatabase.length).toBe(numberOfUpdatesToTicketDestination);
            });
        });

        describe('mongoose ticketSchema.pre("updateOne")', () => {
        
            it('should add item to workflow database when one ticket is updated', async () => {
                const ticket = new TicketModel(ticketAttributes);
                const randomDepartment = chance.pickone(departmentsEnum.getAllDepartmentsWithDepartmentStatuses());
                const newTicketDestination = {
                    department: randomDepartment,
                    departmentStatus: chance.pickone(departmentsEnum.departmentToStatusesMappingForTicketObjects[randomDepartment])
                };
                const savedTicket = await ticket.save({validateBeforeSave: false});

                await TicketModel.updateOne({ _id: savedTicket._id }, { $set: { destination: newTicketDestination } });
    
                const allWorkflowStepsInDatabase = await WorkflowStepModel.find({});
                expect(allWorkflowStepsInDatabase.length).toBe(LENGTH_OF_ONE);
            });
    
            it('should add item to workflow database with the correct attributes when one ticket is updated', async () => {
                const ticket = new TicketModel(ticketAttributes);
                const randomDepartment = chance.pickone(departmentsEnum.getAllDepartmentsWithDepartmentStatuses());
                const newTicketDestination = {
                    department: randomDepartment,
                    departmentStatus: chance.pickone(departmentsEnum.departmentToStatusesMappingForTicketObjects[randomDepartment])
                };
                let savedTicket = await ticket.save({validateBeforeSave: false});

                await TicketModel.updateOne({_id: savedTicket._id}, {$set: {destination: newTicketDestination}}, {runValidators: true}).exec();
    
                const allWorkflowStepsInDatabase = await WorkflowStepModel.find({});
                const workflowStep = allWorkflowStepsInDatabase[0];
                
                expect(allWorkflowStepsInDatabase.length).toBe(LENGTH_OF_ONE);
                expect(String(workflowStep.ticketId)).toBe(String(savedTicket._id));
                expect(workflowStep.destination.department).toBe(newTicketDestination.department);
                expect(workflowStep.destination.departmentStatus).toBe(newTicketDestination.departmentStatus);
                expect(workflowStep.destination.createdAt).toBeDefined();
                expect(workflowStep.destination.updatedAt).toBeDefined();
                expect(workflowStep.createdAt).toBeDefined();
                expect(workflowStep.updatedAt).toBeDefined();
            });
    
            it('should NOT add item to workflow database when one ticket is updated but the destination attribute was NOT updated', async () => {
                const ticket = new TicketModel(ticketAttributes);
                let savedTicket = await ticket.save({validateBeforeSave: false});
                const ticketAttributesOtherThanDestinationToUpdate = {};

                await TicketModel.updateOne({_id: savedTicket._id}, {$set: ticketAttributesOtherThanDestinationToUpdate}, {runValidators: true}).exec();
    
                const allWorkflowStepsInDatabase = await WorkflowStepModel.find({});
                expect(allWorkflowStepsInDatabase.length).toBe(EMPTY_LENGTH);
            });
    
            it('should add a new item to workflow database N times where N is the number of times a tickets destination attribute was updated', async () => {
                const ticket = new TicketModel(ticketAttributes);
                const numberOfUpdatesToTicketDestination = chance.integer({min: 10, max: 100});
                const departments = departmentsEnum.getAllDepartmentsWithDepartmentStatuses();
                let savedTicket = await ticket.save({validateBeforeSave: false});
    
                for (let i=0; i < numberOfUpdatesToTicketDestination; i++) {
                    const department = chance.pickone(departments);
                    const departmentStatus = chance.pickone(departmentsEnum.departmentToStatusesMappingForTicketObjects[department]);
    
                    newTicketDestination = {
                        department,
                        departmentStatus
                    };
    
                    await TicketModel.updateOne({_id: savedTicket._id}, {$set: {destination: newTicketDestination}}, {runValidators: true}).exec();
                }
    
                const allWorkflowStepsInDatabase = await WorkflowStepModel.find({});
                
                expect(allWorkflowStepsInDatabase.length).toBe(numberOfUpdatesToTicketDestination);
            });
        });
    });
});

function computeTotalMaterialLength(ticketAttributes) {
    let {totalFramesRan, attempts} = ticketAttributes;

    if (!attempts) {
        attempts = 0;
    }

    const frameSize = ticketAttributes.products[0].measureAround * ticketAttributes.products[0].labelsAround; 
    const inchesPerFoot = 12;
    const feetPerAttempt = 50;

    return ((frameSize * totalFramesRan) / inchesPerFoot) + (attempts * feetPerAttempt); 
}
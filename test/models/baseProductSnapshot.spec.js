const chance = require('chance').Chance();
const BaseProductSnapshotModel = require('../../application/models/baseProductSnapshot');
const databaseService = require('../../application/services/databaseService');
const testDataGenerator = require('../testDataGenerator');
const { MAX_FRAME_LENGTH_INCHES } = require('../../application/enums/constantsEnum');

const MaterialModel = require('../../application/models/material');
const FinishModel = require('../../application/models/finish');
const CustomerModel = require('../../application/models/customer');
const UserModel = require('../../application/models/user');

const roundDownToNearestEvenNumber = (value) => Math.floor(value / 2) * 2;

describe('BaseProductSnapshot', () => {
    let baseProductSnapshotAttributes;

    beforeEach(() => {
        baseProductSnapshotAttributes = {
            die: testDataGenerator.mockData.Die(),
            primaryMaterial: testDataGenerator.mockData.Material(),
            secondaryMaterial: testDataGenerator.mockData.Material(),
            finish: testDataGenerator.mockData.Finish(),
            customer: testDataGenerator.mockData.Customer(),
            author: testDataGenerator.mockData.User(),
            ...testDataGenerator.mockData.SharedBaseProductAttributes()
        };
    });

    it('should pass validation if all required attributes are defined', () => {
        const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

        const error = baseProductSnapshot.validateSync();

        expect(error).toBeUndefined();
    });

    it('should throw an error if an unknown attribute is defined', () => {
        const unknownAttribute = chance.string();
        baseProductSnapshotAttributes[unknownAttribute] = chance.string();

        expect(() => new BaseProductSnapshotModel(baseProductSnapshotAttributes)).toThrow();
    });

    describe('attribute: die', () => {
        it('should fail if attribute is not defined', () => {
            delete baseProductSnapshotAttributes.die;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            const error = baseProductSnapshot.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a valid dieModel', async () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            const error = baseProductSnapshot.validateSync();

            console.log(error);

            expect(error).toBeUndefined();
        });
    });

    describe('attribute: primaryMaterial', () => {
        it('should fail if attribute is not defined', () => {
            delete baseProductSnapshotAttributes.primaryMaterial;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            const error = baseProductSnapshot.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a valid materialModel', async () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            await expect(MaterialModel.validate(baseProductSnapshot.primaryMaterial))
                .resolves.not.toThrow();
        });
    });

    describe('attribute: secondaryMaterial', () => {
        it('should fail if attribute is not defined', () => {
            delete baseProductSnapshotAttributes.secondaryMaterial;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            const error = baseProductSnapshot.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a valid materialModel', async () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            await expect(MaterialModel.validate(baseProductSnapshot.secondaryMaterial))
                .resolves.not.toThrow();
        });
    });

    describe('attribute: finish', () => {
        it('should fail if attribute is not defined', () => {
            delete baseProductSnapshotAttributes.finish;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            const error = baseProductSnapshot.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a valid finishModel', async () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            await expect(FinishModel.validate(baseProductSnapshot.finish))
                .resolves.not.toThrow();
        });
    });

    describe('attribute: customer', () => {
        it('should fail if attribute is not defined', () => {
            delete baseProductSnapshotAttributes.customer;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            const error = baseProductSnapshot.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a valid customerModel', async () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            await expect(CustomerModel.validate(baseProductSnapshot.customer))
                .resolves.not.toThrow();
        });
    });

    describe('attribute: author', () => {
        it('should fail if attribute is not defined', () => {
            delete baseProductSnapshotAttributes.author;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            const error = baseProductSnapshot.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a valid userModel', async () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            await expect(UserModel.validate(baseProductSnapshot.author))
                .resolves.not.toThrow();
        });
    });

    describe('attribute: frameNumberAcross', () => {
        it('should automatically calculate the attribute when the value is not defined', () => {
            delete baseProductSnapshotAttributes.frameNumberAcross;
            const { die, primaryMaterial } = baseProductSnapshotAttributes;
            const expectedFrameNumberAcross = Math.floor((die.sizeAcross + die.spaceAcross) / primaryMaterial.width);
            
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            expect(baseProductSnapshot.frameNumberAcross).toBeDefined();
            expect(baseProductSnapshot.frameNumberAcross).toEqual(expectedFrameNumberAcross);
        });

        it('should override the default value when attribute is set explicitly', () => {
            const expectedFrameNumberAcross = chance.d100();
            baseProductSnapshotAttributes.frameNumberAcross = expectedFrameNumberAcross;

            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            expect(baseProductSnapshot.frameNumberAcross).toBeDefined();
            expect(baseProductSnapshot.frameNumberAcross).toEqual(expectedFrameNumberAcross);
        });

        it('should be a number', () => {
            const expectedFrameNumberAcross = chance.d100();
            baseProductSnapshotAttributes.frameNumberAcross = `${expectedFrameNumberAcross}`;
            
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            expect(baseProductSnapshot.frameNumberAcross).toEqual(expect.any(Number));
            expect(baseProductSnapshot.frameNumberAcross).toEqual(expectedFrameNumberAcross);
        });

        it('should be required', () => {
            baseProductSnapshotAttributes.frameNumberAcross = null;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const error = baseProductSnapshot.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('frameNumberAround', () => {
        it('should be computed correctly when die.sizeAround > 1', () => {
            const numberGreaterThanOne = chance.pickone([1.01, 2, 1000]); // eslint-disable-line no-magic-numbers
            baseProductSnapshotAttributes.die.sizeAround = numberGreaterThanOne;
            const { die } = baseProductSnapshotAttributes;
            const expectedFrameNumberAround = Math.floor(MAX_FRAME_LENGTH_INCHES / (die.sizeAround + die.spaceAround));
            
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            expect(baseProductSnapshot.frameNumberAround).toBeDefined();
            expect(baseProductSnapshot.frameNumberAround).toEqual(expectedFrameNumberAround);
        });

        it('should round the value down to the nearest whole even number if die.sizeAround <= 1', () => {
            const numberLessThanOrEqualToOne = chance.pickone([1, 0.01]); // eslint-disable-line no-magic-numbers
            baseProductSnapshotAttributes.die.sizeAround = numberLessThanOrEqualToOne;
            const { die } = baseProductSnapshotAttributes;
            const frameNumberAroundBeforeRounding = Math.floor(MAX_FRAME_LENGTH_INCHES / (die.sizeAround + die.spaceAround));
            const expectedFrameNumberAround = roundDownToNearestEvenNumber(frameNumberAroundBeforeRounding);

            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            expect(baseProductSnapshot.frameNumberAround).toBeDefined();
            expect(baseProductSnapshot.frameNumberAround).toEqual(expectedFrameNumberAround);
        });

        it('should override the default value when attribute is set explicitly', () => {
            const expectedFrameNumberAround = chance.d100();
            baseProductSnapshotAttributes.frameNumberAround = expectedFrameNumberAround;
            
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            expect(baseProductSnapshot.frameNumberAround).toBeDefined();
            expect(baseProductSnapshot.frameNumberAround).toEqual(expectedFrameNumberAround);
        });

        it('should be a number', () => {
            const expectedFrameNumberAround = chance.d100();
            baseProductSnapshotAttributes.frameNumberAround = `${expectedFrameNumberAround}`;
            
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            expect(baseProductSnapshot.frameNumberAround).toEqual(expect.any(Number));
        });

        it('should be required', () => {
            baseProductSnapshotAttributes.frameNumberAround = null;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const error = baseProductSnapshot.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: frameRepeat', () => {
        it('should have a correctly calculated default value', () => {
            delete baseProductSnapshotAttributes.frameRepeat;
            const { sizeAround, spaceAround } = baseProductSnapshotAttributes.die;
            const frameRepeatInInches = Math.floor(MAX_FRAME_LENGTH_INCHES / (sizeAround + spaceAround)) * (sizeAround + spaceAround);
            const millimetersPerInch = 25.4;
            const expectedFrameRepeatInMillimeters = frameRepeatInInches * millimetersPerInch;

            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            expect(baseProductSnapshot.frameRepeat).toBeDefined();
            expect(baseProductSnapshot.frameRepeat).toEqual(expectedFrameRepeatInMillimeters);
        });

        it('should be a number', () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            expect(baseProductSnapshot.frameRepeat).toEqual(expect.any(Number));
        });

        it('should be required', () => {
            baseProductSnapshotAttributes.frameRepeat = null;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const error = baseProductSnapshot.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: labelsPerFrame', () => {
        it('should be a number', () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            expect(baseProductSnapshot.labelsPerFrame).toEqual(expect.any(Number));
        });

        it('should have the correctly calculated default value', () => {
            delete baseProductSnapshotAttributes.labelsPerFrame;
            
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const expectedLabelsPerFrame = baseProductSnapshot.frameNumberAcross * baseProductSnapshot.frameNumberAround;
            expect(baseProductSnapshot.labelsPerFrame).toBeDefined();
            expect(baseProductSnapshot.labelsPerFrame).toEqual(expectedLabelsPerFrame);
        });

        it('should be required', () => {
            baseProductSnapshotAttributes.labelsPerFrame = null;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const error = baseProductSnapshot.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: coreHeight', () => {
        it('should be a number', () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            expect(baseProductSnapshot.coreHeight).toEqual(expect.any(Number));
        });

        it('should have the correctly calculated default value', () => {
            delete baseProductSnapshotAttributes.coreHeight;
        
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            const scalar = 0.125;
            const expectedCoreHeight = baseProductSnapshot.die.sizeAcross + scalar;

            expect(baseProductSnapshot.coreHeight).toBeDefined();
            expect(baseProductSnapshot.coreHeight).toEqual(expectedCoreHeight);
        });

        it('should be required', () => {
            baseProductSnapshotAttributes.coreHeight = null;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const error = baseProductSnapshot.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: pressCount', () => {
        it('should be a number', () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            expect(baseProductSnapshot.pressCount).toEqual(expect.any(Number));
        });

        it('should the correctly calculated default value', () => {
            delete baseProductSnapshotAttributes.pressCount;
            
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const fixedConstant = 10;
            const expectedPressCount = (baseProductSnapshot.die.sizeAround + baseProductSnapshot.die.spaceAround) * (baseProductSnapshot.labelsPerRoll / fixedConstant);
            expect(baseProductSnapshot.pressCount).toBeDefined();
            expect(baseProductSnapshot.pressCount).toEqual(expectedPressCount);
        });

        it('should be required', () => {
            baseProductSnapshotAttributes.pressCount = null;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const error = baseProductSnapshot.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: deltaRepeat', () => {
        it('should be a number', () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            expect(baseProductSnapshot.deltaRepeat).toEqual(expect.any(Number));
        });

        it('should have the correctly calculated default value', () => {
            delete baseProductSnapshotAttributes.deltaRepeat;
            
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const expectedDeltaRepeat = baseProductSnapshot.frameNumberAround * baseProductSnapshot.die.spaceAround;
            expect(baseProductSnapshot.deltaRepeat).toBeDefined();
            expect(baseProductSnapshot.deltaRepeat).toEqual(expectedDeltaRepeat);
        });

        it('should be required', () => {
            baseProductSnapshotAttributes.deltaRepeat = null;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const error = baseProductSnapshot.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: rotoRepeat', () => {
        it('should be a number', () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            expect(baseProductSnapshot.rotoRepeat).toEqual(expect.any(Number));
        });

        it('should have the correctly calculated default value', () => {
            delete baseProductSnapshotAttributes.rotoRepeat;
            
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            const { frameNumberAround, die } = baseProductSnapshot;
            const expectedRotoRepeat = (frameNumberAround * die.spaceAround) * die.numberAround;

            expect(baseProductSnapshot.rotoRepeat).toBeDefined();
            expect(baseProductSnapshot.rotoRepeat).toEqual(expectedRotoRepeat);
        });

        it('should be required', () => {
            baseProductSnapshotAttributes.rotoRepeat = null;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const error = baseProductSnapshot.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: labelCellAcross', () => {
        it('should be a number', () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            expect(baseProductSnapshot.labelCellAcross).toEqual(expect.any(Number));
        });

        it('should have the correctly calculated default value', () => {
            delete baseProductSnapshotAttributes.labelCellAcross;
            
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const { die } = baseProductSnapshot;
            const expectedLabelCellAcross = die.sizeAcross + die.spaceAcross;
            expect(baseProductSnapshot.labelCellAcross).toBeDefined();
            expect(baseProductSnapshot.labelCellAcross).toEqual(expectedLabelCellAcross);
        });

        it('should be required', () => {
            baseProductSnapshotAttributes.labelCellAcross = null;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const error = baseProductSnapshot.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: labelCellAround', () => {
        it('should be a number', () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            expect(baseProductSnapshot.labelCellAround).toEqual(expect.any(Number));
        });

        it('should have the correctly calculated default value', () => {
            delete baseProductSnapshotAttributes.labelCellAround;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            const { die } = baseProductSnapshot;
            const expectedLabelCellAround = die.sizeAround + die.spaceAround;

            expect(baseProductSnapshot.labelCellAround).toBeDefined();
            expect(baseProductSnapshot.labelCellAround).toEqual(expectedLabelCellAround);
        });

        it('should be required', () => {
            baseProductSnapshotAttributes.labelCellAround = null;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const error = baseProductSnapshot.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: frameSize', () => {
        it('should be a number', () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            expect(baseProductSnapshot.frameSize).toEqual(expect.any(Number));
        });

        it('should have the correctly calculated default value', () => {
            delete baseProductSnapshotAttributes.frameSize;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            const expectedFrameSize = baseProductSnapshot.labelCellAround * baseProductSnapshot.frameNumberAround;

            expect(baseProductSnapshot.frameSize).toBeDefined();
            expect(baseProductSnapshot.frameSize).toEqual(expectedFrameSize);
        });

        it('should be required', () => {
            baseProductSnapshotAttributes.frameSize = null;
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            
            const error = baseProductSnapshot.validateSync();
            
            expect(error).toBeDefined();
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
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);

            let savedBaseProductSnapshot = await baseProductSnapshot.save({ validateBeforeSave: false });

            expect(savedBaseProductSnapshot.createdAt).toBeDefined();
            expect(savedBaseProductSnapshot.updatedAt).toBeDefined();
        });

        it('should soft delete items', async () => {
            const baseProductSnapshot = new BaseProductSnapshotModel(baseProductSnapshotAttributes);
            const id = baseProductSnapshot._id;

            await baseProductSnapshot.save();
            await BaseProductSnapshotModel.deleteById(id);

            const softDeletedBaseProductSnapshot = await BaseProductSnapshotModel.findOneDeleted({_id: id}).exec();

            expect(softDeletedBaseProductSnapshot).toBeDefined();
            expect(softDeletedBaseProductSnapshot.deleted).toBe(true);
        });
    });
});
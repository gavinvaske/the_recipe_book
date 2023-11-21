const chance = require('chance').Chance();
const CreditTermModel = require('../../application/models/creditTerm');
const databaseService = require('../../application/services/databaseService');

describe('validation', () => {
    let creditTermAttributes;

    beforeEach(() => {
        creditTermAttributes = {
            description: chance.string()
        };
    });

    it('should not fail validation if all attributes are defined correctly', () => {
        const creditTerm = new CreditTermModel(creditTermAttributes);

        const error = creditTerm.validateSync();

        expect(error).toBeUndefined();
    });

    describe('attribute: description', () => {
        it('should fail validation if attribute is not defined', () => {
            delete creditTermAttributes.description;
            const creditTerm = new CreditTermModel(creditTermAttributes);

            const error = creditTerm.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type String', () => {
            const creditTerm = new CreditTermModel(creditTermAttributes);

            expect(creditTerm.description).toEqual(expect.any(String));
        });

        it('should trim attribute', () => {
            const expectedDescription = chance.string();
            creditTermAttributes.description = '   ' + expectedDescription + '  ';
            const downtimeReason = new CreditTermModel(creditTermAttributes);

            expect(downtimeReason.description).toEqual(expectedDescription);
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
                const creditTerm = new CreditTermModel(creditTermAttributes);
                let savedCreditTerm = await creditTerm.save({ validateBeforeSave: false });

                expect(savedCreditTerm.createdAt).toBeDefined();
                expect(savedCreditTerm.updatedAt).toBeDefined();
            });
        });
    });
});
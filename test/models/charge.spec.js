
const chance = require('chance').Chance();
const ChargeModel = require('../../application/models/charge');

describe('validation', () => {
    let chargeAttributes;

    beforeEach(() => {
        chargeAttributes = {
            ProductNumber: chance.word() + `-${chance.letter()}`,
            PriceM: String(chance.floating())
        };
    });

    describe('attribute: productNumber (aka ProductNumber)', () => {
        it('should contain attribute', () => {
            const charge = new ChargeModel(chargeAttributes);

            expect(charge.productNumber).toBeDefined();
        });

        it('should fail validation if attribute does not exist', () => {
            delete chargeAttributes.ProductNumber;
            const charge = new ChargeModel(chargeAttributes);

            const error = charge.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation productNumber is not in the correct format format', () => {
            chargeAttributes.ProductNumber = chance.string();
            const charge = new ChargeModel(chargeAttributes);

            const error = charge.validateSync();

            expect(error).not.toBe(undefined);
        });
    });

    describe('attribute: price (aka PriceM)', () => {
        it('should contain attribute', () => {
            const charge = new ChargeModel(chargeAttributes);

            expect(charge.price).toBeDefined();
        });

        it('should fail validation if attribute does not exist', () => {
            delete chargeAttributes.PriceM;
            const charge = new ChargeModel(chargeAttributes);

            const error = charge.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should not store floating points of more than 2 decimal places', () => {
            const priceWithWayTooManyDecimals = '100.112222222';
            chargeAttributes.PriceM = priceWithWayTooManyDecimals;
            const expectedPrice = 100.11;

            const charge = new ChargeModel(chargeAttributes);

            expect(charge.price).toEqual(expectedPrice);
        });

        it('should fail validation if negative price is used', () => {
            const negativePrice = String(chance.integer({max: -1}));
            chargeAttributes.PriceM = negativePrice;
            const charge = new ChargeModel(chargeAttributes);

            const error = charge.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should remove commas from price', () => {
            const currencyWithCommas = '1,192,123.83';
            const currencyWithoutCommas = 1192123.83;
            chargeAttributes.PriceM = currencyWithCommas;

            const charge = new ChargeModel(chargeAttributes);

            expect(charge.price).toEqual(currencyWithoutCommas);
        });

        it('should fail validation if price is a non-number', () => {
            const invalidPrice = chance.word();
            chargeAttributes.PriceM = invalidPrice;
            const charge = new ChargeModel(chargeAttributes);

            const error = charge.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if price is empty', () => {
            const invalidPrice = '';
            chargeAttributes.PriceM = invalidPrice;
            const charge = new ChargeModel(chargeAttributes);

            const error = charge.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should fail validation if price is $0', () => {
            const invalidPrice = '0';
            chargeAttributes.PriceM = invalidPrice;
            const charge = new ChargeModel(chargeAttributes);

            const error = charge.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should be of type Number', () => {
            const charge = new ChargeModel(chargeAttributes);

            expect(charge.price).toEqual(expect.any(Number));
        });
    });
});
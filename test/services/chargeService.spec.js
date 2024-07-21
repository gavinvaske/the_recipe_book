import Chance from 'chance'
const chance = Chance();;
const {PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE} = require('../../application/services/chargeService');

describe('chargeService test suite', () => {
    let productNumber;

    it('should NOT return a regex match', () => {
        productNumber = chance.word() + `-${chance.integer({min: 0, max: 1000})}`;

        const isAMatch = PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE.test(productNumber);

        expect(isAMatch).toBe(false);
    });

    it('should NOT return a regex match', () => {
        productNumber = chance.word();

        const isAMatch = PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE.test(productNumber);

        expect(isAMatch).toBe(false);
    });

    it('should NOT return a regex match', () => {
        productNumber = chance.word() + '-' + chance.integer({min: 0, max: 1000});

        const isAMatch = PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE.test(productNumber);

        expect(isAMatch).toBe(false);
    });

    it('should return a regex match', () => {
        productNumber = chance.word() + '-' + chance.word();

        const isAMatch = PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE.test(productNumber);

        expect(isAMatch).toBe(true);
    });

    it('should NOT return a regex match', () => {
        productNumber = chance.word() + '-' + chance.word() + '1234';

        const isAMatch = PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE.test(productNumber);

        expect(isAMatch).toBe(false);
    });
});
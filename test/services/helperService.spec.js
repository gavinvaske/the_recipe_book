const helperService = require('../../application/services/helperService');
import Chance from 'chance'
const chance = Chance();;

describe('helperService.js', () => {
    describe('getEmptyObjectIfUndefined()', () => {
        it('should return an empty object if an undefined value is passed in', () => {
            const undefinedValue = chance.pickone([undefined, null]);
            const expectedValue = {};

            const actualValue = helperService.getEmptyObjectIfUndefined(undefinedValue);

            expect(actualValue).toEqual(expectedValue);
        });

        it ('should return the value passed in if value is defined', () => {
            const value = chance.string();
            const expectedValue = value;
            
            const actualValue = helperService.getEmptyObjectIfUndefined(value);

            expect(actualValue).toEqual(expectedValue);
        });
    });

    describe('getEmptyArrayIfUndefined()', () => {
        it('should return an empty array if an undefined value is passed in', () => {
            const undefinedValue = chance.pickone([undefined, null]);
            const expectedValue = [];

            const actualValue = helperService.getEmptyArrayIfUndefined(undefinedValue);

            expect(actualValue).toEqual(expectedValue);
        });

        it ('should return the value passed in if value is defined', () => {
            const value = chance.string();
            const expectedValue = value;
            
            const actualValue = helperService.getEmptyArrayIfUndefined(value);

            expect(actualValue).toEqual(expectedValue);
        });
    });
});
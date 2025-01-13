import * as currencyService from '../../application/api/services/currencyService';
import Chance from 'chance';

const chance = Chance();

describe('File: currencyService.js', () => {
    describe('Function: convertDollarsToPennies', () => {
        it('should return the falsy value if the input is not a number', () => {
            const nonNumber = chance.pickone([null, undefined, '']);
            const expectedResult = nonNumber;

            const actualResult = currencyService.convertDollarsToPennies(nonNumber);

            expect(actualResult).toBe(expectedResult);
        });

        it('should convert integer to pennies', () => {
            const integer = 999;
            const expectedResult = 99900;

            const actualResult = currencyService.convertDollarsToPennies(integer);
            
            expect(actualResult).toBe(expectedResult);
        });

        it('should convert floating point numbers to pennies', () => {
            const floatingPointNumber = 990.59;
            const expectedResult = 99059;
            
            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);
            
            expect(actualResult).toBe(expectedResult);
        });

        it('should ignore decimals beyond the hundreths places (case 1)', () => {
            const floatingPointNumber = 123.5577;
            const expectedResult = 12356;

            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);

            expect(actualResult).toBe(expectedResult);
        });

        it('should ignore decimals beyond the hundreths places (case 2)', () => {
            const floatingPointNumber = 83783448723.5999;
            const expectedResult = 8378344872360;

            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);

            expect(actualResult).toBe(expectedResult);
        });

        it('should negative integers', () => {
            const floatingPointNumber = -98765;
            const expectedResult = -9876500;

            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);

            expect(actualResult).toBe(expectedResult);
        });

        it('should negative floating points', () => {
            const floatingPointNumber = -54764.97;
            const expectedResult = -5476497;

            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);

            expect(actualResult).toBe(expectedResult);
        });

        it('should negative floating points and ignore decimals beyond the hundreths place (case 1)', () => {
            const floatingPointNumber = -4234234.97999999;
            const expectedResult = -423423498;

            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);

            expect(actualResult).toBe(expectedResult);
        });

        it('should negative floating points and ignore decimals beyond the hundreths place (case 2)', () => {
            const floatingPointNumber = -238173128731.4899727869432;
            const expectedResult = -23817312873149;

            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);

            expect(actualResult).toBe(expectedResult);
        });

        it('should handle converting tricky floating point numbers', () => {
            const trickyFloatingPointNumber = 9774762599383.04;
            const expectedResult = 977476259938304;

            const actualResult = currencyService.convertDollarsToPennies(trickyFloatingPointNumber);
            
            expect(actualResult).toBe(expectedResult);
        });

        it('should return 0 if the number is 0', () => {
            const zero = 0;
            const expectedResult = 0;
            
            const actualResult = currencyService.convertDollarsToPennies(zero);
            
            expect(actualResult).toBe(expectedResult);
        });

        it('should handle commas (case 1)', () => {
            const numberWithCommas = '1,299,875,333,187.1099999';
            const expectedResult = 129987533318711;

            const actualResult = currencyService.convertDollarsToPennies(numberWithCommas);
            
            expect(actualResult).toBe(expectedResult);
        });

        it('should handle commas (case 2)', () => {
            const numberWithCommas = '1,187.17777';
            const expectedResult = 118718;

            const actualResult = currencyService.convertDollarsToPennies(numberWithCommas);
            
            expect(actualResult).toBe(expectedResult);
        });

        it('should handle commas (case 3)', () => {
            const numberWithCommas = '-199,811,187.96666';
            const expectedResult = -19981118797;

            const actualResult = currencyService.convertDollarsToPennies(numberWithCommas);
            
            expect(actualResult).toBe(expectedResult);
        });  
    });

    describe('Function: convertPenniesToDollars', () => {
        it('should return the falsy value if the input is not a number', () => {
            const nonNumber = chance.pickone([null, undefined, '']);
            const expectedResult = nonNumber;

            const actualResult = currencyService.convertPenniesToDollars(nonNumber);

            expect(actualResult).toBe(expectedResult);
        });

        it('should convert an integer representing pennies to dollars (case 1)', () => {
            const pennies = 99900;
            const expectedResult = 999;

            const actualResult = currencyService.convertPenniesToDollars(pennies);
            
            expect(actualResult).toBe(expectedResult);
        });

        it('should convert an integer representing pennies to dollars (case 2)', () => {
            const pennies = 99923478902314098724308972348970;
            const expectedResult = 999234789023140987243089723489.70;

            const actualResult = currencyService.convertPenniesToDollars(pennies);
            
            expect(actualResult).toBe(expectedResult);
        });

        it('should round to the nearest penny when converting pennies to dollars (case 1)', () => {
            const pennies = 123456780.50;
            const expectedResult = 1234567.81;
            
            const actualResult = currencyService.convertPenniesToDollars(pennies);
            
            expect(actualResult).toBe(expectedResult);
        });

        it('should round to the nearest penny when converting pennies to dollars (case 2)', () => {
            const pennies = 942390784329874327984.1;
            const expectedResult = 9423907843298743279.84;
            
            const actualResult = currencyService.convertPenniesToDollars(pennies);
            
            expect(actualResult).toBe(expectedResult);
        });

        it('should handle converting negative pennies into dollars (case 1)', () => {
            const pennies = -8973453945898453;
            const expectedResult = -89734539458984.53;

            const actualResult = currencyService.convertPenniesToDollars(pennies);
            
            expect(actualResult).toBe(expectedResult);
        });

        it('should handle converting negative pennies into dollars (case 2)', () => {
            const pennies = -999999999999992.50000;
            const expectedResult = -9999999999999.93;

            const actualResult = currencyService.convertPenniesToDollars(pennies);
            
            expect(actualResult).toBe(expectedResult);
        });

        it('should handle converting negative pennies into dollars (case 4)', () => {
            const pennies = -123.40000;
            const expectedResult = -1.23;

            const actualResult = currencyService.convertPenniesToDollars(pennies);
            
            expect(actualResult).toBe(expectedResult);
        });
    });
});
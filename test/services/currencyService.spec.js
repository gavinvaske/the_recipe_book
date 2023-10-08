const currencyService = require('../../application/services/currencyService');

describe('File: currencyService.js', () => {
    describe('Function: convertDollarsToPennies', () => {
        it('should convert integer to pennies', () => {
            const integer = 999
            const expectedResult = 99900;

            const actualResult = currencyService.convertDollarsToPennies(integer);
            
            expect(actualResult).toBe(expectedResult);
        })

        it('should convert floating point numbers to pennies', () => {
            const floatingPointNumber = 990.59;
            const expectedResult = 99059;
            
            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);
            
            expect(actualResult).toBe(expectedResult);
        })

        it('should ignore decimals beyond the hundreths places (case 1)', () => {
            const floatingPointNumber = 123.5577;
            const expectedResult = 12355;

            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);

            expect(actualResult).toBe(expectedResult);
        })

        it('should ignore decimals beyond the hundreths places (case 2)', () => {
            const floatingPointNumber = 83783448723.5999;
            const expectedResult = 8378344872359;

            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);

            expect(actualResult).toBe(expectedResult);
        })

        it('should negative integers', () => {
            const floatingPointNumber = -98765;
            const expectedResult = -9876500;

            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);

            expect(actualResult).toBe(expectedResult);
        })

        it('should negative floating points', () => {
            const floatingPointNumber = -54764.97;
            const expectedResult = -5476497;

            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);

            expect(actualResult).toBe(expectedResult);
        })

        it('should negative floating points and ignore decimals beyond the hundreths place (case 1)', () => {
            const floatingPointNumber = -4234234.97999999;
            const expectedResult = -423423497;

            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);

            expect(actualResult).toBe(expectedResult);
        })

        it('should negative floating points and ignore decimals beyond the hundreths place (case 2)', () => {
            const floatingPointNumber = -238173128731.4899727869432;
            const expectedResult = -23817312873148;

            const actualResult = currencyService.convertDollarsToPennies(floatingPointNumber);

            expect(actualResult).toBe(expectedResult);
        })

        it('should handle converting tricky floating point numbers', () => {
            const trickyFloatingPointNumber = 9774762599383.04
            const expectedResult = 977476259938304;

            const actualResult = currencyService.convertDollarsToPennies(trickyFloatingPointNumber);
            
            expect(actualResult).toBe(expectedResult);
        })

        it('should return 0 if the number is 0', () => {
            const zero = 0;
            const expectedResult = 0;
            
            const actualResult = currencyService.convertDollarsToPennies(zero);
            
            expect(actualResult).toBe(expectedResult);
        })

        it('should handle commas (case 1)', () => {
            const numberWithCommas = '1,299,875,333,187.1099999'
            const expectedResult = 129987533318710;

            const actualResult = currencyService.convertDollarsToPennies(numberWithCommas);
            
            expect(actualResult).toBe(expectedResult);
        })

        it('should handle commas (case 2)', () => {
            const numberWithCommas = '1,187.17777'
            const expectedResult = 118717;

            const actualResult = currencyService.convertDollarsToPennies(numberWithCommas);
            
            expect(actualResult).toBe(expectedResult);
        })

        it('should handle commas (case 3)', () => {
            const numberWithCommas = '-199,811,187.96666'
            const expectedResult = -19981118796;

            const actualResult = currencyService.convertDollarsToPennies(numberWithCommas);
            
            expect(actualResult).toBe(expectedResult);
        })  
    })
})
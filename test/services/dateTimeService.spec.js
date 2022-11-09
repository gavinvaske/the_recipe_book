/* eslint-disable no-magic-numbers */
const dateTimeService = require('../../application/services/dateTimeService');
const chance = require('chance').Chance();

describe('dateTimeService test suite', () => {
    describe('howManyMillisecondsHavePassedBetweenDateTimes()', () => {
        let time1, time2;
        beforeEach(() => {
            time1 = new Date('2022-11-06T20:45:04.176+00:00');
            time2 = new Date('2022-11-06T20:45:04.876+00:00');
        });
        it('should compute time beween dates correctly', () => {
            const expectedDifferenceInMilliseconds = 700;

            const actualDifferenceInMilliseconds = dateTimeService.howManyMillisecondsHavePassedBetweenDateTimes(time1, time2);

            expect(actualDifferenceInMilliseconds).toBe(expectedDifferenceInMilliseconds);
        });

        it('should compute time beween dates correctly in absolute terms', () => {
            const expectedDifferenceInMilliseconds = 700;

            const actualDifferenceInMilliseconds = dateTimeService.howManyMillisecondsHavePassedBetweenDateTimes(time2, time1);

            expect(actualDifferenceInMilliseconds).toBe(expectedDifferenceInMilliseconds);
        });
    });

    describe('convertMillisecondsToMinutes()', () => {
        const secondsPerMinute = 60;
        const millisecondsPerSecond = 1000;

        it('should convert milliseconds to mintues correctly (v1)', () => {
            const numberOfSeconds = 30;
            const thirtySecondsInMilliseconds = numberOfSeconds * millisecondsPerSecond;

            const actualMinutes = dateTimeService.convertMillisecondsToMinutes(thirtySecondsInMilliseconds);

            expect(actualMinutes).toBe(numberOfSeconds / secondsPerMinute);
        });

        it('should convert milliseconds to mintues correctly (v2)', () => {
            const numberOfSeconds = 9993;
            const milliseconds = numberOfSeconds * millisecondsPerSecond;

            const actualMinutes = dateTimeService.convertMillisecondsToMinutes(milliseconds);

            expect(actualMinutes).toBe(numberOfSeconds / secondsPerMinute);
        });

        it('should convert zero milliseconds to 0 minutes', () => {
            const numberOfSeconds = 0;
            const milliseconds = numberOfSeconds * millisecondsPerSecond;

            const actualMinutes = dateTimeService.convertMillisecondsToMinutes(milliseconds);

            expect(actualMinutes).toBe(numberOfSeconds / secondsPerMinute);
        });
    });

    describe('prettifyDuration()', () => {
        let durationInMinutes;
        const minutesPerDay = 1440;
        const daysPerWeek = 7;
        const daysPerYear = 365;
        const monthsPerYear = 12;
        const daysInAverageMonth = daysPerYear / monthsPerYear;

        it('should show "N/A" if duration is undefined', () => {
            durationInMinutes = undefined;
            const expectedFormattedDuration = 'N/A';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should show "N/A" if duration is less than 0', () => {
            durationInMinutes = -1;
            const expectedFormattedDuration = 'N/A';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should show "0m" if duration is 0', () => {
            durationInMinutes = 0;
            const expectedFormattedDuration = '0m';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });
        it('should show "0m" if duration is greater than 0 but less than 1', () => {
            durationInMinutes = chance.floating({min: 0.1, max: 0.9});
            const expectedFormattedDuration = '0m';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should only display minutes if duration is between: 1 minute -> 60 minutes (test 1)', () => {
            durationInMinutes = 1;
            const expectedFormattedDuration = '1m';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should only display minutes if duration is between: 1 minute -> 60 minutes (test 2)', () => {
            durationInMinutes = 59.9;
            const expectedFormattedDuration = '59m';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should display hours and minutes if duration is greater than 59 minutes but less than 1 day (test 1)', () => {
            durationInMinutes = 60;
            const expectedFormattedDuration = '1hr 0m';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should display hours and minutes if duration is greater than 59 minutes but less than 1 day (test 2)', () => {
            durationInMinutes = 1439;
            const expectedFormattedDuration = '23hr 59m';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should display days and hours if duration is greater than 1 day but less than 1 week (test 1)', () => {
            const minutesInOneDay = 1440;
            durationInMinutes = minutesInOneDay;
            const expectedFormattedDuration = '1d 0hr';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should display days and hours if duration is greater than 1 day but less than 1 week (test 2)', () => {
            const minutesInOneDay = 1440;
            const sixDays = 6;
            durationInMinutes = (minutesInOneDay * sixDays) + (minutesInOneDay - 1);
            const expectedFormattedDuration = '6d 23hr';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should display weeks and days if duration is greater than 1 week but less than 1 month (test 1)', () => {
            durationInMinutes = (1 * daysPerWeek * minutesPerDay) + (minutesPerDay - 1);
            const expectedFormattedDuration = '1w 0d';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should display weeks and days if duration is greater than 1 week but less than 1 month (test 2)', () => {
            const threeWeeks = 3;
            const sevenDays = 7;
            durationInMinutes = (threeWeeks * daysPerWeek * minutesPerDay) + ((sevenDays * minutesPerDay) - 1);
            const expectedFormattedDuration = '3w 6d';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should display months and weeks if duration is greater than 1 month but less than 1 year (test 1)', () => {
            durationInMinutes = daysInAverageMonth * minutesPerDay;
            const expectedFormattedDuration = '1m 0w';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should display months and weeks if duration is greater than 1 month but less than 1 year (test 2)', () => {
            durationInMinutes = daysPerYear * minutesPerDay - 1;
            const expectedFormattedDuration = '11m 4w';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should display years and months if duration is greater than 1 year (test 1)', () => {
            durationInMinutes = daysPerYear * minutesPerDay;
            const expectedFormattedDuration = '1yr 0m';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });

        it('should display years and months if duration is greater than 1 year (test 2)', () => {
            const nineYears = 9;
            const elevenMonths = 11;
            const threeWeeks = 3;
            durationInMinutes = (nineYears * daysPerYear * minutesPerDay) + (elevenMonths * daysInAverageMonth * minutesPerDay) + (threeWeeks * daysPerWeek * minutesPerDay);
            const expectedFormattedDuration = '9yr 11m';

            const formattedDuration = dateTimeService.prettifyDuration(durationInMinutes);

            expect(formattedDuration).toBe(expectedFormattedDuration);
        });
    });

    describe('getSimpleDate()', () => {
        it('should convert date according to format mm/dd/yyyy', () => {
            const dateString = '2022-11-06T20:45:04.176+00:00';
            const expectedDate = '11/6/2022';

            const actualDate = dateTimeService.getSimpleDate(dateString);

            expect(actualDate).toBe(expectedDate);
        });
    });
});
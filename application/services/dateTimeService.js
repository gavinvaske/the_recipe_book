const DAYS_PER_YEAR = 365;
const MONTHS_PER_YEAR = 12;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 1440;
const MINUTES_PER_WEEK = 10080;
const MINUTES_PER_AVERAGE_MONTH = (DAYS_PER_YEAR / MONTHS_PER_YEAR) * MINUTES_PER_DAY;
const MINUTES_PER_YEAR = DAYS_PER_YEAR * MINUTES_PER_DAY;

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;

module.exports.howManyMillisecondsHavePassedBetweenDateTimes = (dateTime1, dateTime2) => {
    return Math.abs(dateTime2 - dateTime1);
};

module.exports.convertMillisecondsToMinutes = (numberOfMilliseconds) => {
    const milliSecondsPerMinute = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;

    return numberOfMilliseconds / milliSecondsPerMinute;
};

module.exports.prettifyDuration = (durationInMinutes) => { // eslint-disable-line complexity
    const zeroMinutes = 0;

    if (typeof durationInMinutes !== 'number' || durationInMinutes < zeroMinutes) {
        return 'N/A';
    }

    let minutes, hours, days, weeks, months;
    const roundedDurationInMinutes = Math.floor(durationInMinutes);
    const durationIsLessThanOneMinute = roundedDurationInMinutes <= zeroMinutes;
    const durationIslessThanOneHour = roundedDurationInMinutes < MINUTES_PER_HOUR;
    const durationIsLessThanOneDay = roundedDurationInMinutes < MINUTES_PER_DAY;
    const durationIsLessThanOneWeek = roundedDurationInMinutes < MINUTES_PER_WEEK;
    const durationIsLessThanOneMonth = roundedDurationInMinutes < MINUTES_PER_AVERAGE_MONTH;
    const durationIsLessThanOneYear = roundedDurationInMinutes < MINUTES_PER_YEAR;

    if (durationIsLessThanOneMinute || durationIslessThanOneHour) {
        return `${roundedDurationInMinutes}m`;
    }

    if (durationIsLessThanOneDay) {
        hours = Math.floor(roundedDurationInMinutes / MINUTES_PER_HOUR);
        minutes = roundedDurationInMinutes % MINUTES_PER_HOUR;
        return `${hours}hr ${minutes}m`;
    }

    if (durationIsLessThanOneWeek) {
        days = Math.floor(roundedDurationInMinutes / MINUTES_PER_DAY);
        hours = Math.floor((roundedDurationInMinutes % MINUTES_PER_DAY) / MINUTES_PER_HOUR);
        return `${days}d ${hours}hr`;
    }

    if (durationIsLessThanOneMonth) {
        weeks = Math.floor(roundedDurationInMinutes / MINUTES_PER_WEEK);
        days = Math.floor((roundedDurationInMinutes % MINUTES_PER_WEEK) / MINUTES_PER_DAY);
        return `${weeks}w ${days}d`;
    }

    if (durationIsLessThanOneYear) {
        months = Math.floor(roundedDurationInMinutes / MINUTES_PER_AVERAGE_MONTH);
        weeks = Math.floor((roundedDurationInMinutes % MINUTES_PER_AVERAGE_MONTH) / MINUTES_PER_WEEK);
        return `${months}m ${weeks}w`;
    }

    years = Math.floor(roundedDurationInMinutes / MINUTES_PER_YEAR);
    months = Math.floor((roundedDurationInMinutes % MINUTES_PER_YEAR) / MINUTES_PER_AVERAGE_MONTH);

    return `${years}yr ${months}m`;
};

module.exports.getDate = (utcDate) => {
    if (!utcDate) {
        return '';
    }

    return new Date(utcDate).toLocaleDateString('en-US');
};

module.exports.getDayNumberAndMonth = (utcDate) => {
    if (!utcDate) {
        return '';
    }
    
    const date = new Date(utcDate).toLocaleString('en-US', {day: '2-digit', month: 'long', timeZone: 'UTC'});
    const dateParts = date.split(' ');
    const monthName = dateParts[0];
    const twoDigitDayOfMonth = dateParts[1];

    return `${twoDigitDayOfMonth} ${monthName}`;
};
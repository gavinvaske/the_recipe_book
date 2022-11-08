function sayHi(name) {
    return 'hello ' + name;
}

function prettifyDurationInMinutes(durationInMinutes) {
    if (!durationInMinutes) {
        return;
    }
    const roundedDurationInMinutes = Math.floor(durationInMinutes);
    const daysPerYear = 365;
    const monthsPerYear = 12;
    const minutesPerHour = 60;
    const minutesPerDay = 1440;
    const minutesPerWeek = 10080;
    const minutesPerAverageMonth = (daysPerYear / monthsPerYear) * minutesPerDay;
    const minutesPerYear = daysPerYear * minutesPerDay;

    const durationIslessThanOneHour = roundedDurationInMinutes < minutesPerHour;
    const durationIsLessThanOneMinutes = roundedDurationInMinutes <= 0; // eslint-disable-line no-magic-numbers
    const durationIsLessThanOneDay = roundedDurationInMinutes < minutesPerDay;
    const durationIsLessThanOneWeek = roundedDurationInMinutes < minutesPerWeek;
    const durationIsLessThanOneMonth = roundedDurationInMinutes < minutesPerAverageMonth;
    const durationIsLessThanOneYear = roundedDurationInMinutes < minutesPerYear;

    if (durationIsLessThanOneMinutes) {
        return 0; // eslint-disable-line no-magic-numbers
    }

    if (durationIslessThanOneHour) {
        return roundedDurationInMinutes;
    }

    if (durationIsLessThanOneDay) {
        return 'TODO: Format this time';
    }

    if (durationIsLessThanOneWeek) {
        return 'TODO: Format this time';
    }

    if (durationIsLessThanOneMonth) {
        return 'TODO: Format this time';
    }

    if (durationIsLessThanOneYear) {
        return 'TODO: Format this time';
    }

    return 'TODO: Format this time';
}

const helperMethods = {
    sayHi,
    prettifyDurationInMinutes
};

module.exports = helperMethods;
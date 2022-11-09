const workflowStepService = require('./workflowStepService');

function getSimpleDate(date) {
    return new Date(date).toLocaleDateString('en-US');
}

function prettifyDuration(durationInMinutes) {
    if (typeof durationInMinutes !== 'number' || durationInMinutes < 0) {
        return 'N/A';
    }

    let minutes, hours, days, weeks, months;
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
        return `${0}m`; // eslint-disable-line no-magic-numbers
    }

    if (durationIslessThanOneHour) {
        return roundedDurationInMinutes;
    }

    if (durationIsLessThanOneDay) {
        hours = Math.floor(roundedDurationInMinutes / minutesPerHour)
        minutes = roundedDurationInMinutes % minutesPerHour;
        return `${hours}hr ${minutes}m`;
    }

    if (durationIsLessThanOneWeek) {
        days = Math.floor(roundedDurationInMinutes / minutesPerDay);
        hours = Math.floor((roundedDurationInMinutes % minutesPerDay) / minutesPerHour);
        return `${days}d ${hours}hr`;
    }

    if (durationIsLessThanOneMonth) {
        weeks = Math.floor(roundedDurationInMinutes / minutesPerWeek);
        days = Math.floor((roundedDurationInMinutes % minutesPerWeek) / minutesPerDay);
        return `${weeks}w ${days}d`;
    }

    if (durationIsLessThanOneYear) {
        months = Math.floor(roundedDurationInMinutes / minutesPerAverageMonth);
        weeks = Math.floor((roundedDurationInMinutes % minutesPerAverageMonth) / minutesPerWeek)
        return `${months}m ${weeks}w`;
    }

    years = Math.floor(roundedDurationInMinutes / minutesPerYear);
    months = Math.floor((roundedDurationInMinutes % minutesPerYear) / minutesPerAverageMonth)

    return `${years}yr ${months}m`;
}

const helperMethods = {
    prettifyDuration: prettifyDuration,
    getSimpleDate: getSimpleDate,
    getOverallTicketDuration: workflowStepService.getOverallTicketDuration,
    getHowLongTicketHasBeenInProduction: workflowStepService.getHowLongTicketHasBeenInProduction,
    getHowLongTicketHasBeenInDepartment: workflowStepService.getHowLongTicketHasBeenInDepartment,
    getHowLongTicketHasHadADepartmentStatus: workflowStepService.getHowLongTicketHasHadADepartmentStatus
};

module.exports = helperMethods;
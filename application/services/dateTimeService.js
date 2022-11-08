module.exports.howManyMillisecondsHavePassedBetweenDateTimes = (dateTime1, dateTime2) => {
    return Math.abs(dateTime2 - dateTime1);
};

module.exports.convertMillisecondsToMinutes = (numberOfMilliseconds) => {
    const millisecondsPerMinute = 60000;

    return numberOfMilliseconds / millisecondsPerMinute;
};
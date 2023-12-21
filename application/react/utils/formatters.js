module.exports.secondsFormatter = (seconds) => {
    const secondsPerHour = 3600;
    const secondsPerMinute = 60;
    const secondsRemainder = seconds % secondsPerHour;
    
    const minutesRemainder = Math.floor(secondsRemainder / secondsPerMinute);
    const hours = Math.floor(seconds / secondsPerHour)
    
    return hours ? 
        `${hours}h ${minutesRemainder}m` 
        : `${minutesRemainder}m`
};

module.exports.floatingPointFormatter = (numberOfDecimals) => {
    return (floatingPointValue) => {
        const valueWithoutCommas = floatingPointValue.toFixed(numberOfDecimals);
        var parts = valueWithoutCommas.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
};

module.exports.percentageFormatter = (numberOfDecimals) => {
    return (percentage) => {
        return (percentage * 100).toFixed(numberOfDecimals) + '%';
    }
}

module.exports.currencyFormatter = (pennies) => {
    return `$${this.floatingPointFormatter(2)(pennies)}`
}
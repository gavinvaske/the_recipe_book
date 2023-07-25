const NUMBER_OF_PENNIES_IN_A_DOLLAR = 100;
const NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY = 2;

module.exports.convertDollarsToPennies = (numberAsString) => {
    const currencyWithoutCommas = String(numberAsString).split(',').join('');

    if (currencyWithoutCommas === undefined || currencyWithoutCommas === '') throw new Error('Cannot save an undefined currency amount');

    return parseInt(Number(currencyWithoutCommas * NUMBER_OF_PENNIES_IN_A_DOLLAR));
};

module.exports.convertPenniesToDollars = (amountInPennies) => {
    return Number((amountInPennies / NUMBER_OF_PENNIES_IN_A_DOLLAR).toFixed(NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY));
};
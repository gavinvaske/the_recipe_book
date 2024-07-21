import Decimal from 'decimal.js';

const PENNIES_PER_DOLLAR = 100;
const NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY = 2;

export function convertDollarsToPennies(numberAsString) {
    const currencyWithoutCommas = String(numberAsString).split(',').join('');

    if (currencyWithoutCommas === null || currencyWithoutCommas === undefined || currencyWithoutCommas === '') throw new Error('Cannot save an undefined currency amount');

    const peciseDollarAmount = new Decimal(currencyWithoutCommas);

    return Math.round(peciseDollarAmount.times(PENNIES_PER_DOLLAR).toFixed(NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY));
}

export function convertPenniesToDollars(amountInPennies) {
    const preciseAmountInPennies = new Decimal(amountInPennies);

    return Number((preciseAmountInPennies.dividedBy(PENNIES_PER_DOLLAR)).toFixed(NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY));
}
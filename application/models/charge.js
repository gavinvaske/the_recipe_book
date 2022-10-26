const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const {PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE} = require('../services/chargeService');

const NUMBER_OF_PENNIES_IN_A_DOLLAR = 100;
const NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY = 2;

function productNumberMustHaveCorrectSyntax(productNumber) {
    return PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE.test(productNumber);
}

function numberMustBeGreaterThanZero(number) {
    return number > 0; // eslint-disable-line no-magic-numbers
}

function convertStringCurrency(numberAsString) {
    const currencyWithoutCommas = numberAsString.split(',').join('');

    return Number(currencyWithoutCommas * NUMBER_OF_PENNIES_IN_A_DOLLAR);
}

const chargeSchema = new Schema({
    productNumber: {
        type: String,
        alias: 'ProductNumber',
        required: true,
        validate: [productNumberMustHaveCorrectSyntax, 'Product Number is incorrect for one or more of the extra charges']
    },
    price: {
        type: Number,
        validate: [
            {
                validator: numberMustBeGreaterThanZero,
                message: 'Price cannot be negative'
            }
        ],
        get: amountInDollars => Number((amountInDollars / NUMBER_OF_PENNIES_IN_A_DOLLAR).toFixed(NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY)),
        set: convertStringCurrency,
        alias: 'PriceM',
        required: true
    }
}, { timestamps: true });

const Charge = mongoose.model('Charge', chargeSchema);

module.exports = Charge;
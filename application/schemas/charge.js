const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const { PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE } = require('../services/chargeService');
const { convertDollarsToPennies, convertPenniesToDollars } = require('../services/currencyService');

function productNumberMustHaveCorrectSyntax(productNumber) {
    return PRODUCT_NUMBER_IS_FOR_AN_EXTRA_CHARGE.test(productNumber);
}

function numberMustBeGreaterThanZero(number) {
    return number > 0; // eslint-disable-line no-magic-numbers
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
        get: convertPenniesToDollars,
        set: convertDollarsToPennies,
        alias: 'PriceM',
        required: true
    }
}, { timestamps: true });

module.exports = chargeSchema;
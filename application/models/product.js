const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// For help deciphering these regex expressions, visit: https://regexr.com/
PRODUCT_NUMBER_REGEX = /^\d{3,4}D-\d{1,}$/;
PRODUCT_DIE_REGEX = /(DR|DO|DC|DSS|XLDR|DB|DD|DRC|DCC)-(.{1,})/;

const NUMBER_OF_PENNIES_IN_A_DOLLAR = 100;
const NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY = 2;

function cannotBeFalsy(value) {
    if (!value) {
        return false;
    }
    return true;
}

function convertStringCurrency(numberAsString) {
    const currencyWithoutCommas = numberAsString.split(',').join('');

    return Number(currencyWithoutCommas * NUMBER_OF_PENNIES_IN_A_DOLLAR);
}

function validateProductNumber(productNumber) {
    return PRODUCT_NUMBER_REGEX.test(productNumber);
}

function validateProductDie(productDie) {
    return PRODUCT_DIE_REGEX.test(productDie);
}

function numberMustBeGreaterThanZero(number) {
    return number > 0; // eslint-disable-line no-magic-numbers
}

function validateCornerRadius(cornerRadius) {
    const greaterThanOrEqualToZero = cornerRadius >= 0; // eslint-disable-line no-magic-numbers
    const lessThanOne = cornerRadius < 1;

    return greaterThanOrEqualToZero && lessThanOne;
}

const schema = new Schema({
    productNumber: {
        type: String,
        validate: [validateProductNumber, 'Product Number is in the wrong format'],
        required: true,
        uppercase: true,
        alias: 'ProductNumber'
    },
    productDie: {
        type: String,
        validate: [validateProductDie, 'Product Die is in the wrong format'],
        required: true,
        uppercase: true,
        alias: 'ToolNo1'
    },
    primaryMaterial: {
        type: String,
        required: false,
        alias: 'StockNum2'
    },
    uvFinish: {
        type: String,
        required: false,
        alias: 'InkType'
    },
    sizeAcross: {
        type: Number,
        validate: [numberMustBeGreaterThanZero, 'Size Across must be greater than 0'],
        required: true,
        alias: 'SizeAcross'
    },
    sizeAround: {
        type: Number,
        validate: [numberMustBeGreaterThanZero, 'Size Around must be greater than 0'],
        required: true,
        alias: 'SizeAround'
    },
    labelsAcross: {
        type: Number,
        validate: [numberMustBeGreaterThanZero, 'Size Around must be greater than 0'],
        required: true,
        alias: 'NoAcross'
    },
    labelsAround: {
        type: Number,
        validate: [numberMustBeGreaterThanZero, 'Size Around must be greater than 0'],
        required: true,
        alias: 'NoAround'
    },
    cornerRadius: {
        type: Number,
        required: true,
        validate: [validateCornerRadius, 'Corner Radius must be between 0 and 1'],
        alias: 'CornerRadius'
    },
    unwindDirection: {
        type: String,
        required: true,
        alias: 'FinalUnwind'
    },
    matrixAcross: {
        type: Number,
        required: true,
        alias: 'ColSpace'
    },
    matrixAround: {
        type: Number,
        required: true,
        alias: 'RowSpace'
    },
    description: {
        type: String,
        required: true,
        alias: 'Description'
    },
    labelQty: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : 'Label Quantity must be an integer'
        },
        min: 0,
        alias: 'OrderQuantity'
    },
    windingNotes: {
        type: String,
        required: false,
        alias: 'FinishNotes'
    },
    dieCuttingNotes: {
        type: String,
        required: false,
        alias: 'StockNotes'
    },
    prePrintingNotes: {
        type: [String],
        alias: 'Notes'
    },
    printingNotes: {
        type: String,
        alias: 'Hidden_Notes'
    },
    numberOfColors: {
        type: Number,
        validate : {
            validator : Number.isInteger,
            message   : 'Number of Colors must be an integer'
        },
        min: 0,
        required: false,
        alias: 'NoColors'
    },
    labelsPerRoll: {
        type: Number,
        validate : {
            validator : Number.isInteger,
            message   : 'Number of Colors must be an integer'
        },
        min: 0,
        required: true,
        alias: 'LabelsPer_'
    },
    finishType: {
        type: String,
        required: false,
        alias: 'FinishType'
    },
    price: {
        type: Number,
        validate: [
            {
                validator: cannotBeFalsy,
                message: 'Price cannot be 0 or blank'
            },
            {
                validator: numberMustBeGreaterThanZero,
                message: 'Price cannot be negative'
            }
        ],
        get: amountInDollars => Number((amountInDollars / NUMBER_OF_PENNIES_IN_A_DOLLAR).toFixed(NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY)),
        set: convertStringCurrency,
        required: true,
        alias: 'PriceM'
    },
    priceMode: {
        type: String,
        required: false,
        alias: 'PriceMode'
    },
    productDieTwo: {
        type: String,
        validate: [validateProductDie, 'Product Die is in the wrong format'],
        uppercase: true,
        required: false,
        alias: 'ToolNo2'
    },
    Tool_NumberAround: {
        type: Number,
        validate : [
            {
                validator : Number.isInteger,
                message   : 'Tool Number Around must be an integer'
            },
            {
                validator: numberMustBeGreaterThanZero,
                message: 'Tool Number Around cannot be negative'
            }
        ],
        required: false,
        alias: 'toolNumberAround'
    },
    Plate_ID: {
        type: String,
        alias: 'plateId'
    }
}, { timestamps: true });

const Product = mongoose.model('Product', schema);

module.exports = Product;

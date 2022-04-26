const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// For help deciphering these regex expressions, visit: https://regexr.com/
PRODUCT_NUMBER_REGEX = /^\d{3,4}D-\d{1,}/
PRODUCT_DIE_REGEX = /(DR|DO|DC|DSS|XLDR|DB|DD|DRC|DCC)-(\d{1,})/

function validateProductNumber(productNumber) {
    return PRODUCT_NUMBER_REGEX.test(productNumber);
}

function validateProductDie(productDie) {
    return PRODUCT_DIE_REGEX.test(productDie);
}

function numberMustBeGreaterThanZero(number) {
    return number > 0;
}

function validateCornerRadius(cornerRadius) {
    const greaterThanOrEqualToZero = cornerRadius >= 0
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
        type: Object,
        required: false,
        alias: 'InkType'
    },
    sizeAcross: {
        type: Number,
        validate: [numberMustBeGreaterThanZero, "Size Across must be greater than 0"],
        required: true,
        alias: 'SizeAcross'
    },
    sizeAround: {
        type: Number,
        validate: [numberMustBeGreaterThanZero, "Size Around must be greater than 0"],
        required: true,
        alias: 'SizeAround'
    },
    labelsAcross: {
        type: Number,
        validate: [numberMustBeGreaterThanZero, "Size Around must be greater than 0"],
        required: true,
        alias: 'NoAcross'
    },
    labelsAround: {
        type: Number,
        validate: [numberMustBeGreaterThanZero, "Size Around must be greater than 0"],
        required: true,
        alias: 'NoAround'
    },
    cornerRadius: {
        type: Number,
        required: true,
        validate: [validateCornerRadius, "Corner Radius must be between 0 and 1"],
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
        type: Object,
        required: false,
        alias: 'FinishNotes'
    },
    dieCuttingNotes: {
        type: Object,
        required: false,
        alias: 'StockNotes'
    },
    prePrintingNotes: {
        type: [Object],
        alias: 'Notes'
    },
    printingNotes: {
        type: Object,
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
        required: true,
        alias: 'FinishType'
    },
    price: {
        type: Number,
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
    toolNumberAround: {
        type: String,
        required: false,
        alias: 'Tool_NumberAround'
    },
    plateId: {
        type: String,
        required: false,
        alias: 'Plate_ID'
    }
}, { timestamps: true });

const Product = mongoose.model('Product', schema);

module.exports = Product;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    productNumber: {
        type: String,
        required: true,
        alias: 'ProductNumber'
    },
    productDie: {
        type: String,
        required: true,
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
        required: true,
        alias: 'SizeAcross'
    },
    sizeAround: {
        type: Number,
        required: true,
        alias: 'SizeAround'
    },
    labelsAcross: {
        type: Number,
        required: true,
        alias: 'NoAcross'
    },
    labelsAround: {
        type: Number,
        required: true,
        alias: 'NoAround'
    },
    cornerRadius: {
        type: Number,
        required: true,
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
        required: false,
        alias: 'NoColors'
    },
    labelsPerRoll: {
        type: Number,
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
    dieTwo: {
        type: String,
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

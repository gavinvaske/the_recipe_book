const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const CustomerModel = require('./Customer');
const { unwindDirections, defaultUnwindDirection } = require('../../application/enums/unwindDirectionsEnum');

async function generateUniqueProductNumber() {
    const customer = await CustomerModel.findById(this.customerId);
    const howManyProductsDoesThisCustomerHave = await ProductModel.countDocuments({ customerId: this.customerId });

    const nextProductId = howManyProductsDoesThisCustomerHave + 1;
    const numberOfDigitsInProductId = 3;
    const nextProductIdWithLeadingZero = nextProductId.toString().padStart(numberOfDigitsInProductId, '0');

    productNumber = `${customer.customerId}-${nextProductIdWithLeadingZero}`;

    this.productNumber = productNumber;
}

const productSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    productNumber: {
        type: String,
        unique: true
    },
    productDescription: {
        type: String,
        required: true
    },
    die: {
        type: Schema.Types.ObjectId,
        ref: 'Die',
        required: true
    },
    unwindDirection: {
        type: String,
        enum: unwindDirections,
        default: defaultUnwindDirection
    }
}, { timestamps: true });

productSchema.pre('save', generateUniqueProductNumber);

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;

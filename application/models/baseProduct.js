import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import { sharedBaseProductMongooseAttributes } from '../enums/sharedBaseProductAttributesEnum.js';

import mongooseDelete from 'mongoose-delete';
mongoose.plugin(mongooseDelete, { overrideMethods: true });

async function generateUniqueProductNumber() {
    await this.populate('customer');
    const howManyProductsDoesThisCustomerHave = await ProductModel.countDocuments({ customer: this.customer._id });

    const nextProductId = howManyProductsDoesThisCustomerHave + 1;
    const numberOfDigitsInProductId = 3;
    const nextProductIdWithLeadingZeroes = nextProductId.toString().padStart(numberOfDigitsInProductId, '0');

    const productNumber = `${this.customer.customerId}-${nextProductIdWithLeadingZeroes}`;

    this.productNumber = productNumber;
}

async function setDefaultOverun() {
    if (this.overun !== undefined) return;
    
    await this.populate('customer');

    this.overun = this.customer.overun;
}

const productSchema = new Schema({
    ...sharedBaseProductMongooseAttributes,
    die: {
        type: Schema.Types.ObjectId,
        ref: 'Die',
        required: true
    },
    frameNumberAcross: {
        type: Number,
        required: false,
        min: 0
    },
    frameNumberAround: {
        type: Number,
        required: false,
        min: 0
    },
    primaryMaterial: {
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    },
    secondaryMaterial: {
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: false
    },
    finish: {
        type: Schema.Types.ObjectId,
        ref: 'Finish',
        required: false
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true,
    strict: 'throw'
});

productSchema.pre('save', generateUniqueProductNumber);
productSchema.pre('save', setDefaultOverun);

const ProductModel = mongoose.model('BaseProduct', productSchema);

export default ProductModel;

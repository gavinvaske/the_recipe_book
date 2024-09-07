import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import { unwindDirections } from '../enums/unwindDirectionsEnum.ts';
import { finishTypes } from '../enums/finishTypesEnum.ts';
import { ovOrEpmOptions } from '../enums/ovOrEpmEnum.ts';

import mongooseDelete from 'mongoose-delete';
mongoose.plugin(mongooseDelete, { overrideMethods: true });

async function generateUniqueProductNumber(this: any) {
  await this.populate('customer');
  const howManyProductsDoesThisCustomerHave = await BaseProductModel.countDocuments({ customer: this.customer._id });

  const nextProductId = howManyProductsDoesThisCustomerHave + 1;
  const numberOfDigitsInProductId = 3;
  const nextProductIdWithLeadingZeroes = nextProductId.toString().padStart(numberOfDigitsInProductId, '0');

  const productNumber = `${this.customer.customerId}-${nextProductIdWithLeadingZeroes}`;

  this.productNumber = productNumber;
}

async function setDefaultOverun(this: any) {
  if (this.overun !== undefined) return;

  await this.populate('customer');

  this.overun = this.customer.overun;
}

const productSchema = new Schema({
  productNumber: {
    type: String,
    unique: true
  },
  productDescription: {
    type: String,
    required: true
  },
  unwindDirection: {
    type: Number,
    enum: unwindDirections,
    required: true
  },
  ovOrEpm: {
    type: String,
    uppercase: true,
    enum: ovOrEpmOptions,
    required: true
  },
  artNotes: {
    type: String
  },
  pressNotes: {
    type: String,
    required: false
  },
  finishType: {
    type: String,
    uppercase: true,
    enum: finishTypes,
    required: true
  },
  coreDiameter: {
    type: Number,
    min: 0,
    required: true
  },
  labelsPerRoll: {
    type: Number,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer'
    },
    required: true
  },
  dieCuttingNotes: {
    type: String
  },
  overun: {
    type: Number,
    required: false // This attribute is defaulted to customer.overun on-save of this object if not specified
  },
  spotPlate: {
    type: Boolean,
    required: true
  },
  numberOfColors: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer'
    },
    min: 0
  },
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
    required: false,
    set: (val) => val === '' ? null : val
  },
  finish: {
    type: Schema.Types.ObjectId,
    ref: 'Finish',
    required: false,
    set: (val) => val === '' ? null : val
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

export const BaseProductModel = mongoose.model('BaseProduct', productSchema);


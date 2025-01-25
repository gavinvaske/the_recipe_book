import mongoose, { SchemaTimestampsConfig } from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import { addressSchema } from '../schemas/address.ts';
import { IAddress } from '@shared/types/schemas.ts';
import { contactSchema, IContact } from '../schemas/contact.ts';
import mongooseDelete from 'mongoose-delete';
import { ICreditTerm } from './creditTerm.ts';

mongoose.plugin(mongooseDelete, { overrideMethods: true });

function doesArrayContainElements(value) {
    return value.length > 0;
}

export interface IShippingLocation extends IAddress {
  freightAccountNumber?: string;
  deliveryMethod?: mongoose.Types.ObjectId;
}

// ShippingLocations inherit the attributes from the address schema and add additional properties.
// To learn more, read about "discriminators" here: https://mongoosejs.com/docs/discriminators.html
const shippingLocationsSchema = new mongoose.Schema({
    ...addressSchema.obj,
    freightAccountNumber: {
        type: String,
        uppercase: true
    },
    deliveryMethod: {
        type: Schema.Types.ObjectId,
        ref: 'DeliveryMethod'
    }
}, { timestamps: true });

export interface ICustomer extends SchemaTimestampsConfig, mongoose.Document {
  customerId: string;
  name: string;
  notes?: string;
  businessLocations?: IAddress[];
  shippingLocations?: IShippingLocation[];
  billingLocations?: IAddress[];
  contacts?: IContact[];
  creditTerms?: mongoose.Types.ObjectId[] | ICreditTerm[];
  overun: number;
}

const schema = new Schema<ICustomer>({
    customerId: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
    },
    notes: {
        type: String
    },
    businessLocations: {
        type: [addressSchema]
    },
    shippingLocations: {
        type: [shippingLocationsSchema]
    },
    billingLocations: {
        type: [addressSchema]
    },
    contacts: {
        type: [contactSchema],
        validate: [doesArrayContainElements, 'Must have at least one contact']
    },
    creditTerms: {
        type: [Schema.Types.ObjectId],
        ref: 'CreditTerm'
    },
    overun: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export const CustomerModel = mongoose.model<ICustomer>('Customer', schema);

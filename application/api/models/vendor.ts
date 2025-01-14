import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import { validatePhoneNumber, validateEmail } from '../services/dataValidationService.ts';
import { addressSchema } from '../schemas/address.ts';

import mongooseDelete from 'mongoose-delete';
mongoose.plugin(mongooseDelete, { overrideMethods: true });

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        validate: [validatePhoneNumber, 'The provided phone number "{VALUE}" is not a valid phone number']
    },
    email: {
        type: String,
        required: false,
        validate: [validateEmail, 'The provided email "{VALUE}" is not a valid email address']
    },
    notes: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    address: {
        type: addressSchema,
        required: true
    },
    primaryContactName: {
        type: String,
        required: true
    },
    primaryContactPhoneNumber: {
        type: String,
        required: true,
        validate: [validatePhoneNumber, 'Invalid attribute "primaryContactPhoneNumber": The provided phone number "{VALUE}" is not a valid phone number']
    },
    primaryContactEmail: {
        type: String,
        required: true,
        validate: [validateEmail, 'Invalid attribute "primaryContactEmail": The provided email "{VALUE}" is not a valid email address']
    },
    mfgSpecNumber: {
        type: String,
        required: false
    }
}, { timestamps: true });

// Add indexes to enable "text based search"
schema.index({
    name: 'text',
    phoneNumber: 'text',
    email: 'text',
    notes: 'text',
    website: 'text',
    primaryContactName: 'text',
    primaryContactPhoneNumber: 'text',
    primaryContactEmail: 'text',
    mfgSpecNumber: 'text',
});

export const VendorModel = mongoose.model('Vendor', schema);

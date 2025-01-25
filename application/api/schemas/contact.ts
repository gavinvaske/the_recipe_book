import mongoose, { SchemaTimestampsConfig } from 'mongoose';
import { addressSchema } from './address.ts';
import { IAddress } from '@shared/types/schemas.ts';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import { validatePhoneNumber, validateEmail } from '../services/dataValidationService.ts';

export interface IContact extends SchemaTimestampsConfig, mongoose.Document {
  fullName: string;
  phoneNumber?: string;
  phoneExtension?: number;
  email?: string;
  contactStatus: string;
  notes?: string;
  position?: string;
  location?: IAddress;
}

export const contactSchema = new Schema<IContact>({
    fullName: {
        type: String,
        uppercase: true,
        required: true,
    },
    phoneNumber: {
        type: String,
        validate: [validatePhoneNumber, 'The provided phone number "{VALUE}" is not a valid phone number']
    },
    phoneExtension: {
        type: Number
    },
    email: {
        type: String,
        uppercase: true,
        validate: [validateEmail, 'The provided email "{VALUE}" is not a valid email']
    },
    contactStatus: {
        type: String,
        uppercase: true,
        required: true
    },
    notes: {
        type: String
    },
    position: {
        type: String
    },
    location: {
        type: addressSchema
    }
}, { timestamps: true });

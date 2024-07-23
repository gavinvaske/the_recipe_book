import mongoose from 'mongoose';
import addressSchema from './address.js';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import { validatePhoneNumber, validateEmail } from '../services/dataValidationService.js';

const contactSchema = new Schema({
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

export default contactSchema;
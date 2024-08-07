import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import { validatePhoneNumber, validateEmail } from '../services/dataValidationService.ts';
import { AVAILABLE_USER_TYPES, DEFAULT_USER_TYPE } from '../enums/userTypesEnum.ts';

const checkForSpaces = function(text) {
    if (!text) {
        return true;
    }
    const isValid = !text.includes(' ');

    return isValid;
};

const userSchema = new Schema({
    email: {
        type: String,
        uppercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        minLength: 8,
        required: true
    },
    userType: {
        type: String,
        enum: AVAILABLE_USER_TYPES,
        default: DEFAULT_USER_TYPE
    },
    profilePicture: {
        data: {
            type: Buffer
        },
        contentType: {
            type: String,
            enum: ['image/png', 'image/jpeg', 'image/jpg']
        }
    },
    username: {
        type: String,
        unique: true,
        validate: [{
            validator: checkForSpaces, 
            msg: 'Your username must not contain spaces'
        }],
        sparse: true
    },
    fullName: {
        type: String
    },
    jobRole: {
        type: String
    },
    phoneNumber: {
        type: String,
        validate: [validatePhoneNumber, 'The provided phone number "{VALUE}" is not a valid phone number']
    },
    birthDate: {
        type: Date
    }
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);


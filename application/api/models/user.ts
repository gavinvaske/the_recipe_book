import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import { validatePhoneNumber, validateEmail } from '../services/dataValidationService.ts';
import { AVAILABLE_AUTH_ROLES, DEFAULT_AUTH_ROLE } from '../enums/authRolesEnum.ts';  /* TODO: Rename */

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
    },
    authRoles: {
      type: [{
        type: String,
        enum: AVAILABLE_AUTH_ROLES
      }],
    },
    lastLoginDateTime: {
      type: Date
    }
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);


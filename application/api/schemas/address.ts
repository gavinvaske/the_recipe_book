import mongoose, { SchemaTimestampsConfig } from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;

const ZIP_CODE_REGEX = /(^\d{5}(?:[-\s]\d{4})?$)/;

function validateZipCode(zipCode) {
    return ZIP_CODE_REGEX.test(zipCode);
}

export interface IAddress extends SchemaTimestampsConfig, mongoose.Document {
  name: string;
  street: string;
  unitOrSuite?: string;
  city: string;
  state: string;
  zipCode: string;
}

export const addressSchema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true
    },
    street: {
        type: String,
        uppercase: true,
        required: true
    },
    unitOrSuite: {
        type: String,
        uppercase: true
    },
    city: {
        type: String,
        uppercase: true,
        required: true
    },
    state: {
        type: String,
        uppercase: true,
        required: true
    },
    zipCode: {
        type: String,
        validate: [validateZipCode, 'The provided zip code of "{VALUE}" is not a correctly formatted zip code'],
        required: true
    },
}, { timestamps: true });

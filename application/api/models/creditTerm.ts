import mongoose, { SchemaTimestampsConfig } from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
import mongooseDelete from 'mongoose-delete';
mongoose.plugin(mongooseDelete, { overrideMethods: true });
const Schema = mongoose.Schema;

// export interface ICreditTerm extends SchemaTimestampsConfig, mongoose.Document {
//   description: string;
// }

const schema = new Schema<ICreditTerm>({
    description: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
        index: true
    },
}, { timestamps: true });

export const CreditTermModel = mongoose.model<ICreditTerm>('CreditTerm', schema);

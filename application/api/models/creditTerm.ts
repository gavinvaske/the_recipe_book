import { ICreditTerm } from '@shared/types/models.ts';
import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
import mongooseDelete from 'mongoose-delete';
mongoose.plugin(mongooseDelete, { overrideMethods: true });
const Schema = mongoose.Schema;

const schema = new Schema<ICreditTerm>({
    description: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
        index: true
    },
}, { timestamps: true, strict: 'throw' });

schema.index({ description: 'text' });

export const CreditTermModel = mongoose.model<ICreditTerm>('CreditTerm', schema);

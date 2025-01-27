import { IMaterialCategory } from '@shared/types/models.ts';
import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import mongoose_delete from 'mongoose-delete';
mongoose.plugin(mongoose_delete, { overrideMethods: true });

const schema = new Schema<IMaterialCategory>({
    name: {
        type: String,
        required: true,
        uppercase: true
    }
}, { timestamps: true });


export const MaterialCategoryModel = mongoose.model<IMaterialCategory>('MaterialCategory', schema);

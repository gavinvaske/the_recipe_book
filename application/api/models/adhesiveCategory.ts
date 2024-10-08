import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import mongooseDelete from 'mongoose-delete';
mongoose.plugin(mongooseDelete, { overrideMethods: true });

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const AdhesiveCategoryModel = mongoose.model('AdhesiveCategory', schema);
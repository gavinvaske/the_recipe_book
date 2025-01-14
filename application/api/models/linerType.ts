import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import mongoose_delete from 'mongoose-delete';

const schema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
    }
}, { 
    timestamps: true,
    strict: 'throw'
});

// Add indexes to enable "text based search"
schema.index({
    name: 'text'
});

schema.plugin(mongoose_delete, { overrideMethods: true });

export const LinerTypeModel = mongoose.model('LinerType', schema);

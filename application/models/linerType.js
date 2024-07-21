import mongoose from 'mongoose'
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import mongoose_delete from 'mongoose-delete';

const LinerTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        uppercase: true,
        unique: true
    }
}, { 
    timestamps: true,
    strict: 'throw'
});

LinerTypeSchema.plugin(mongoose_delete, { overrideMethods: true });

const LinerType = mongoose.model('LinerType', LinerTypeSchema);

module.exports = LinerType;
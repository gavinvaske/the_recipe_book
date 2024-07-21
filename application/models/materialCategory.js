import mongoose from 'mongoose'
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import mongoose_delete from 'mongoose-delete';
mongoose.plugin(mongoose_delete, { overrideMethods: true });

const schema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true
    }
}, { timestamps: true });


const MaterialCategory = mongoose.model('MaterialCategory', schema);

export default MaterialCategory;
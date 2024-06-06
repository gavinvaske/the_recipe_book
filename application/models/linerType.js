const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const LinerTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
    uppercase: true
  }
}, { 
  timestamps: true,
  strict: 'throw'
});

LinerTypeSchema.plugin(mongoose_delete, { overrideMethods: true });

const LinerType = mongoose.model('LinerType', LinerTypeSchema);

module.exports = LinerType
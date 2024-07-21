import mongoose from 'mongoose'
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

/* 
  * This table is responsible for Adding or Subtracting material from Inventory.
  * This primary will be used by an Admin to reconcile sporatic changes to the inventory.
  * Other methods for adding or subtracting materials are the "Ticket" and "MaterialOrder" db tables.
*/
const schema = new Schema({
    material: {
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        required: false
    }
}, { timestamps: true, strict: 'throw' });

schema.plugin(mongoose_delete, {overrideMethods: true});

const MaterialLengthAdjustment = mongoose.model('MaterialLengthAdjustment', schema);

module.exports = MaterialLengthAdjustment;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    products: {
        type: [{ type : Schema.Types.ObjectId, ref: 'Product' }]
    }
}, { timestamps: true });

const Job = mongoose.model('Job', schema);

module.exports = Job;

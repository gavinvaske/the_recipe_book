const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    id: {
        type: String,
        alias: "ID"
    }
}, { timestamps: true });

const Product = mongoose.model('Product', schema);

module.exports = Product;

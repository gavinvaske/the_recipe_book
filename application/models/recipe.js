const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserModel = require('./user');

const recipeSchema = new Schema({
    designNumber: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    dieNumber: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    notes: {
        type: String,
        required: false
    },
    howToVideo: {
        type: String,
        required: false
    },
    author: {
        type: UserModel.schema,
        required: true
    }
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const USER = 'USER';
const ADMIN = 'ADMIN';

const validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        uppercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        minLength: 8,
        required: true
    },
    userType: {
        type: String,
        enum: [USER, ADMIN],
        default: USER
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

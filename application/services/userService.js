const User = require('../models/user');

exports.createUser = (user) =>  {
    const userModel = new User(user);

    return userModel.save();
}
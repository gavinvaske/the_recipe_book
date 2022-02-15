const User = require('../models/user');

exports.createUser = async (userAttributes) => {
    const userModel = new User(userAttributes);

    return await userModel.save();
}
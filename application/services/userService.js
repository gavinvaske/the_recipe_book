const User = require('../models/user');

module.exports.createUser = async (userAttributes) => {
    const userModel = new User(userAttributes);

    return await userModel.save();
}
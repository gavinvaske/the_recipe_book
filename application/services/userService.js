const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.createUser = async (userAttributes) => {
    const userModel = new UserModel(userAttributes);

    return await userModel.save();
};

module.exports.isUserLoggedIn = (jwtToken, jwtSecret) => {
    if (!jwtToken) {
        return false;
    }

    try {
        jwt.verify(jwtToken, jwtSecret);
        return true;
    } catch (error) {
        console.log(`error during isJwtTokenValid(): ${error}`);
    }

    return false;
};
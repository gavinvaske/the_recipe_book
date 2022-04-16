const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.createUser = async (userAttributes) => {
    const userModel = new User(userAttributes);

    return await userModel.save();
};

module.exports.isUserLoggedIn = (jwtToken, jwtSecret) => {
    if (!jwtToken) {
        return false;
    }

    try {
        const resp = jwt.verify(jwtToken, jwtSecret);
        console.log(`here is the jwt.verify response => ${JSON.stringify(resp)}`);
        return true;
    } catch (error) {
        console.log(`error during isJwtTokenValid(): ${JSON.stringify(error)}`);
    }

    return false;
};
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.createUser = async (userAttributes) => {
    const userModel = new UserModel(userAttributes);

    return await userModel.save();
};

module.exports.getProfilePictureUrl = (user) => {
    if (!user) { 
        return '';
    }
    
    const contentType = user.profilePicture ? user.profilePicture.contentType : undefined;
    const imageData = user.profilePicture ? user.profilePicture.data.toString('base64') : undefined;

    if (!contentType || !imageData) {
        return '';
    }
    
    return `url(data:image/${contentType};base64,${imageData})`
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
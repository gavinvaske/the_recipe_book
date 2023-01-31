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
    
    return `data:image/${contentType};base64,${imageData}`;
};

module.exports.getUserInitials = (user) => {
    if (!user || !user.fullName) {
        return '';
    }

    if (user.fullName.length > 0) { // eslint-disable-line no-magic-numbers
        return user.fullName[0];
    }
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
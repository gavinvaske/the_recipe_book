const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.createUser = async (userAttributes) => {
    const userModel = new UserModel(userAttributes);

    return await userModel.save();
};

module.exports.getProfilePictureUrl = (user) => {
    if (!user || !user.profilePicture) { 
        return '';
    }

    const profilePicture = user.profilePicture;
    const {contentType, data} = profilePicture;

    if (!contentType || !data) {
        return '';
    };
    
    return `data:image/${contentType};base64,${data.toString('base64')}`;
};

module.exports.getUserInitials = (user) => {
    const emptyString = '';
    const indexOfFirstWordInArray = 0;
    const indexOfLastWordInArray = -1;
    const indexOfirstCharacterInWord = 0;

    if (!user || !user.fullName) {
        return '';
    }

    const names = user.fullName.split(' ');

    const firstNameInitial = (names.length > 0) ? names[indexOfFirstWordInArray][indexOfirstCharacterInWord] : emptyString; // eslint-disable-line no-magic-numbers
    const lastNameInitial = (names.length > 1) ? names.slice(indexOfLastWordInArray)[indexOfFirstWordInArray][indexOfirstCharacterInWord] : emptyString;

    return firstNameInitial + lastNameInitial;
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
import { UserModel } from '../models/user.ts';
import jwt from 'jsonwebtoken';

export async function createUser(userAttributes) {
    const userModel = new UserModel(userAttributes);

    return await userModel.save();
}

export function getProfilePictureUrl(user) {
    if (!user || !user.profilePicture) { 
        return '';
    }

    const profilePicture = user.profilePicture;
    const {contentType, data} = profilePicture;

    if (!contentType || !data) {
        return '';
    };
    
    return `data:image/${contentType};base64,${data.toString('base64')}`;
}

export function getUserInitials(user) {
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
}

export function isUserLoggedIn(jwtToken, jwtSecret) {
    if (!jwtToken) {
        return false;
    }

    try {
        jwt.verify(jwtToken, jwtSecret);
        return true;
    } catch (error) {
        console.log(`error during isJwtTokenValid(): ${error.message}`);
    }

    return false;
}
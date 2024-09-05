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
  if (!user) return '';
  
  let initials = '';

  if (user.firstName && user.firstName.length > 0) {
    initials += user.firstName[0].toUpperCase(); 
  }
  if (user.lastName && user.lastName.length > 0) {
    initials += user.lastName[0].toUpperCase();
  }

  return initials;
}

export function isUserLoggedIn(jwtToken, jwtSecret) {
    if (!jwtToken) {
        return false;
    }

    try {
        jwt.verify(jwtToken, jwtSecret);
        return true;
    } catch (error) {
        console.error(`error during isJwtTokenValid(): ${error.message}`);
    }

    return false;
}
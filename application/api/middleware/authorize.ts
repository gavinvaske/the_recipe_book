import jwt from 'jsonwebtoken';

import 'dotenv/config';
import { MongooseId } from '../../react/_types/typeAliases.ts';
import { FORBIDDEN, UNAUTHORIZED } from '../enums/httpStatusCodes.ts';

/* @deprecated (8-7-2024): 
    This is the old auth middleware. 
    Recommended to transition to verifyBearerToken() 
*/
export function verifyJwtToken(request, response, next) {
    const token = request.cookies.jwtToken;

    if (!token) {
        return response.status(FORBIDDEN).redirect('/');
    }

    try {
        request.user = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch (error) {
        response.clearCookie('jwtToken');
        return response.redirect('/');
    }
}

export function verifyBearerToken(request, response, next) {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader || authorizationHeader.length === 0) {
    return response.sendStatus(FORBIDDEN);
  }

  try {
    const accessToken = authorizationHeader.split(' ')[1];

    request.user = jwt.verify(accessToken, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return response.sendStatus(UNAUTHORIZED)
  }
}

export type TokenPayload = {
  email: string;
  id: MongooseId;
  roles: string[];
}

export function generateAccessToken(payload: TokenPayload, secret: string) {
  return jwt.sign(payload, secret, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: TokenPayload, secret: string) {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}
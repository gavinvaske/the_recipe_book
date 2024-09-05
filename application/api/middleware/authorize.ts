import jwt from 'jsonwebtoken';
import { Request, Response } from 'express'
import { MongooseId } from '../../react/_types/typeAliases.ts';
import { FORBIDDEN, UNAUTHORIZED } from '../enums/httpStatusCodes.ts';

export function verifyBearerToken(request: Request, response: Response, next) {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader) {
    return response.sendStatus(UNAUTHORIZED);
  }

  try {
    const accessToken = authorizationHeader.split(' ')[1];

    /* @ts-ignore: TODO: Add request.user type via a .d.ts file */
    request.user = jwt.verify(accessToken, process.env.JWT_SECRET) as TokenPayload;
    return next();
  } catch (error) {
    return response.sendStatus(FORBIDDEN) // Must be a 403 error so the frontend knows to fetch accessToken using refresh token. "I know who you are, but I can't let you in."
  }
}

export type TokenPayload = {
  _id: MongooseId;
  email: string;
  authRoles: string[];
}

export function generateAccessToken(payload: TokenPayload, secret: string) {
  return jwt.sign(payload, secret, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: TokenPayload, secret: string) {
  return jwt.sign(payload, secret, { expiresIn: '12h' }); // user MUST login once refresh token expires
}
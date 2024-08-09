import jwt from 'jsonwebtoken';

import 'dotenv/config';
import { MongooseId } from '../../react/_types/typeAliases.ts';
import { FORBIDDEN, UNAUTHORIZED } from '../enums/httpStatusCodes.ts';

export function verifyBearerToken(request, response, next) {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader || authorizationHeader.length === 0) {
    return response.sendStatus(UNAUTHORIZED);
  }

  try {
    const accessToken = authorizationHeader.split(' ')[1];

    request.user = jwt.verify(accessToken, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return response.sendStatus(FORBIDDEN) // Must be a 403 error so the frontend knows to fetch accessToken using refresh token. "I know who you are, but I can't let you in."
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
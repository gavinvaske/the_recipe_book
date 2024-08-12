import { Router, Request, Response } from 'express';
import { UserModel } from '../models/user.ts';
import { FORBIDDEN, SERVER_ERROR, SUCCESS, UNAUTHORIZED } from '../enums/httpStatusCodes.ts';
import { generateRefreshToken, generateAccessToken, TokenPayload } from '../middleware/authorize.ts';
import { MongooseId } from '../../react/_types/typeAliases.ts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = Router();

const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token'

 router.get('/logout', (_: Request, response: Response) => {
  response.clearCookie(REFRESH_TOKEN_COOKIE_NAME);

  return response.sendStatus(SUCCESS);
})

/* TODO: This type is a duplicate from the UI
    * Investigate various ways to share types between API and frontend (issue #348)
*/
export type UserAuth = {
  accessToken: string,
  authRoles: string[]
}

/* 
  At login, an HTTP only cookie is created which stores a user's refresh-token
  A user is given a plain text "accessToken" which has a short expiration time

  The user can use the access token to make secure requests to the server, but once
  that access token expires. They then need to call this endpoint, which uses the 
  refresh token that was stored in an HTTP only cookie, and if it's valid, and not expired
  as well, it generates a new accessToken that is sent back to the user
*/
router.get('/access-token', (request: Request, response: Response) => {
  const refreshTokenFromSecureCookie = request.cookies[REFRESH_TOKEN_COOKIE_NAME];

  if (!refreshTokenFromSecureCookie) {
    return response.sendStatus(UNAUTHORIZED)
  }

  try {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const payloadWithExtraStuff: any = jwt.verify(refreshTokenFromSecureCookie, refreshTokenSecret)
    
    const tokenPayload: TokenPayload = {
      email: payloadWithExtraStuff.email,
      id: payloadWithExtraStuff.id,
      authRoles: payloadWithExtraStuff.authRoles
    }

    const accessTokenSecret = process.env.JWT_SECRET as string;
    const accessToken = generateAccessToken(tokenPayload, accessTokenSecret);
    const userAuth: UserAuth = {
      accessToken,
      authRoles: payloadWithExtraStuff.authRoles
    }

    return response.json(userAuth)
  } catch (error) {
    return response.sendStatus(FORBIDDEN)
  }
})

router.post('/login', async (request: Request, response: Response) => {
  const { email, password } = request.body;
  const invalidLoginMessage = 'Invalid username and/or password'

  try {
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      return response.status(UNAUTHORIZED).send(invalidLoginMessage);
    }

    const isPasswordCorrectForUser = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrectForUser) {
      return response.status(UNAUTHORIZED).send(invalidLoginMessage);
    }

    const authRoles = user.authRoles || []

    const tokenPayload: TokenPayload = {
      id: user._id as MongooseId,
      email: user.email as string,
      authRoles: authRoles
    }

    const accessTokenSecret = process.env.JWT_SECRET as string;
    const accessToken = generateAccessToken(tokenPayload, accessTokenSecret);

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
    const refreshToken = generateRefreshToken(tokenPayload, refreshTokenSecret);

    response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true
    });

    try {
      /* Store user login date/time */
      await UserModel.updateOne({ _id: user._id }, {
        $set: { lastLoginDateTime: new Date() }
      })
    } catch (error) {
      console.error('Failed to save login info: ', error);
      // Do nothing else: aka allow login to proceed successfully
    }

    return response.status(SUCCESS).json({
      accessToken,
      authRoles: authRoles
    })

  } catch (error) {
    console.error(error);

    return response.status(SERVER_ERROR).send('An error was thrown during login, see logs for more details');
  }
})

export default router;
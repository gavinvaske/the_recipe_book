import 'dotenv/config';
import { Router } from 'express';
import { UserModel } from '../models/user.ts';
import { FORBIDDEN, SERVER_ERROR, SUCCESS, UNAUTHORIZED } from '../enums/httpStatusCodes.ts';
import { generateAccessToken, TokenPayload, verifyBearerToken, verifyJwtToken } from '../middleware/authorize.ts';
import { MongooseId } from '../../react/_types/typeAliases.ts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = Router();
 router.get('/foo111', verifyBearerToken, (_, response) => {
  return response.send('its valid!')
})

/* 
  At login, an HTTP only cookie is created which stores a user's refresh-token
  A user is given a plain text "accessToken" which has a short expiration time

  The user can use the access token to make secure requests to the server, but once
  that access token expires. They then need to call this endpoint, which uses the 
  refresh token that was stored in an HTTP only cookie, and if it's valid, and not expired
  as well, it generates a new accessToken that is sent back to the user
*/
router.get('/access-token', (request, response) => {
  const refreshTokenFromSecureCookie = request.cookies['refresh-token'];

  if (!refreshTokenFromSecureCookie) {
    return response.status(UNAUTHORIZED)
  }

  try {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const payloadWithExtraStuff: any = jwt.verify(refreshTokenFromSecureCookie, refreshTokenSecret)
    
    const tokenPayload: TokenPayload = {
      email: payloadWithExtraStuff.email,
      id: payloadWithExtraStuff.id,
      roles: payloadWithExtraStuff.roles
    }

    const accessTokenSecret = process.env.JWT_SECRET as string;
    const accessToken = generateAccessToken(tokenPayload, accessTokenSecret);

    return response.json({
      accessToken
    })
  } catch (error) {
    return response.status(FORBIDDEN)
  }
})

router.post('/login', async (request, response) => {
  const { email, password } = request.body;
  const invalidLoginMessage = 'Invalid username or password'

  try {
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      return response.status(UNAUTHORIZED).send(invalidLoginMessage);
    }

    const isPasswordCorrectForUser = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrectForUser) {
      return response.status(UNAUTHORIZED).send(invalidLoginMessage);
    }

    const tokenPayload = {
      id: user._id as MongooseId,
      email: user.email as string,
      roles: [user.userType]  /* TODO @Gavin (8-6-2024): Rename "userType" to "roles" on the database level */
    }

    const accessTokenSecret = process.env.JWT_SECRET as string;
    const accessToken = generateAccessToken(tokenPayload, accessTokenSecret);

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
    const refreshToken = generateAccessToken(tokenPayload, refreshTokenSecret);

    response.cookie('refresh-token', refreshToken, {
      httpOnly: true
    });

    return response.status(SUCCESS).json({
      accessToken
    })

  } catch (error) {
    console.error(error);

    return response.status(SERVER_ERROR).send('An error was thrown during login, see logs for more details');
  }
})

export default router;
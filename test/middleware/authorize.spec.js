import { verifyBearerToken } from '../../application/api/middleware/authorize.ts';
import jwt from 'jsonwebtoken';
import Chance from 'chance';

const chance = Chance();

jest.mock('jsonwebtoken');

const statusMock = jest.fn();
const clearCookieMock = jest.fn();
const redirectMock = jest.fn();

describe('authorization', () => {
    let request,
        response;
    const nextMock = jest.fn();

    beforeEach(() => {
        process.env.JWT_SECRET = chance.string();

        request = {
            cookies: {
                jwtToken: chance.string()
            },
            headers: {}
        };
        response = {
            clearCookie: clearCookieMock,
            redirect: redirectMock
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should send UNAUTHORIZED (401) status if bearer token is missing', () => {
        const missingBearerToken = chance.pickone(['', null, undefined]);
        request.headers.authorization = missingBearerToken;
        response.sendStatus = statusMock;
        const unauthorizedStatus = 401;

        verifyBearerToken(request, response, nextMock);

        expect(statusMock).toHaveBeenCalledTimes(1);
        expect(statusMock).toHaveBeenCalledWith(unauthorizedStatus);
    });

    it('should return FORBIDDEN (403) if bearer token is provided but malformed', () => {
        const malformedBearerToken = chance.string(); // Not in `bearer ${accessToken}` format
        request.headers.authorization = malformedBearerToken;
        response.sendStatus = statusMock;
        const forbiddenStatus = 403;

        verifyBearerToken(request, response, nextMock);

        expect(statusMock).toHaveBeenCalledTimes(1);
        expect(statusMock).toHaveBeenCalledWith(forbiddenStatus);
    });

    it('should return FORBIDDEN (403) if jwt verification fails', () => {
        const bearerToken = `bearer ${chance.string()}`;
        request.headers.authorization = bearerToken;
        response.sendStatus = statusMock;
        const forbiddenStatus = 403;

        jwt.verify.mockImplementation(() => {
            throw new Error();
        });

        verifyBearerToken(request, response, nextMock);

        expect(statusMock).toHaveBeenCalledTimes(1);
        expect(statusMock).toHaveBeenCalledWith(forbiddenStatus);
    });

    it('should call next() if jwt verification is successful', () => {
        const bearerToken = `bearer ${chance.string()}`;
        request.headers.authorization = bearerToken;
        response.sendStatus = statusMock;

        jwt.verify.mockImplementation(() => {
            return {};
        });

        verifyBearerToken(request, response, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(nextMock).toHaveBeenCalledWith();
    });
});

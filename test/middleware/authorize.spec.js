const {verifyJwtToken} = require('../../application/middleware/authorize');
const jwt = require('jsonwebtoken');
const chance = require('chance').Chance();

jest.mock('jsonwebtoken');

const sendStatusMock = jest.fn();
const clearCookieMock = jest.fn();
const redirectMock = jest.fn();

describe('authorization', () => {
    let request,
        response;
    const next = jest.fn();

    beforeEach(() => {
        process.env.JWT_SECRET = chance.string();

        request = {
            cookies: {
                jwtToken: chance.string()
            }
        };
        response = {
            clearCookie: clearCookieMock,
            redirect: redirectMock
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should throw error if cookies is not defined', () => {
        request.cookies = undefined;

        expect(() => verifyJwtToken(request, response, next)).toThrow();
    });

    it('should send 403 status if JWT cookie is not defined', () => {
        request.cookies.jwtToken = undefined;
        response.sendStatus = sendStatusMock;

        verifyJwtToken(request, response, next);

        expect(sendStatusMock).toHaveBeenCalledTimes(1);
    });

    it('should use jsonwebtoken library to verify jwtToken', () => {
        verifyJwtToken(request, response, next);

        expect(jwt.verify).toHaveBeenCalledTimes(1);
        expect(jwt.verify).toHaveBeenCalledWith(request.cookies.jwtToken, process.env.JWT_SECRET);
    });

    it('should set the user on the request if jwt verification is successful', () => {
        const user = {};
        jwt.verify.mockReturnValue(user);

        verifyJwtToken(request, response, next);

        expect(request.user).toBeDefined();
    });

    it('should call next() after jwt verification is successful', () => {
        const user = {};
        jwt.verify.mockReturnValue(user);

        verifyJwtToken(request, response, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should clear jwtToken cookie if error is thrown during jwt verification', () => {
        jwt.verify.mockImplementation(() => {
            throw new Error();
        });

        verifyJwtToken(request, response, next);

        expect(clearCookieMock).toHaveBeenCalledTimes(1);
    });

    
    it('should redirect to homepage if error is thrown during jwt verification', () => {
        const homepageUrl = '/';
        jwt.verify.mockImplementation(() => {
            throw new Error();
        });

        verifyJwtToken(request, response, next);

        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(redirectMock).toHaveBeenCalledWith(homepageUrl);
    });

});

const userService = require('../../application/services/userService');
import * as databaseService from '../../application/services/databaseService.js';
const UserModel = require('../../application/models/user');
const jwt = require('jsonwebtoken');
import Chance from 'chance'
const chance = Chance();;

jest.mock('jsonwebtoken');

describe('userService', () => {
    let jwtToken;
    let jwtSecret;
    let userAttributes;

    beforeEach(() => {
        jest.resetAllMocks();
        userAttributes = {
            email: chance.email(),
            password: chance.string({min: 8})
        };
        jwtToken = chance.string();
        jwtSecret = chance.string();
    });

    beforeAll(async () => {
        await databaseService.connectToTestMongoDatabase();
    });

    afterEach(async () => {
        await databaseService.clearDatabase();
    });

    afterAll(async () => {
        await databaseService.closeDatabase();
    });

    it('should save user to database', async () => {
        userAttributes = {
            email: 'test@gmail.com',
            password: '12345678'
        };
        const {_id} = await userService.createUser(userAttributes);
    
        const userFromDatabase = await UserModel.findById(_id);
    
        expect(userFromDatabase.email).toBe(userAttributes.email.toUpperCase());
        expect(userFromDatabase.password).toBe(userAttributes.password);
    });


    it('should not login user if jwtToken is undefined', () => {
        jwtToken = undefined;

        const isLoggedIn = userService.isUserLoggedIn(jwtToken, jwtSecret);

        expect(isLoggedIn).toBeFalsy();
    });

    it('should not login user if jwtToken does not verify', () => {
        jwt.verify.mockImplementation(() => {
            throw new Error();
        });

        const isLoggedIn = userService.isUserLoggedIn(jwtToken, jwtSecret);

        expect(isLoggedIn).toBeFalsy();
    });

    it('should login user if jwtToken is valid', () => {
        const user = {};
        jwt.verify.mockReturnValue(user);

        const isLoggedIn = userService.isUserLoggedIn(jwtToken, jwtSecret);

        expect(isLoggedIn).toBeTruthy();
    });

    describe('getUserInitials()', () => {
        it('should return an empty string if user is not defined', () => {
            const undefinedUser = undefined;
            const expectedUserCredentials = '';

            const actualUserCredentials = userService.getUserInitials(undefinedUser);

            expect(actualUserCredentials).toBe(expectedUserCredentials);
        });

        it('should return an empty string if users fullname is not defined', () => {
            userAttributes.fullName = undefined;
            const user = UserModel(userAttributes);
            const expectedUserCredentials = '';

            const actualUserCredentials = userService.getUserInitials(user);

            expect(actualUserCredentials).toBe(expectedUserCredentials);
        });

        it('should return a single character if their fullName is only a single word', () => {
            const firstName = chance.word();
            userAttributes.fullName = firstName;
            const user = UserModel(userAttributes);
            const expectedUserCredentials = userAttributes.fullName[0];

            const actualUserCredentials = userService.getUserInitials(user);

            expect(actualUserCredentials).toBe(expectedUserCredentials);
        });

        it('should return the first character of their first and last name', () => {
            const firstName = chance.word();
            const lastName = chance.word();
            userAttributes.fullName = `${firstName} ${lastName}`;
            const user = UserModel(userAttributes);
            const expectedUserCredentials = firstName[0] + lastName[0];

            const actualUserCredentials = userService.getUserInitials(user);

            expect(actualUserCredentials).toBe(expectedUserCredentials);
        });

        it('should only return the first character of their first and last name and ignore their middle name(s)', () => {
            const firstName = chance.word();
            const middleName = chance.word();
            const lastName = chance.word();
            userAttributes.fullName = `${firstName} ${middleName} ${lastName}`;
            const user = UserModel(userAttributes);
            const expectedUserCredentials = firstName[0] + lastName[0];

            const actualUserCredentials = userService.getUserInitials(user);

            expect(actualUserCredentials).toBe(expectedUserCredentials);
        });

    });

    describe('getProfilePictureUrl()', () => {
        it('should return an empty string if user does not exist', () => {
            const undefinedUser = undefined;
            const expectedProfilePictureUrl = '';

            const actualProfilePictureUrl = userService.getProfilePictureUrl(undefinedUser);

            expect(actualProfilePictureUrl).toBe(expectedProfilePictureUrl);
        });

        it('should return an empty string if profilePicture.data is not defined', () => {
            const invalidImageData = undefined;
            userAttributes.profilePicture = {
                contentType: chance.word(),
                data: invalidImageData
            };
            const user = UserModel(userAttributes);
            const expectedProfilePictureUrl = '';

            const actualProfilePictureUrl = userService.getProfilePictureUrl(user);

            expect(actualProfilePictureUrl).toBe(expectedProfilePictureUrl);
        });

        it('should return an empty string if profilePicture.contentType is not defined', () => {
            const invalidContentType = undefined;
            userAttributes.profilePicture = {
                contentType: invalidContentType,
                data: chance.word()
            };
            const user = UserModel(userAttributes);
            const expectedProfilePictureUrl = '';

            const actualProfilePictureUrl = userService.getProfilePictureUrl(user);

            expect(actualProfilePictureUrl).toBe(expectedProfilePictureUrl);
        });

        it('should return a correct url', () => {
            const contentType = chance.word();
            const data = chance.word();

            userAttributes.profilePicture = {
                contentType: contentType,
                data: data
            };
            const user = UserModel(userAttributes);
            const expectedProfilePictureUrl = `data:image/${user.profilePicture.contentType};base64,${user.profilePicture.data.toString('base64')}`;

            const actualProfilePictureUrl = userService.getProfilePictureUrl(user);

            expect(actualProfilePictureUrl).toBe(expectedProfilePictureUrl);
        });
    });
});
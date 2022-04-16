const {createUser, isUserLoggedIn} = require('../../application/services/userService');
const databaseService = require('../../application/services/databaseService');
const UserModel = require('../../application/models/user');
const jwt = require('jsonwebtoken');
const chance = require('chance').Chance();

jest.mock('jsonwebtoken');

describe('userService', () => {
    let jwtToken;
    let jwtSecret;

    beforeEach(() => {
        jest.resetAllMocks();

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
        let userAttributes = {
            email: 'test@gmail.com',
            password: '12345678'
        };
        const {_id} = await createUser(userAttributes);
    
        const userFromDatabase = await UserModel.findById(_id);
    
        expect(userFromDatabase.email).toBe(userAttributes.email.toUpperCase());
        expect(userFromDatabase.password).toBe(userAttributes.password);
    });


    it('should not login user if jwtToken is undefined', () => {
        jwtToken = undefined;

        const isLoggedIn = isUserLoggedIn(jwtToken, jwtSecret);

        expect(isLoggedIn).toBeFalsy();
    });

    it('should not login user if jwtToken does not verify', () => {
        jwt.verify.mockImplementation(() => {
            throw new Error();
        });

        const isLoggedIn = isUserLoggedIn(jwtToken, jwtSecret);

        expect(isLoggedIn).toBeFalsy();
    });

    it('should login user if jwtToken is valid', () => {
        const user = {};
        jwt.verify.mockReturnValue(user);

        const isLoggedIn = isUserLoggedIn(jwtToken, jwtSecret);

        expect(isLoggedIn).toBeTruthy();
    });
});
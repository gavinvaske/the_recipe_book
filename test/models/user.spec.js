const chance = require('chance').Chance();
const UserModel = require('../../application/models/user');

const AVAILABLE_USER_TYPES = [
    'USER',
    'ADMIN'
];

const PASSWORD_MIN_LENGTH = 8;

describe('validation', () => {
    let userAttributes;

    beforeEach(() => {
        userAttributes = {
            email: chance.email(),
            password: chance.string({ length: PASSWORD_MIN_LENGTH }),
            userType: chance.pickone(AVAILABLE_USER_TYPES)
        }
    });
    describe('successful validation', () => {
        it('should succeed when required attributes are defined', () => {
            const user = new UserModel(userAttributes);
    
            const error = user.validateSync();
    
            expect(error).toBe(undefined);
        });
    
        it('should default "userType" to "USER" if one is not provided', () => {
            delete userAttributes.userType;
            const user = new UserModel(userAttributes);
    
            const error = user.validateSync();
    
            expect(error).toBe(undefined);
            expect(user.userType).toBe('USER');
        });
    })

    describe('non-successful validation', () => {
        it('should not allow unknown "userType"', () => {
            userAttributes.userType = chance.string();
            const user = new UserModel(userAttributes);

            const error = user.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should not validate incorrectly formatted emails', () => {
            userAttributes.email = chance.string();
            const user = new UserModel(userAttributes);
    
            const error = user.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail validation if password is too short', () => {
            const shortPasswordLength = PASSWORD_MIN_LENGTH - 1;
            userAttributes.password = chance.string({ max: shortPasswordLength });
            const user = new UserModel(userAttributes);

            const error = user.validateSync();

            expect(error).not.toBe(undefined);
        });
    });
});
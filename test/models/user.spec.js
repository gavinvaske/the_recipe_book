import Chance from 'chance'
import UserModel from '../../application/models/user';
import * as testDataGenerator from '../testDataGenerator.js';

const chance = Chance();
const PASSWORD_MIN_LENGTH = 8;

describe('validation', () => {
    let userAttributes;

    beforeEach(() => {
        userAttributes = testDataGenerator.mockData.User();
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
    });

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

    describe('attribute: username', () => {
        it('should validate successfully', () => {
            userAttributes.username = chance.word();
            const user = new UserModel(userAttributes);

            const error = user.validateSync();

            expect(error).toBe(undefined);
        });

        it('should fail if username contains a space', () => {
            userAttributes.username = chance.word() + ' ' + chance.word();
            const user = new UserModel(userAttributes);

            const error = user.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should trim whitespace around username', () => {
            const username = chance.word();
            userAttributes.username = ' ' + username + ' ';
            const user = new UserModel(userAttributes);

            const error = user.validateSync();

            expect(error).toBe(undefined);
            expect(user.username).toBe(username);
        });
    });

    describe('attribute: fullName', () => {
        it('should trim whitespace', () => {
            const fullName = chance.word();
            userAttributes.fullName = ' ' + fullName + ' ';
            const user = new UserModel(userAttributes);

            const error = user.validateSync();

            expect(error).toBe(undefined);
            expect(user.fullName).toBe(fullName);
        });
    });

    describe('attribute: jobRole', () => {
        it('should trim whitespace', () => {
            const jobRole = chance.word();
            userAttributes.jobRole = ' ' + jobRole + ' ';
            const user = new UserModel(userAttributes);

            const error = user.validateSync();

            expect(error).toBe(undefined);
            expect(user.jobRole).toBe(jobRole);
        });
    });

    describe('attribute: phoneNumber', () => {
        it('should not fail if phoneNumber is valid', () => {
            userAttributes.phoneNumber = chance.phone();
            const user = new UserModel(userAttributes);

            const error = user.validateSync();

            expect(error).toBe(undefined);
        });
        it('should trim whitespace', () => {
            const phoneNumber = chance.phone();
            userAttributes.phoneNumber = ' ' + phoneNumber + ' ';
            const user = new UserModel(userAttributes);

            user.validateSync();

            expect(user.phoneNumber).toBe(phoneNumber);
        });

        it('should fail if phone is invalid', () => {
            const invalidPhoneNumber = chance.word();
            userAttributes.phoneNumber = invalidPhoneNumber;
            const user = new UserModel(userAttributes);

            const error = user.validateSync();

            expect(error).not.toBe(undefined);
        });
    });

    describe('attribute: birthDate', () => {
        it('should not fail if date is valid', () => {
            const birthDate = chance.date({string: true});
            userAttributes.birthDate = birthDate;
            const user = new UserModel(userAttributes);

            const error = user.validateSync();

            expect(error).toBe(undefined);
        });

        it('should trim whitespace', () => {
            const birthDate = chance.date({string: true});
            userAttributes.birthDate = '  ' + birthDate + ' ';
            const user = new UserModel(userAttributes);

            user.validateSync();

            expect(new Date(user.birthDate).getTime() === new Date(birthDate).getTime()).toBeTruthy();
        });
    });
});
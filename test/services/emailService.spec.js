const emailService = require('../../application/services/emailService');
const chance = require('chance').Chance();

describe('reset password email', () => {
    let emailAddress, resetLink;

    beforeEach(() => {
        emailAddress = chance.email();
        resetLink = chance.url();
    });
    it('should throw if email is missing', () => {
        emailAddress = undefined;

        expect(() => emailService.sendPasswordResetEmail(emailAddress, resetLink)).toThrow();
    });

    it('should throw if resetLink is missing', () => {
        resetLink = undefined;
        
        expect(() => emailService.sendPasswordResetEmail(emailAddress, resetLink)).toThrow();
    });
});
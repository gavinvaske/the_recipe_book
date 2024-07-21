import Chance from 'chance'
const chance = Chance();
const contactSchema = require('../../application/schemas/contact');
import mongoose from 'mongoose'
const addressSchema = require('../../application/schemas/address');

describe('validation', () => {
    let contactAttributes,
        ContactModel,
        AddressModel;

    beforeEach(() => {
        contactAttributes = {
            fullName: chance.string(),
            phoneNumber: chance.phone(),
            phoneExtension: chance.integer(),
            email: chance.email(),
            contactStatus: chance.string(),
            notes: chance.string()
        };
        ContactModel = mongoose.model('Contact', contactSchema);
        AddressModel = mongoose.model('Address', addressSchema);
    });

    it('should validate if all attributes are defined successfully', () => {
        const contact = new ContactModel(contactAttributes);

        const error = contact.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: fullName', () => {
        it('should fail validation if attribute is undefined', () => {
            delete contactAttributes.fullName;
            const contact = new ContactModel(contactAttributes);

            const error = contact.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type String', () => {
            const contact = new ContactModel(contactAttributes);

            expect(contact.fullName).toEqual(expect.any(String));
        });

        it('should trim trailing or leading spaces', () => {
            const nameWithoutSpaces = contactAttributes.fullName;
            contactAttributes.fullName = '  ' + nameWithoutSpaces + ' ';
            const contact = new ContactModel(contactAttributes);

            expect(contact.fullName.toUpperCase()).toEqual(nameWithoutSpaces.toUpperCase());
        });

        it('should convert to upper case', () => {
            const lowerCaseName = chance.string().toLowerCase();
            contactAttributes.fullName = lowerCaseName;
            const contact = new ContactModel(contactAttributes);

            expect(contact.fullName).toEqual(lowerCaseName.toUpperCase());
        });
    });

    describe('attribute: phoneNumber', () => {
        it('should NOT fail validation if attribute is undefined', () => {
            delete contactAttributes.phoneNumber;
            const contact = new ContactModel(contactAttributes);

            const error = contact.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should fail validation if phone number is NOT VALID', () => {
            const invalidPhoneNumber = chance.string();
            contactAttributes.phoneNumber = invalidPhoneNumber;
            const contact = new ContactModel(contactAttributes);

            const error = contact.validateSync();

            expect(error).toBeDefined();
        });

        it('should pass validation if phone number IS VALID', () => {
            const validPhoneNumbers = ['(555) 999-7272', '444-999-8282'];
            contactAttributes.phoneNumber = chance.pickone(validPhoneNumbers);
            const contact = new ContactModel(contactAttributes);

            const error = contact.validateSync();

            expect(error).not.toBeDefined();
        });
    });

    describe('attribute: phoneExtension', () => {
        it('should NOT fail validation if attribute is undefined', () => {
            delete contactAttributes.phoneExtension;
            const contact = new ContactModel(contactAttributes);

            const error = contact.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should be of type Number', () => {
            const contact = new ContactModel(contactAttributes);

            expect(contact.phoneExtension).toEqual(expect.any(Number));
        });
    });

    describe('attribute: email', () => {
        it('should NOT fail validation if attribute is undefined', () => {
            delete contactAttributes.email;
            const contact = new ContactModel(contactAttributes);

            const error = contact.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should be of type String', () => {
            const contact = new ContactModel(contactAttributes);

            expect(contact.email).toEqual(expect.any(String));
        });

        it('should convert to upper case', () => {
            const lowerCaseEmail = chance.email().toLowerCase();
            contactAttributes.email = lowerCaseEmail;
            const contact = new ContactModel(contactAttributes);

            expect(contact.email).toEqual(lowerCaseEmail.toUpperCase());
        });

        it('should fail validation if an invalid email is used', () => {
            const invalidEmail = chance.integer().toString();
            contactAttributes.email = invalidEmail;
            const contact = new ContactModel(contactAttributes);

            const error = contact.validateSync();

            expect(error).toBeDefined();
        });

        it('should pass validation if a valid email is used', () => {
            const validEmail = chance.email();
            contactAttributes.email = validEmail;
            const contact = new ContactModel(contactAttributes);

            const error = contact.validateSync();

            expect(error).not.toBeDefined();
        });
    });

    describe('attribute: contactStatus', () => {
        it('should fail validation if attribute is undefined', () => {
            delete contactAttributes.contactStatus;
            const contact = new ContactModel(contactAttributes);

            const error = contact.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type String', () => {
            contactAttributes.contactStatus = chance.integer();
            const contact = new ContactModel(contactAttributes);

            expect(contact.contactStatus).toEqual(expect.any(String));
        });

        it('should convert to upper case', () => {
            const lowerCaseContactStatus = chance.email().toLowerCase();
            contactAttributes.contactStatus = lowerCaseContactStatus;
            const contact = new ContactModel(contactAttributes);

            expect(contact.contactStatus).toEqual(lowerCaseContactStatus.toUpperCase());
        });
    });

    describe('attribute: notes', () => {
        it('should fail validation if attribute is undefined', () => {
            delete contactAttributes.notes;
            const contact = new ContactModel(contactAttributes);

            const error = contact.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should be of type String', () => {
            contactAttributes.notes = chance.integer();
            const contact = new ContactModel(contactAttributes);

            expect(contact.notes).toEqual(expect.any(String));
        });
    });

    describe('attribute: position', () => {
        it('should NOT fail validation if attribute is undefined', () => {
            delete contactAttributes.position;
            const contact = new ContactModel(contactAttributes);

            const error = contact.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should be of type String', () => {
            contactAttributes.position = chance.integer();
            const contact = new ContactModel(contactAttributes);

            expect(contact.position).toEqual(expect.any(String));
        });
    });

    describe('attribute: location', () => {
        it('should NOT fail validation if attribute is undefined', () => {
            delete contactAttributes.location;
            const contact = new ContactModel(contactAttributes);

            const error = contact.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should be of type String', () => {
            const addressAttributes = {
                name: chance.string(),
                street: chance.string(),
                city: chance.string(),
                state: 'IOWA',
                zipCode: '80766'
            };
            const address = new AddressModel(addressAttributes);
            contactAttributes.location = address;
            const contact = new ContactModel(contactAttributes);

            expect(contact.location._id).not.toBe(undefined);
        });
    });
});
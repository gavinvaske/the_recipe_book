import Chance from 'chance'
const chance = Chance();;
const addressSchema = require('../../application/schemas/address');
import mongoose from 'mongoose'

describe('validation', () => {
    let addressAttributes, 
        AddressModel;

    beforeEach(() => {
        addressAttributes = {
            name: chance.string(),
            street: chance.string(),
            unitOrSuite: chance.string(),
            city: chance.string(),
            state: chance.string(),
            zipCode: '80426',
        };
        AddressModel = mongoose.model('Address', addressSchema);
    });

    it('should validate if all attributes are defined successfully', () => {
        const address = new AddressModel(addressAttributes);
    
        const error = address.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: name', () => {
        it('should fail validation if attribute is undefined', () => {
            delete addressAttributes.name;
            const address = new AddressModel(addressAttributes);
    
            const error = address.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type String', () => {
            const address = new AddressModel(addressAttributes);

            expect(address.name).toEqual(expect.any(String));
        });

        it('should trim trailing or leading spaces', () => {
            const nameWithoutSpaces = addressAttributes.name.toUpperCase();
            addressAttributes.name = '  ' + nameWithoutSpaces + ' ';
            const address = new AddressModel(addressAttributes);

            expect(address.name).toEqual(nameWithoutSpaces);
        });

        it('should convert to uppercase', () => {
            const lowerCaseName = chance.string().toLowerCase();
            addressAttributes.name = lowerCaseName;
            const address = new AddressModel(addressAttributes);

            expect(address.name).toEqual(lowerCaseName.toUpperCase());
        });
    });

    describe('attribute: street', () => {
        it('should fail validation if attribute is undefined', () => {
            delete addressAttributes.street;
            const address = new AddressModel(addressAttributes);
    
            const error = address.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type String', () => {
            const address = new AddressModel(addressAttributes);

            expect(address.street).toEqual(expect.any(String));
        });

        it('should convert to uppercase', () => {
            const lowerCaseStreet = chance.string().toLowerCase();
            addressAttributes.street = lowerCaseStreet;
            const address = new AddressModel(addressAttributes);

            expect(address.street).toEqual(lowerCaseStreet.toUpperCase());
        });
    });

    describe('attribute: unitOrSuite', () => {
        it('should NOT fail validation if attribute is not defined', () => {
            delete addressAttributes.unitOrSuite;
            const address = new AddressModel(addressAttributes);
    
            const error = address.validateSync();

            expect(error).toBeUndefined();
        });

        it('should be of type String', () => {
            const address = new AddressModel(addressAttributes);

            expect(address.unitOrSuite).toEqual(expect.any(String));
        });

        it('should convert to uppercase', () => {
            const lowerCaseUnitOrSuite = chance.string().toLowerCase();
            addressAttributes.unitOrSuite = lowerCaseUnitOrSuite;
            const address = new AddressModel(addressAttributes);

            expect(address.unitOrSuite).toEqual(lowerCaseUnitOrSuite.toUpperCase());
        });
    });

    describe('attribute: city', () => {
        it('should fail validation if attribute is not defined', () => {
            delete addressAttributes.city;
            const address = new AddressModel(addressAttributes);
    
            const error = address.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type String', () => {
            const address = new AddressModel(addressAttributes);

            expect(address.city).toEqual(expect.any(String));
        });

        it('should convert to uppercase', () => {
            const lowerCaseCity = chance.string().toLowerCase();
            addressAttributes.city = lowerCaseCity;
            const address = new AddressModel(addressAttributes);

            expect(address.city).toEqual(lowerCaseCity.toUpperCase());
        });
    });

    describe('attribute: zipCode', () => {
        it('should fail validation if attribute is not defined', () => {
            delete addressAttributes.zipCode;
            const address = new AddressModel(addressAttributes);
    
            const error = address.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type String', () => {
            const address = new AddressModel(addressAttributes);

            expect(address.zipCode).toEqual(expect.any(String));
        });

        it('should fail validation if value is an incorrectly formatted zip code', () => {
            const incorrectlyFormattedZipCodes = ['123', 'faerf', '5434-4324'];
            addressAttributes.zipCode = chance.pickone(incorrectlyFormattedZipCodes);
            const address = new AddressModel(addressAttributes);
    
            const error = address.validateSync();

            expect(error).toBeDefined();
        });

        it('should pass validation if value is a correctly formatted zip code', () => {
            const correctZipCodes = ['80426', '16735-1309', '16735 1309'];
            addressAttributes.zipCode = chance.pickone(correctZipCodes);
            const address = new AddressModel(addressAttributes);
    
            const error = address.validateSync();

            expect(error).not.toBeDefined();
        });
    });

    describe('attribute: state', () => {
        it('should fail validation if attribute is not defined', () => {
            delete addressAttributes.state;
            const address = new AddressModel(addressAttributes);
    
            const error = address.validateSync();

            expect(error).toBeDefined();
        });

        it('should convert to uppercase', () => {
            const lowerCaseState = chance.string().toLowerCase();
            addressAttributes.state = lowerCaseState;
            const address = new AddressModel(addressAttributes);

            expect(address.state).toEqual(lowerCaseState.toUpperCase());
        });

        it('should be of type String', () => {
            const address = new AddressModel(addressAttributes);

            expect(address.state).toEqual(expect.any(String));
        });
    });
});
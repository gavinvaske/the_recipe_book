const chance = require('chance').Chance();
const VendorModel = require('../../application/models/vendor');
const databaseService = require('../../application/services/databaseService');
const mongoose = require('mongoose');

describe('validation', () => {
    let vendorAttributes;

    beforeEach(() => {
        jest.resetAllMocks();

        addressAttributes = {
            name: chance.string(),
            street: chance.string(),
            unitOrSuite: chance.string(),
            city: chance.string(),
            state: chance.string(),
            zipCode: '80426',
        };

        vendorAttributes = {
            name: chance.string(),
            phoneNumber: chance.phone(),
            email: chance.email(),
            notes: chance.paragraph(),
            website: chance.url(),
            primaryContactName: chance.string(),
            primaryContactPhoneNumber: chance.phone(),
            primaryContactEmail: chance.email(),
            address: addressAttributes
        };
    });

    it('should validate when required attributes are defined', () => {
        const vendor = new VendorModel(vendorAttributes);

        const error = vendor.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: name', () => {
        it('should be required', () => {
            delete vendorAttributes.name;
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a string', () => {
            vendorAttributes.name = chance.string();
            
            const vendor = new VendorModel(vendorAttributes);
        
            expect(vendor.name).toEqual(expect.any(String));
        });

        it('should trim whitespace around "name"', () => {
            const name = chance.string();
            vendorAttributes.name = ' ' + name + ' ';

            const vendor = new VendorModel(vendorAttributes);

            expect(vendor.name).toBe(name);
        });
    });

    describe('attribute: phoneNumber', () => {
        it('should NOT be required', () => {
            delete vendorAttributes.phoneNumber;
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should pass validation if phoneNumber is valid', () => {
            vendorAttributes.phoneNumber = chance.phone();
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should fail validation if phoneNumber is not valid', () => {
            vendorAttributes.phoneNumber = chance.string();
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not fail validation if phoneNumber is empty', () => {
            vendorAttributes.phoneNumber = '';
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeUndefined();
        });
    });

    describe('attribute: email', () => {
        it('should NOT be required', () => {
            delete vendorAttributes.email;
            const vendor = new VendorModel(vendorAttributes);

            const error = vendor.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should pass validation if email is valid', () => {
            vendorAttributes.email = chance.email();
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();

            expect(error).toBeUndefined();
        });

        it('should fail validation if email is not valid', () => {
            vendorAttributes.email = chance.word();
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should not fail validation if email is empty', () => {
            vendorAttributes.email = '';
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeUndefined();
        });
    });

    describe('attribute: notes', () => {
        it('should NOT be required', () => {
            delete vendorAttributes.notes;
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should trim whitespace around "notes"', () => {
            const notes = chance.string();
            vendorAttributes.notes = ' ' + notes + ' ';
            
            const vendor = new VendorModel(vendorAttributes);
            
            expect(vendor.notes).toBe(notes);
        });
    });

    describe('attribute: website', () => {
        it('should NOT be required', () => {
            delete vendorAttributes.website;
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should trim whitespace around "website"', () => {
            const website = chance.string();
            vendorAttributes.website ='  ' + website + ' ';
            
            const vendor = new VendorModel(vendorAttributes);
            
            expect(vendor.website).toBe(website);
        });
    });

    describe('attribute: address', () => {
        it('should be required', () => {
            delete vendorAttributes.address;
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be an instance of a mongoose object', () => {
            const vendor = new VendorModel(vendorAttributes);

            expect(vendor.address._id).toEqual(expect.any(mongoose.Types.ObjectId));
            expect(vendor.address.street.toUpperCase()).toEqual(vendorAttributes.address.street.toUpperCase());
        });
    });

    describe('attribute: primaryContactName', () => {
        it('should be required', () => {
            delete vendorAttributes.primaryContactName;
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a string', () => {
            vendorAttributes.primaryContactName = chance.string();
            
            const vendor = new VendorModel(vendorAttributes);
            
            expect(vendor.primaryContactName).toEqual(expect.any(String));
        });
    });

    describe('attribute: primaryContactPhoneNumber', () => {
        it('should be required', () => {
            delete vendorAttributes.primaryContactPhoneNumber;
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should pass validation if primaryContactPhoneNumber is valid', () => {
            vendorAttributes.primaryContactPhoneNumber = chance.phone();
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();

            expect(error).toBeUndefined();
        });
        
        it('should fail validation if primaryContactPhoneNumber is not a valid phone number', () => {
            const invalidPhoneNumber = chance.string();
            vendorAttributes.primaryContactPhoneNumber = invalidPhoneNumber;
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('attribute: primaryContactEmail', () => {
        it('should be required', () => {
            delete vendorAttributes.primaryContactEmail;
            const vendor = new VendorModel(vendorAttributes);

            const error = vendor.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should pass validation if primaryContactEmail is valid', () => {
            vendorAttributes.primaryContactEmail = chance.email();
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();

            expect(error).toBeUndefined();
        });

        it('should fail validation if primaryContactEmail is not a valid email', () => {
            const invalidEmail = chance.string();
            vendorAttributes.primaryContactEmail = invalidEmail;
            const vendor = new VendorModel(vendorAttributes);
            
            const error = vendor.validateSync();
            
            expect(error).toBeDefined();
        });
    });

    describe('verify timestamps on created object', () => {
        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        describe('verify timestamps on created object', () => {
            it('should have a "createdAt" attribute once object is saved', async () => {
                const vendor = new VendorModel(vendorAttributes);
                let savedVendor = await vendor.save({ validateBeforeSave: false });

                expect(savedVendor.createdAt).toBeDefined();
                expect(savedVendor.updatedAt).toBeDefined();
            });
        });
    });
});
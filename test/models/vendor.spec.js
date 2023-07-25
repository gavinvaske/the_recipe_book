const chance = require('chance').Chance();
const VendorModel = require('../../application/models/vendor');

describe('validation', () => {
    let vendorAttributes;

    beforeEach(() => {
        jest.resetAllMocks();
        vendorAttributes = {
            name: chance.string(),
            phoneNumber: chance.phone(),
            email: chance.email(),
            notes: chance.paragraph(),
            website: chance.url(),
            primaryContactName: chance.string(),
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
});
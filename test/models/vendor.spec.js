const chance = require('chance').Chance();
const VendorModel = require('../../application/models/vendor');

describe('validation', () => {
    let vendorAttributes;

    beforeEach(() => {
        jest.resetAllMocks();
        vendorAttributes = {
            name: chance.string()
        };
    });

    describe('successful validation', () => {
        it('should validate when required attributes are defined', () => {
            const vendor = new VendorModel(vendorAttributes);
    
            const error = vendor.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should trim whitespace around "name"', () => {
            const name = chance.string();
            vendorAttributes.name = ' ' + name + ' ';

            const vendor = new VendorModel(vendorAttributes);

            expect(vendor.name).toBe(name);
        });
    });
});
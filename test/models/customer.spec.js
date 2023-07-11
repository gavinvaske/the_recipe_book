const chance = require('chance').Chance();
const CustomerModel = require('../../application/models/customer');
const databaseService = require('../../application/services/databaseService');

const mongoose = require('mongoose');

function getAddress() {
    return {
        name: chance.string(),
        street: chance.address(),
        city: chance.city(),
        state: chance.state(),
        zipCode: chance.zip(),
        overRun: chance.bool()
    };
}

function getContact() {
    return {
        fullName: chance.string(),
        contactStatus: chance.string()
    };
}
describe('validation', () => {
    let customerAttributes;

    beforeEach(() => {
        customerAttributes = {
            name: chance.string(),
            notes: chance.string(),
            overRun: chance.bool()
        };
    });

    it('should validate if all attributes are defined successfully', () => {
        const customer = new CustomerModel(customerAttributes);

        const error = customer.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: name', () => {
        it('should fail validation if attribute is undefined', () => {
            delete customerAttributes.name;
            const customer = new CustomerModel(customerAttributes);

            const error = customer.validateSync();

            expect(error).toBeDefined();
        });

        it('should be of type String', () => {
            const customer = new CustomerModel(customerAttributes);

            expect(customer.name).toEqual(expect.any(String));
        });

        it('should trim the string', () => {
            const nameWithoutSpaces = chance.string();
            customerAttributes.name = '  ' + nameWithoutSpaces + ' ';

            const customer = new CustomerModel(customerAttributes);

            expect(customer.name).toEqual(nameWithoutSpaces);
        });
    });

    describe('attribute: notes', () => {
        it('should NOT fail validation if attribute is undefined', () => {
            delete customerAttributes.notes;
            const customer = new CustomerModel(customerAttributes);

            const error = customer.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should be of type String', () => {
            const customer = new CustomerModel(customerAttributes);

            expect(customer.notes).toEqual(expect.any(String));
        });

        it('should trim the string', () => {
            const notesWithoutSpaces = chance.string();
            customerAttributes.notes = '  ' + notesWithoutSpaces + ' ';

            const customer = new CustomerModel(customerAttributes);

            expect(customer.notes).toEqual(notesWithoutSpaces);
        });
    });

    describe('attribute: businessLocations', () => {
        it('should NOT fail validation if attribute is undefined', () => {
            delete customerAttributes.businessLocations;
            const customer = new CustomerModel(customerAttributes);

            const error = customer.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should be an array with a single mongoose object', () => {
            customerAttributes.businessLocations = [getAddress()];

            const { businessLocations } = new CustomerModel(customerAttributes);

            expect(businessLocations.length).toEqual(1);
            expect(businessLocations[0]._id).toBeDefined();
        });

        it('should be an array with a multiple mongoose object', () => {
            const addresses = [getAddress(), getAddress()];
            customerAttributes.businessLocations = addresses;

            const { businessLocations } = new CustomerModel(customerAttributes);

            expect(businessLocations.length).toEqual(addresses.length);

            expect(businessLocations[0]._id).toBeDefined();
            expect(businessLocations[1]._id).toBeDefined();
        });

        it('should default to an empty array', () => {
            delete customerAttributes.businessLocations;

            const { businessLocations } = new CustomerModel(customerAttributes);

            expect(businessLocations).toEqual([]);
        });
    });

    describe('attribute: shippingLocations', () => {
        it('should NOT fail validation if attribute is undefined', () => {
            delete customerAttributes.shippingLocations;
            const customer = new CustomerModel(customerAttributes);

            const error = customer.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should be an array with a single mongoose object', () => {
            customerAttributes.shippingLocations = [getAddress()];

            const { shippingLocations } = new CustomerModel(customerAttributes);

            expect(shippingLocations.length).toEqual(1);
            expect(shippingLocations[0]._id).toBeDefined();
        });

        it('should be an array with a multiple mongoose object', () => {
            const addresses = [getAddress(), getAddress()];
            customerAttributes.shippingLocations = addresses;

            const { shippingLocations } = new CustomerModel(customerAttributes);

            expect(shippingLocations.length).toEqual(addresses.length);

            expect(shippingLocations[0]._id).toBeDefined();
            expect(shippingLocations[1]._id).toBeDefined();
        });

        it('should default to an empty array', () => {
            delete customerAttributes.shippingLocations;

            const { shippingLocations } = new CustomerModel(customerAttributes);

            expect(shippingLocations).toEqual([]);
        });
    });

    describe('attribute: billingLocations', () => {
        it('should NOT fail validation if attribute is undefined', () => {
            delete customerAttributes.billingLocations;
            const customer = new CustomerModel(customerAttributes);

            const error = customer.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should be an array with a single mongoose object', () => {
            customerAttributes.billingLocations = [getAddress()];

            const { billingLocations } = new CustomerModel(customerAttributes);

            expect(billingLocations.length).toEqual(1);
            expect(billingLocations[0]._id).toBeDefined();
        });

        it('should be an array with a multiple mongoose object', () => {
            const addresses = [getAddress(), getAddress()];
            customerAttributes.billingLocations = addresses;

            const { billingLocations } = new CustomerModel(customerAttributes);

            expect(billingLocations.length).toEqual(addresses.length);

            expect(billingLocations[0]._id).toBeDefined();
            expect(billingLocations[1]._id).toBeDefined();
        });

        it('should default to an empty array', () => {
            delete customerAttributes.billingLocations;

            const { billingLocations } = new CustomerModel(customerAttributes);

            expect(billingLocations).toEqual([]);
        });
    });

    describe('attribute: contacts', () => {
        it('should NOT fail validation if attribute is undefined', () => {
            delete customerAttributes.contacts;
            const customer = new CustomerModel(customerAttributes);

            const error = customer.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should be an array with a single mongoose object', () => {
            customerAttributes.contacts = [getAddress()];

            const { contacts } = new CustomerModel(customerAttributes);

            expect(contacts.length).toEqual(1);
            expect(contacts[0]._id).toBeDefined();
        });

        it('should be an array with a multiple mongoose object', () => {
            customerAttributes.contacts = [getContact(), getContact()];

            const { contacts } = new CustomerModel(customerAttributes);

            expect(contacts.length).toEqual(contacts.length);

            expect(contacts[0]._id).toBeDefined();
            expect(contacts[1]._id).toBeDefined();
        });

        it('should default to an empty array', () => {
            delete customerAttributes.billingLocations;

            const { contacts } = new CustomerModel(customerAttributes);

            expect(contacts).toEqual([]);
        });
    });

    describe('attribute: overRun', () => {
        it('should NOT fail validation if attribute is undefined', () => {
            delete customerAttributes.overRun;
            const customer = new CustomerModel(customerAttributes);

            const error = customer.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should be of type Boolean', () => {
            const customer = new CustomerModel(customerAttributes);

            expect(customer.overRun).toEqual(expect.any(Boolean));
        });
    });

    describe('attribute: creditTerms', () => {
        it('should NOT fail validation if attribute is undefined', () => {
            delete customerAttributes.creditTerms;
            const customer = new CustomerModel(customerAttributes);

            const error = customer.validateSync();

            expect(error).not.toBeDefined();
        });

        it('should handle storing an array of mongoose object IDs', () => {
            const creditTerms = [
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId()
            ];
            customerAttributes.creditTerms = creditTerms;

            const customer = new CustomerModel(customerAttributes);

            expect(customer.creditTerms.length).toEqual(creditTerms.length);
            expect(customer.creditTerms[0]).toEqual(creditTerms[0]);
            expect(customer.creditTerms[1]).toEqual(creditTerms[1]);
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
                const customer = new CustomerModel(customerAttributes);
                let savedCustomer = await customer.save({ validateBeforeSave: false });

                expect(savedCustomer.createdAt).toBeDefined();
                expect(savedCustomer.updatedAt).toBeDefined();
            });
        });
    });
});
const deliveryMethods = require('../../application/enums/deliveryMethods');

describe('File deliveryMethods', () => {
    it('should have the correct value for SHIPPING_DELIVERY_METHOD', () => {
        const expectedValue = 'SHIPPING';

        expect(deliveryMethods.SHIPPING_DELIVERY_METHOD).toEqual(expectedValue);
    });

    it('should have the correct value for PICKUP_DELIVERY_METHOD', () => {
        const expectedValue = 'PICKUP';

        expect(deliveryMethods.PICKUP_DELIVERY_METHOD).toEqual(expectedValue);
    });

    it('should have the correct value for DELIVERY_METHODS', () => {
        const expectedValue = [
            deliveryMethods.SHIPPING_DELIVERY_METHOD, 
            deliveryMethods.PICKUP_DELIVERY_METHOD
        ];

        expect(deliveryMethods.DELIVERY_METHODS).toEqual(expectedValue);
    });
});
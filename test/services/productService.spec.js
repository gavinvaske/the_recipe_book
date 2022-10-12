const productService = require('../../application/services/productService');
const chance = require('chance').Chance();

describe('productService test suite', () => {
    let products,
        ticket;

    beforeEach(() => {
        products = [];
        ticket = {
            products
        }
    });

    describe('selectProductFromTicket()', () => {
        it('should not throw error if products are not defined', () => {
            const productNumber = chance.string();
            delete ticket.products;

            expect(() => productService.selectProductFromTicket(ticket, productNumber)).not.toThrow();
        });

        it('should find the correct product given a productNumber', () => {
            const productNumber = chance.string();
            const expectedProduct = createProduct({
                productNumber
            });
            ticket.products = [
                createProduct(),
                expectedProduct,
                createProduct()
            ];

            const actualProduct = productService.selectProductFromTicket(ticket, productNumber);

            expect(actualProduct).toBe(expectedProduct);
        });
    });
});

function createProduct(productAttributes) {
    return {
        ...productAttributes
    };
}
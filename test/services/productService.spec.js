import * as productService from '../../application/services/productService';
import Chance from 'chance';
import mongoose from 'mongoose';

const chance = Chance();

describe('productService test suite', () => {
    let products,
        ticket;

    beforeEach(() => {
        products = [];
        ticket = {
            products
        };
    });

    describe('selectProductFromTicket()', () => {
        it('should not throw error if products are not defined', () => {
            const productNumber = chance.string();
            delete ticket.products;

            expect(() => productService.selectProductFromTicket(ticket, productNumber)).not.toThrow();
        });

        it('should not throw error if ticket is not defined', () => {
            const productNumber = chance.string();
            ticket = undefined;

            expect(() => productService.selectProductFromTicket(ticket, productNumber)).not.toThrow();
        });

        it('should find the correct product given a productNumber', () => {
            const _id = new mongoose.Types.ObjectId();
            const expectedProduct = createProduct({
                _id
            });
            ticket.products = [
                createProduct(),
                expectedProduct,
                createProduct()
            ];

            const actualProduct = productService.selectProductFromTicket(ticket, _id.toString());

            expect(actualProduct).toBe(expectedProduct);
        });
    });
});

function createProduct(productAttributes) {
    return {
        ...productAttributes
    };
}
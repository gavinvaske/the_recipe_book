const chance = require('chance').Chance();
const MaterialModel = require('../../application/models/material');
const mongoose = require('mongoose');
const databaseService = require('../../application/services/databaseService');

describe('validation', () => {
    let materialAttributes;

    beforeEach(() => {
        materialAttributes = {
            name: chance.string(),
            materialId: chance.string(),
            vendor: new mongoose.Types.ObjectId(),
            materialCategory: new mongoose.Types.ObjectId(),
            thickness: chance.integer({ min: 0 }),
            weight: chance.integer({ min: 0 }),
            materialCost: `${chance.floating({ min: 0 })}`,
            freightCost: `${chance.floating({ min: 0 })}`,
            width: chance.d12(),
            faceColor: chance.string(),
            adhesive: chance.string(),
            adhesiveCategory: new mongoose.Types.ObjectId(),
            quotePrice: chance.integer({ min: 0 }),
            description: chance.string(),
            whenToUse: chance.string(),
            alternativeStock: chance.string(),
            length: chance.integer({ min: 0 }),
        };
    });

    it('should validate when required attributes are defined', () => {
        const finish = new MaterialModel(materialAttributes);

        const error = finish.validateSync();

        expect(error).toBe(undefined);
    });

    describe('attribute: name', () => {
        it('should be a string', () => {
            materialAttributes.name = chance.integer();
            const material = new MaterialModel(materialAttributes);

            expect(material.name).toEqual(expect.any(String));
        });

        it('should trim whitespace around "name"', () => {
            const name = chance.string();
            materialAttributes.name = ' ' + name + ' ';

            const material = new MaterialModel(materialAttributes);

            expect(material.name).toBe(name.toUpperCase());
        });

        it('should uppercase the attribute', () => {
            const lowerCaseName = chance.string().toLowerCase();
            materialAttributes.name = lowerCaseName;

            const material = new MaterialModel(materialAttributes);

            expect(material.name).toBe(lowerCaseName.toUpperCase());
        });
    });

    describe('attribute: materialId', () => {
        it('should be a string', () => {
            const material = new MaterialModel(materialAttributes);

            expect(material.materialId).toEqual(expect.any(String));
        });

        it('should be required', () => {
            delete materialAttributes.materialId;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).not.toBe(undefined);
        });

        it('should trim whitespace', () => {
            const materialIdWithoutWhitespace = materialAttributes.materialId;
            materialAttributes.materialId = '  ' + materialIdWithoutWhitespace + '  ';

            const material = new MaterialModel(materialAttributes);

            expect(material.materialId).toEqual(materialIdWithoutWhitespace);
        });
    });

    describe('attribute: vendor', () => {
        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.vendor;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail validation if the datatype is not a mongoose object ID', () => {
            const invalidVendor = chance.word();
            materialAttributes.vendor = invalidVendor;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should pass validation if value is a mongoose object id', () => {
            materialAttributes.vendor = new mongoose.Types.ObjectId();
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeUndefined();
        });
    });

    describe('attribute: materialCategory', () => {
        it('should have attribute', () => {
            materialAttributes.materialCategory = new mongoose.Types.ObjectId();

            const material = new MaterialModel(materialAttributes);

            expect(material.materialCategory).toBeDefined();
        });

        it('should fail validation if attribute is the wrong type', () => {
            materialAttributes.materialCategory = chance.word();
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should handle storing valid mongoose object Ids', () => {
            materialAttributes.materialCategory = new mongoose.Types.ObjectId();
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeUndefined();
            expect(mongoose.Types.ObjectId.isValid(material.materialCategory)).toBe(true);
        });

        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.materialCategory;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: thickness', () => {
        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.thickness;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail if attribute is negative', () => {
            materialAttributes.thickness = chance.integer({ max: -1 });
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a Number', () => {
            const material = new MaterialModel(materialAttributes);

            expect(material.thickness).toEqual(expect.any(Number));
        });
    });

    describe('attribute: weight', () => {
        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.weight;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail if attribute is negative', () => {
            materialAttributes.weight = chance.integer({ max: -1 });
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a Number', () => {
            const material = new MaterialModel(materialAttributes);

            expect(material.weight).toEqual(expect.any(Number));
        });
    });

    describe('attribute: materialCost', () => {
        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.materialCost;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail if attribute is negative', () => {
            materialAttributes.materialCost = chance.integer({ max: -1 });
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a Number', () => {
            const material = new MaterialModel(materialAttributes);

            expect(material.materialCost).toEqual(expect.any(Number));
        });

        it('should not store floating points of more than 2 decimal places', () => {
            const priceWithWayTooManyDecimals = '100.11999999999';
            materialAttributes.materialCost = priceWithWayTooManyDecimals;
            const expectedPrice = 100.11;

            const material = new MaterialModel(materialAttributes);

            expect(material.materialCost).toEqual(expectedPrice);
        });

        it('should remove commas from price', () => {
            const currencyWithCommas = '1,192,123.83';
            const currencyWithoutCommas = 1192123.83;
            materialAttributes.materialCost = currencyWithCommas;

            const material = new MaterialModel(materialAttributes);

            expect(material.materialCost).toEqual(currencyWithoutCommas);
        });

        it('should fail validation if price is a non-number', () => {
            const invalidPrice = chance.word();
            materialAttributes.materialCost = invalidPrice;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail validation if price is empty', () => {
            const invalidPrice = '';
            materialAttributes.materialCost = invalidPrice;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: freightCost', () => {
        it('should be a Number', () => {
            const material = new MaterialModel(materialAttributes);

            expect(material.freightCost).toEqual(expect.any(Number));
        });

        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.freightCost;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail if attribute is negative', () => {
            materialAttributes.freightCost = chance.integer({ max: -1 });
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should not store floating points of more than 2 decimal places', () => {
            const priceWithWayTooManyDecimals = '100.11999999999';
            materialAttributes.freightCost = priceWithWayTooManyDecimals;
            const expectedPrice = 100.11;

            const material = new MaterialModel(materialAttributes);

            expect(material.freightCost).toEqual(expectedPrice);
        });

        it('should remove commas from price', () => {
            const currencyWithCommas = '1,192,123.83';
            const currencyWithoutCommas = 1192123.83;
            materialAttributes.freightCost = currencyWithCommas;

            const material = new MaterialModel(materialAttributes);

            expect(material.freightCost).toEqual(currencyWithoutCommas);
        });

        it('should fail validation if price is a non-number', () => {
            const invalidPrice = chance.word();
            materialAttributes.freightCost = invalidPrice;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail validation if price is empty', () => {
            const invalidPrice = '';
            materialAttributes.freightCost = invalidPrice;
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: width', () => {
        it('should be a Number', () => {
            const material = new MaterialModel(materialAttributes);

            expect(material.width).toEqual(expect.any(Number));
        });

        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.width;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail if attribute is negative', () => {
            materialAttributes.width = chance.integer({ max: -1 });
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: materialCost', () => {
        it('should be a String', () => {
            const material = new MaterialModel(materialAttributes);

            expect(material.faceColor).toEqual(expect.any(String));
        });

        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.faceColor;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: adhesive', () => {
        it('should be a String', () => {
            const material = new MaterialModel(materialAttributes);

            expect(material.adhesive).toEqual(expect.any(String));
        });

        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.adhesive;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: adhesiveCategory', () => {
        it('should be a mongoose object ID', () => {
            const material = new MaterialModel(materialAttributes);

            expect(mongoose.Types.ObjectId.isValid(material.adhesiveCategory)).toBe(true);
        });

        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.adhesiveCategory;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: quotePrice', () => {
        it('should be a Number', () => {
            const material = new MaterialModel(materialAttributes);

            expect(material.quotePrice).toEqual(expect.any(Number));
        });

        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.quotePrice;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should fail if attribute is negative', () => {
            materialAttributes.quotePrice = chance.integer({ max: -1 });
            const material = new MaterialModel(materialAttributes);

            const error = material.validateSync();

            expect(error).toBeDefined();
        });

        it('should not store floating points of more than 2 decimal places', () => {
            const priceWithWayTooManyDecimals = '888.11999999999';
            materialAttributes.quotePrice = priceWithWayTooManyDecimals;
            const expectedPrice = 888.11;

            const material = new MaterialModel(materialAttributes);

            expect(material.quotePrice).toEqual(expectedPrice);
        });

        it('should remove commas from price', () => {
            const currencyWithCommas = '7,194,123.83';
            const currencyWithoutCommas = 7194123.83;
            materialAttributes.freightCost = currencyWithCommas;

            const material = new MaterialModel(materialAttributes);

            expect(material.freightCost).toEqual(currencyWithoutCommas);
        });
    });

    describe('attribute: description', () => {
        it('should be a Number', () => {
            const material = new MaterialModel(materialAttributes);

            expect(material.description).toEqual(expect.any(String));
        });

        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.description;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: whenToUse', () => {
        it('should be a Number', () => {
            const material = new MaterialModel(materialAttributes);

            expect(material.whenToUse).toEqual(expect.any(String));
        });

        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.whenToUse;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeDefined();
        });
    });

    describe('attribute: alternativeStock', () => {
        it('should be a Number', () => {
            const material = new MaterialModel(materialAttributes);

            expect(material.alternativeStock).toEqual(expect.any(String));
        });

        it('should NOT FAIL validation if attribute is undefined', () => {
            delete materialAttributes.alternativeStock;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

            expect(error).toBeUndefined();
        });
    });

    describe('attribute: length', () => {
        it('should fail validation if attribute is undefined', () => {
            delete materialAttributes.length;
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a Number', () => {
            const material = new MaterialModel(materialAttributes);
            
            expect(material.length).toEqual(expect.any(Number));
        });

        it('should fail validation if attribute is negative', () => {
            materialAttributes.length = chance.integer({ max: -1 });
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should fail validation if attribute is not an integer', () => {
            materialAttributes.length = chance.floating({ min: 0 });
            const material = new MaterialModel(materialAttributes);
            
            const error = material.validateSync();

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
                const material = new MaterialModel(materialAttributes);
                let savedMaterial = await material.save({ validateBeforeSave: false });

                expect(savedMaterial.createdAt).toBeDefined();
                expect(savedMaterial.updatedAt).toBeDefined();
            });
        });
    });
});
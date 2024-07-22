import Chance from 'chance';
import packagingSchema from '../../application/schemas/packagingDetails';
import mongoose from 'mongoose';

const chance = Chance();

describe('File: packaging.js', () => {
    let packagingAttributes,
        PackagingModel;

    beforeEach(() => {
        packagingAttributes = {
            rollsPerLayer: chance.d100(),
            layersPerBox: chance.d100(),
            rollsPerBox: chance.d100(),
            totalBoxes: chance.d100(),
            layerLayoutImagePath: chance.word()
        };
        PackagingModel = mongoose.model('Packaging', packagingSchema);
    });

    it('should validate if all attributes are defined successfully', async () => {
        const packaging = new PackagingModel(packagingAttributes);

        const error = packaging.validateSync();

        expect(error).toBeUndefined();
    });

    describe('attribute: rollsPerLayer', () => {
        it('should be required', () => {
            delete packagingAttributes.rollsPerLayer;
            const packaging = new PackagingModel(packagingAttributes);
            
            const error = packaging.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            const rollsPerLayer = chance.d100();
            packagingAttributes.rollsPerLayer = rollsPerLayer;
            
            const packaging = new PackagingModel(packagingAttributes);

            expect(packaging.rollsPerLayer).toEqual(rollsPerLayer);
        });
    });

    describe('attribute: layersPerBox', () => {
        it('should be required', () => {
            delete packagingAttributes.layersPerBox;
            const packaging = new PackagingModel(packagingAttributes);
            
            const error = packaging.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            const layersPerBox = chance.d100();
            packagingAttributes.layersPerBox = layersPerBox;
            
            const packaging = new PackagingModel(packagingAttributes);

            expect(packaging.layersPerBox).toEqual(layersPerBox);
        });
    });

    describe('attribute: rollsPerBox', () => {
        it('should be required', () => {
            delete packagingAttributes.rollsPerBox;
            const packaging = new PackagingModel(packagingAttributes);
            
            const error = packaging.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            const rollsPerBox = chance.d100();
            packagingAttributes.rollsPerBox = rollsPerBox;
            
            const packaging = new PackagingModel(packagingAttributes);

            expect(packaging.rollsPerBox).toEqual(rollsPerBox);
        });
    });

    describe('attribute: totalBoxes', () => {
        it('should be required', () => {
            delete packagingAttributes.totalBoxes;
            const packaging = new PackagingModel(packagingAttributes);
            
            const error = packaging.validateSync();
            
            expect(error).toBeDefined();
        });

        it('should be a number', () => {
            const totalBoxes = chance.d100();
            packagingAttributes.totalBoxes = totalBoxes;
            
            const packaging = new PackagingModel(packagingAttributes);

            expect(packaging.totalBoxes).toEqual(totalBoxes);
        });
    });

    describe('attribute: layerLayoutImagePath', () => {
        it('should NOT be required', () => {
            delete packagingAttributes.layerLayoutImagePath;
            const packaging = new PackagingModel(packagingAttributes);
            
            const error = packaging.validateSync();
            
            expect(error).toBeUndefined();
        });

        it('should be a string', () => {
            const shouldBeConvertedToString = chance.d100();
            packagingAttributes.layerLayoutImagePath = shouldBeConvertedToString;
            
            const packaging = new PackagingModel(packagingAttributes);
            
            expect(packaging.layerLayoutImagePath).toEqual(shouldBeConvertedToString.toString());
        });
    });
});
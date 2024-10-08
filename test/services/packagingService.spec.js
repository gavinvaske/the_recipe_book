import Chance from 'chance';
import * as packagingService from '../../application/api/services/packagingService.ts';
import { howManyCirclesCanFitInThisSquare as howManyCirclesCanFitInThisSquareMock } from '../../application/api/enums/circlesPerSquareEnum.ts';

const chance = Chance();
const ONE_EIGHTH_INCH_BUFFER = 0.125;


jest.mock('../../application/api/enums/circlesPerSquareEnum.ts', () => {
    return {
        howManyCirclesCanFitInThisSquare: jest.fn()
    };
});

describe('File: packagingService.js', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Function: getNumberOfLayers()', () => {
        const rollHeight = 12.33;
        let boxHeight;

        beforeEach(() => {
            boxHeight = chance.floating({ min: 0, max: 100}) + chance.floating({ min: 0, max: 100});
        });

        it('should return 0 if roll height is greater than box height', () => {
            const boxHeight = rollHeight - 1;

            const actualNumberOfLayers = packagingService.getNumberOfLayers(boxHeight, rollHeight);
            
            expect(actualNumberOfLayers).toEqual(0);
        });

        it('should return 0 if no layer can fit with more than a 1/8 inch buffer gap from the layer to the top of the box', () => {
            const slightlyLessThanOneEighthInch = (ONE_EIGHTH_INCH_BUFFER - 0.001); // eslint-disable-line no-magic-numbers
            boxHeight = rollHeight + slightlyLessThanOneEighthInch;
            const expectedNumberOfLayers = 0;

            const actualNumberOfLayers = packagingService.getNumberOfLayers(boxHeight, rollHeight);

            expect(actualNumberOfLayers).toEqual(expectedNumberOfLayers);
        });

        it('should allow layer if box has a 1/8 inch buffer', () => {
            boxHeight = rollHeight + ONE_EIGHTH_INCH_BUFFER;
            const expectedNumberOfLayers = 1;

            const actualNumberOfLayers = packagingService.getNumberOfLayers(boxHeight, rollHeight);
            
            expect(actualNumberOfLayers).toEqual(expectedNumberOfLayers);
        });

        it('should only compute integer multiples of layers', () => {
            const expectedNumberOfLayers = chance.d100();
            boxHeight = (rollHeight * expectedNumberOfLayers) + ONE_EIGHTH_INCH_BUFFER;

            const actualNumberOfLayers = packagingService.getNumberOfLayers(boxHeight, rollHeight);

            expect(actualNumberOfLayers).toEqual(expectedNumberOfLayers);
        });
    });

    describe('Function: getRollsPerLayer()', () => {
        it('should call helper function with rollDiameter + 1/8 inch buffer', () => {
            const boxSideLength = chance.d100();
            const rollDiameter = boxSideLength - 1;

            packagingService.getRollsPerLayer(rollDiameter, boxSideLength);

            expect(howManyCirclesCanFitInThisSquareMock).toHaveBeenCalledTimes(1);
            expect(howManyCirclesCanFitInThisSquareMock).toHaveBeenCalledWith(rollDiameter + ONE_EIGHTH_INCH_BUFFER, boxSideLength);
        });

        it('should return return 0 if rollDiameter is greater than boxSideLength', () => {
            const rollDiameter = chance.d100();
            const boxSideLength = rollDiameter - 1;

            const result = packagingService.getRollsPerLayer(rollDiameter, boxSideLength);

            expect(result).toEqual(0);
        });
    });

    describe('Function: getNumberOfBoxes()', () => {
        let rollsPerBox, numberOfRolls;

        beforeEach(() => {
            rollsPerBox = chance.d100();
            numberOfRolls = chance.d100();
        });

        it('should return null if rollsPerBox is not defined', () => {
            rollsPerBox = chance.pickone([undefined, null]);

            const actualNumberOfBoxes = packagingService.getNumberOfBoxes(rollsPerBox, numberOfRolls);

            expect(actualNumberOfBoxes).toEqual(null);
        });

        it('should return null if numberOfRolls is not defined', () => {
            numberOfRolls = chance.pickone([undefined, null]);
            
            const actualNumberOfBoxes = packagingService.getNumberOfBoxes(rollsPerBox, numberOfRolls);
            
            expect(actualNumberOfBoxes).toEqual(null);
        });

        it('should return 0 if number of numberOfRolls is 0', () => {
            numberOfRolls = 0;
            
            const actualNumberOfBoxes = packagingService.getNumberOfBoxes(rollsPerBox, numberOfRolls);
            
            expect(actualNumberOfBoxes).toEqual(0);
        });

        it('should return the correct number of boxes', () => {
            const expectedNumberOfBoxes = Math.ceil(numberOfRolls / rollsPerBox);
            
            const actualNumberOfBoxes = packagingService.getNumberOfBoxes(rollsPerBox, numberOfRolls);
            
            expect(actualNumberOfBoxes).not.toBeFalsy();
            expect(actualNumberOfBoxes).toEqual(expectedNumberOfBoxes);
        });
    });
});
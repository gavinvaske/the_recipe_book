const { howManyCirclesCanFitInThisSquare } = require('../../application/enums/circlesPerSquareEnum');

const chance = require('chance').Chance();

const SMALLEST_CIRCLE_RADIUS_SCALED_TO_FIT_IN_UNIT_SQUARE = 0.111382;
const LARGEST_CIRCLE_RADIUS_SCALED_TO_FIT_IN_UNIT_SQUARE = 0.500000;

function computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare) {
    const circleDiameterScaledToFitIntoUnitSquare = circleRadiusScaledToFitIntoUnitSquare * 2;

    return circleDiameterScaledToFitIntoUnitSquare * squareSideLength;
}

describe('File: circlesPerSquareEnum.js', () => {
    let squareSideLength;

    beforeEach(() => {
        squareSideLength = chance.d100();
    });

    describe('Function: howManyCirclesCanFitInThisSquare', () => {
        it('should return 0 if the circle cannot fit in the square', () => {
            const circleRadiusScaledToFitIntoUnitSquare = LARGEST_CIRCLE_RADIUS_SCALED_TO_FIT_IN_UNIT_SQUARE;
            const maxAllowedCircleDiameterToFitOneCircle = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const tinyNumber = 0.01;
            const expectedNumberOfCircles = 0;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameterToFitOneCircle + tinyNumber, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should throw an error if the number of circles cannot be computed', () => {
            const circleRadiusScaledToFitIntoUnitSquare = SMALLEST_CIRCLE_RADIUS_SCALED_TO_FIT_IN_UNIT_SQUARE;
            const circleDiameterToFitTheMaxNumberOfCirclesPerLayer = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const tinyNumber = 0.01;
            const tooSmallCircleDiameter = circleDiameterToFitTheMaxNumberOfCirclesPerLayer - tinyNumber;

            expect(() => howManyCirclesCanFitInThisSquare(tooSmallCircleDiameter, squareSideLength))
                .toThrow();
        });

        it('should return 1 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.500000;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 1;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 2 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.292893;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 2;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 3 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.254333;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 3;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 4 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.250000;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 4;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 5 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.207106;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 5;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 6 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.187680;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 6;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 7 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.174457;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 7;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 8 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.170540;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 8;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 9 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.166666;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 9;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 10 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.148204;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 10;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 11 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.142399;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 11;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 12 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.139958;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 12;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 13 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.133993;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 13;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 14 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.129331;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 14;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 15 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.127166;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 15;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 16 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.125000;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 16;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 17 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.117196;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 17;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 18 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.115521;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 18;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 19 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.112265;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 19;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });

        it('should return 20 numberOfCircles', () => {
            const circleRadiusScaledToFitIntoUnitSquare = 0.111382;
            const maxAllowedCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare);
            const expectedNumberOfCircles = 20;

            const actualNumberOfCircles = howManyCirclesCanFitInThisSquare(maxAllowedCircleDiameter, squareSideLength);

            expect(actualNumberOfCircles).toEqual(expectedNumberOfCircles);
        });
    });
});
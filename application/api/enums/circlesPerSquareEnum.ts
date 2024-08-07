/* eslint-disable no-magic-numbers */

const SMALLEST_CIRCLE_RADIUS_SCALED_TO_FIT_IN_UNIT_SQUARE = 0.111382;
const LARGEST_CIRCLE_RADIUS_SCALED_TO_FIT_IN_UNIT_SQUARE = 0.500000;

function layoutDetailsForNCirclesInSquare(nCircles, radiusPerCircleScaledToFitIntoUnitSquare) {
    return {
        numberOfCircles: nCircles, 
        /* 
            A note about "radiusPerCircleScaledToFitIntoUnitSquare":
            If nCircles = 10, then the circle radius of each must be scaled down such that it can fit in a unit square (1x1 square). 
            As nCircles increases, this radius must decrease. This value is a constant obtained via the chart found on: http://hydra.nat.uni-magdeburg.de/packing/csq/csq.html
        */
        radiusPerCircleScaledToFitIntoUnitSquare
    };
}

export function getImageForNCirclesInSquare(nCirlces) {
    const svgFileName = `${nCirlces}_circles_in_a_square.png`;

    const pathToSvg = `/images/circlesInSquare/${svgFileName}`;

    return pathToSvg;
}

function computeMaxAllowedCircleDiameter(squareSideLength, circleRadiusScaledToFitIntoUnitSquare) {
    const circleDiameterScaledToFitIntoUnitSquare = circleRadiusScaledToFitIntoUnitSquare * 2;

    return circleDiameterScaledToFitIntoUnitSquare * squareSideLength;
}

/*
    The function below is clever but not intuitive at a glance why it works.
    It provides a subset of solutions to a traveling saleman (NP) related problem in
    the simplest possible way. The NP problem is called "Circle Packing in a Square".
*/
export function howManyCirclesCanFitInThisSquare(circleDiameter, squareSideLength) {
    let largestNumberOfCirclesThatCanFitIntoSquare;

    const maximumCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, LARGEST_CIRCLE_RADIUS_SCALED_TO_FIT_IN_UNIT_SQUARE);
    const minimumCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, SMALLEST_CIRCLE_RADIUS_SCALED_TO_FIT_IN_UNIT_SQUARE);
    
    if (circleDiameter > maximumCircleDiameter) {
        return 0;
    }

    if (circleDiameter < minimumCircleDiameter) {
        throw new Error(`The max number of circles per layer that can be computed is ${Object.keys(nCirclesInSquareToLayoutDetails).length}. The circle diameter is too small, please use a larger circle diameter if possible, or increase the box length.`);
    }

    Object.keys(nCirclesInSquareToLayoutDetails).forEach((nCircles) => {
        const { radiusPerCircleScaledToFitIntoUnitSquare } = nCirclesInSquareToLayoutDetails[nCircles];
        const maximumCircleDiameter = computeMaxAllowedCircleDiameter(squareSideLength, radiusPerCircleScaledToFitIntoUnitSquare);
        
        const canNCiclesFitInThisSquare = circleDiameter <= maximumCircleDiameter;
        
        if (!canNCiclesFitInThisSquare) return;

        const wasBetterLayoutFound = !largestNumberOfCirclesThatCanFitIntoSquare || Number(nCircles) > largestNumberOfCirclesThatCanFitIntoSquare;

        if (wasBetterLayoutFound) largestNumberOfCirclesThatCanFitIntoSquare = Number(nCircles);
    });

    return largestNumberOfCirclesThatCanFitIntoSquare;

}

const ONE = 1;
const TWO = 2;
const THREE = 3;
const FOUR = 4;
const FIVE = 5;
const SIX = 6;
const SEVEN = 7;
const EIGHT = 8;
const NINE = 9;
const TEN = 10;
const ELEVEN = 11;
const TWELVE = 12;
const THIRTEEN = 13;
const FOURTEEN = 14;
const FIFTEEN = 15;
const SIXTEEN = 16;
const SEVENTEEN = 17;
const EIGHTEEN = 18;
const NINETEEN = 19;
const TWENTY = 20;

const nCirclesInSquareToLayoutDetails = {
    /* The radius below were obtained via: http://hydra.nat.uni-magdeburg.de/packing/csq/csq.html */
    [ONE]: layoutDetailsForNCirclesInSquare(ONE, LARGEST_CIRCLE_RADIUS_SCALED_TO_FIT_IN_UNIT_SQUARE),
    [TWO]: layoutDetailsForNCirclesInSquare(TWO, 0.292893),
    [THREE]: layoutDetailsForNCirclesInSquare(THREE, 0.254333),
    [FOUR]: layoutDetailsForNCirclesInSquare(FOUR, 0.250000),
    [FIVE]: layoutDetailsForNCirclesInSquare(FIVE, 0.207106),
    [SIX]: layoutDetailsForNCirclesInSquare(SIX, 0.187680),
    [SEVEN]: layoutDetailsForNCirclesInSquare(SEVEN, 0.174457),
    [EIGHT]: layoutDetailsForNCirclesInSquare(EIGHT, 0.170540),
    [NINE]: layoutDetailsForNCirclesInSquare(NINE, 0.166666),
    [TEN]: layoutDetailsForNCirclesInSquare(TEN, 0.148204),
    [ELEVEN]: layoutDetailsForNCirclesInSquare(ELEVEN, 0.142399),
    [TWELVE]: layoutDetailsForNCirclesInSquare(TWELVE, 0.139958),
    [THIRTEEN]: layoutDetailsForNCirclesInSquare(THIRTEEN, 0.133993),
    [FOURTEEN]: layoutDetailsForNCirclesInSquare(FOURTEEN, 0.129331),
    [FIFTEEN]: layoutDetailsForNCirclesInSquare(FIFTEEN, 0.127166),
    [SIXTEEN]: layoutDetailsForNCirclesInSquare(SIXTEEN, 0.125000),
    [SEVENTEEN]: layoutDetailsForNCirclesInSquare(SEVENTEEN, 0.117196),
    [EIGHTEEN]: layoutDetailsForNCirclesInSquare(EIGHTEEN, 0.115521),
    [NINETEEN]: layoutDetailsForNCirclesInSquare(NINETEEN, 0.112265),
    [TWENTY]: layoutDetailsForNCirclesInSquare(TWENTY, SMALLEST_CIRCLE_RADIUS_SCALED_TO_FIT_IN_UNIT_SQUARE)
};
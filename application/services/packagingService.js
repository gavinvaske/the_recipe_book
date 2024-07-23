import { howManyCirclesCanFitInThisSquare } from '../enums/circlesPerSquareEnum';
import isNil from 'lodash.isnil';
import { Decimal } from 'decimal.js';

const ONE_EIGHTH_INCH = 0.125;

export function getNumberOfLayers(boxHeight, rollHeight) {
    if (rollHeight > boxHeight) {
        return 0;
    }
    const buffer = ONE_EIGHTH_INCH;
    const boxHeightMinusBuffer = new Decimal(boxHeight - buffer);

    return Math.floor(boxHeightMinusBuffer.dividedBy(rollHeight));
}

export function getRollsPerLayer(rollDiameter, boxSideLength) {
    if (rollDiameter > boxSideLength) {
        return 0;
    }
    const buffer = ONE_EIGHTH_INCH;
    const rollDiameterPlusBuffer = rollDiameter + buffer;

    return howManyCirclesCanFitInThisSquare(rollDiameterPlusBuffer, boxSideLength);
}

export function getNumberOfBoxes(rollsPerBox, numberOfRolls) {
    if (isNil(rollsPerBox) || isNil(numberOfRolls)) return null;
    const numberOfRollsWithMorePrecision = new Decimal(numberOfRolls);

    return Math.ceil(numberOfRollsWithMorePrecision.dividedBy(rollsPerBox));
}
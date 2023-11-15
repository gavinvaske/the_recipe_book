const { howManyCirclesCanFitInThisSquare } = require('../enums/circlesPerSquareEnum');
const isNil = require('lodash.isnil');
const Decimal = require('decimal.js');

const ONE_EIGHTH_INCH = 0.125;

module.exports.getNumberOfLayers = (boxHeight, rollHeight) => {
    if (rollHeight > boxHeight) {
        return 0;
    }
    const buffer = ONE_EIGHTH_INCH;
    const boxHeightMinusBuffer = new Decimal(boxHeight - buffer);

    return Math.floor(boxHeightMinusBuffer.dividedBy(rollHeight));
};

module.exports.getRollsPerLayer = (rollDiameter, boxSideLength) => {
    if (rollDiameter > boxSideLength) {
        return 0;
    }
    const buffer = ONE_EIGHTH_INCH;
    const rollDiameterPlusBuffer = rollDiameter + buffer;

    return howManyCirclesCanFitInThisSquare(rollDiameterPlusBuffer, boxSideLength);
};

module.exports.getNumberOfBoxes = (rollsPerBox, numberOfRolls) => {
    if (isNil(rollsPerBox) || isNil(numberOfRolls)) return null;
    const numberOfRollsWithMorePrecision = new Decimal(numberOfRolls);

    return Math.ceil(numberOfRollsWithMorePrecision.dividedBy(rollsPerBox));
};
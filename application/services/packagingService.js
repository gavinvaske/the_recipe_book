const { howManyCirclesCanFitInThisSquare } = require('../enums/circlesPerSquareEnum');

const ONE_EIGHTH_INCH = 0.125;

module.exports.getNumberOfLayers = (boxHeight, rollHeight) => {
    const buffer = ONE_EIGHTH_INCH;
    const boxHeightMinusBuffer = boxHeight - buffer;

    return Math.floor(boxHeightMinusBuffer / rollHeight);
};

module.exports.getRollsPerLayer = (rollDiameter, boxSideLength) => {
    const buffer = ONE_EIGHTH_INCH;
    const rollDiameterPlusBuffer = rollDiameter + buffer;

    return howManyCirclesCanFitInThisSquare(rollDiameterPlusBuffer, boxSideLength);
};
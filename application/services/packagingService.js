const { howManyCirclesCanFitInThisSquare } = require('../enums/circlesPerSquareEnum');

module.exports.getNumberOfLayers = (boxHeight, rollHeight) => {
    const buffer = 0; // TODO (10/27/2023): Either remove this or make it a bigger number
    const boxHeightMinusBuffer = boxHeight - buffer;

    return Math.floor(boxHeightMinusBuffer / rollHeight);
};

module.exports.getRollsPerLayer = (rollDiameter, boxSideLength) => {
    const buffer = 0.125; // TODO (10/27/2023): Either remove this or make it a bigger number
    const rollDiameterPlusBuffer = rollDiameter + buffer;

    return howManyCirclesCanFitInThisSquare(rollDiameterPlusBuffer, boxSideLength);
};
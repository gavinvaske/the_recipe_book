const router = require('express').Router();
const packagingService = require('../services/packagingService');
const { getImageForNCirclesInSquare: getSvgForNCirclesInSquare } = require('../enums/circlesPerSquareEnum');

const SERVER_ERROR_STATUS = 500;

router.get('/estimator', (request, response) => {
    return response.render('createPackagingEstimate');
});

router.post('/estimate', (request, response) => {
    try {
        const { 
            boxSideLength : boxSideLengthAsString, 
            boxHeight : boxHeightAsString, 
            rollDiameter : rollDiameterAsString, 
            rollHeight : rollHeightAsString, 
            numberOfRolls : numberOfRollsAsString
        } = request.body;
    
        const boxSideLength = Number(boxSideLengthAsString);
        const boxHeight = Number(boxHeightAsString);
        const rollDiameter = Number(rollDiameterAsString);
        const rollHeight = Number(rollHeightAsString);
        const numberOfRolls = Number(numberOfRollsAsString);
        
        const numberOfLayers = packagingService.getNumberOfLayers(boxHeight, rollHeight);
        const rollsPerLayer = packagingService.getRollsPerLayer(rollDiameter, boxSideLength);
        const circlesInSquareLayoutImagePath = getSvgForNCirclesInSquare(rollsPerLayer);
    
        const rollsPerBox = rollsPerLayer * numberOfLayers;
        const numberOfBoxes = numberOfRolls ? Math.ceil(numberOfRolls / rollsPerBox) : null;
        
        return response.json({
            numberOfLayers,
            rollsPerLayer,
            rollsPerBox,
            circlesInSquareLayoutImagePath,
            numberOfBoxes
        });
    } catch (error) {
        return response.status(SERVER_ERROR_STATUS).send(error.message);
    }
});

module.exports = router;
const router = require('express').Router();
const packagingService = require('../services/packagingService');
const { getSvgForNCirclesInSquare } = require('../enums/circlesPerSquareEnum');

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
        const svgLayoutFilePath = getSvgForNCirclesInSquare(rollsPerLayer);
    
        const rollsPerBox = rollsPerLayer * numberOfLayers;
        const numberOfBoxes = numberOfRolls ? Math.ceil(numberOfRolls / rollsPerBox) : null;
        
        return response.json({
            numberOfLayers,
            rollsPerLayer,
            rollsPerBox,
            svgLayoutFilePath,
            numberOfBoxes
        });
    } catch (error) {
        return response.error(error);
    }
});

module.exports = router;
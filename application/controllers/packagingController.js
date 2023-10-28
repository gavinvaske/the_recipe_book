const router = require('express').Router();
const packagingService = require('../services/packagingService');

router.post('/rolls-per-box', (request, response) => {
    const { boxSideLength, boxHeight, rollDiameter, rollHeight } = request.body;
    
    const numberOfLayers = packagingService.getNumberOfLayers(boxHeight, rollHeight);
    const rollsPerLayer = packagingService.getRollsPerLayer(rollDiameter, boxSideLength);
    //const svgLayoutFilePath = circlesPerSquare[rollsPerLayer];
    
    return response.json({
        numberOfLayers,
        rollsPerLayer,
        rollsPerBox: rollsPerLayer * numberOfLayers
        // svgLayoutFilePath
    });
});

module.exports = router;
const router = require('express').Router();
const packagingService = require('../services/packagingService');
const { getSvgForNCirclesInSquare } = require('../enums/circlesPerSquareEnum');

router.get('/estimator', (request, response) => {
    return response.render('createPackagingEstimate');
});

router.post('/estimate', (request, response) => {
    const { boxSideLength, boxHeight, rollDiameter, rollHeight } = request.body;
    
    const numberOfLayers = packagingService.getNumberOfLayers(boxHeight, rollHeight);
    const rollsPerLayer = packagingService.getRollsPerLayer(rollDiameter, boxSideLength);
    const svgLayoutFilePath = getSvgForNCirclesInSquare(rollsPerLayer);
    
    return response.json({
        numberOfLayers,
        rollsPerLayer,
        rollsPerBox: rollsPerLayer * numberOfLayers,
        svgLayoutFilePath
    });

    // return response.json({
    //     test: 'test'
    // });

    //return response.send('test');
});

module.exports = router;
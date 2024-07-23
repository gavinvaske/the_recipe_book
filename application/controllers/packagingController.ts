import { Router } from 'express';
const router = Router();
import * as packagingService from '../services/packagingService';
import { getImageForNCirclesInSquare } from '../enums/circlesPerSquareEnum';

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
        const circlesInSquareLayoutImagePath = getImageForNCirclesInSquare(rollsPerLayer);
    
        const rollsPerBox = rollsPerLayer * numberOfLayers;
        const numberOfBoxes = packagingService.getNumberOfBoxes(rollsPerBox, numberOfRolls);
        
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

export default router;
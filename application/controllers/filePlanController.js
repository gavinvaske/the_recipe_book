import { Router } from 'express'
const router = Router();
import { verifyJwtToken } from '../middleware/authorize.js'
import * as filePlanService from '../services/filePlanService.js';

// router.use(verifyJwtToken);

const PRODUCTS_PLACEHOLDER = '767D-3989 1000 \nPRODUCT-123 1500 \nPRODUCTXYZ 2500 \nPRODUCT_F 100 \n7111-3989 18000 \nABC 430';

router.get('/', (request, response) => {
    return response.render('createFilePlan', {
        'placeholder': PRODUCTS_PLACEHOLDER 
    });
});

router.post('/', (request, response) => {
    console.log('request.body', request.body);
    const { filePlanName, products : productsAsText, labelsAcross, labelsAround } = request.body;
  
    const products = [];

    productsAsText.split('\n').forEach((spaceSeperatedProductAttributes) => {
        const [name, labelQuantity] = spaceSeperatedProductAttributes.split(' ');
        const product = filePlanService.buildProduct(name, labelQuantity);

        products.push(product);
    });
  
    const filePlanRequest = filePlanService.buildFilePlanRequest(products, labelsAcross, labelsAround);
  
    const filePlan = filePlanService.buildFilePlan(filePlanRequest);

    const tabSizeInSpaces = 4;
  
    response.set({'Content-Disposition':`attachment; filename=${filePlanName}.json`});
    response.send(JSON.stringify(filePlan, null, tabSizeInSpaces));
});

export default router;
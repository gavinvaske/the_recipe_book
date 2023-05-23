const router = require('express').Router();
const {verifyJwtToken} = require('../middleware/authorize');

router.use(verifyJwtToken);

const PRODUCTS_PLACEHOLDER = '767D-3989 1000 \nPRODUCT-123 1500 \nPRODUCTXYZ 2500 \nPRODUCT_F 100 \n7111-3989 18000 \nABC 430'

router.get('/', (request, response) => {
  return response.render('createFilePlan', {
    'placeholder': PRODUCTS_PLACEHOLDER 
  });
});

router.post('/', (request, response) => {
  console.log('request.body', request.body);

  return response.render('createFilePlan', {
    'placeholder': PRODUCTS_PLACEHOLDER
  });
});

module.exports = router;
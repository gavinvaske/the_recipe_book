const router = require('express').Router();
const { verifyJwtToken } = require('../middleware/authorize');
const CreditTerm = require('../models/creditTerm');

router.use(verifyJwtToken);

router.get('/', async (request, response) => {
  return response.render('viewCreditTerms');
})

router.get('/form', async (request, response) => {
    return response.render('createCreditTerms');
});

router.post('/', async (request, response) => {
  let savedCreditTerm;

  try {
    savedCreditTerm = await CreditTerm.create(request.body);
  } catch (error) {
    console.log(error);
    return response.status(400).send(error.message);
  }

  return response.status(200).send(savedCreditTerm);
});

module.exports = router;
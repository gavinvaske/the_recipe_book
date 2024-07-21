import { Router } from 'express'
const router = Router();
const {verifyJwtToken} = require('../middleware/authorize');

router.use(verifyJwtToken);


router.get('/form', (request, response) => {
    return response.render('createProof');
});

module.exports = router;
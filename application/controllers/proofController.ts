import { Router } from 'express';
const router = Router();
import { verifyJwtToken } from '../middleware/authorize.ts';

router.use(verifyJwtToken);


router.get('/form', (request, response) => {
    return response.render('createProof');
});

export default router;
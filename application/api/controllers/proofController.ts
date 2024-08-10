import { Router } from 'express';
const router = Router();
import { verifyBearerToken } from '../middleware/authorize.ts';

router.use(verifyBearerToken);


router.get('/form', (request, response) => {
    return response.render('createProof');
});

export default router;
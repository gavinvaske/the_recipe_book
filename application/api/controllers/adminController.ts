import { Router } from 'express';
const router = Router();
import { verifyBearerToken } from '../middleware/authorize.ts';

router.use(verifyBearerToken);

router.get('/', (request, response) => {
    return response.render('adminPanel');

});

export default router;
import { Router } from 'express';
const router = Router();
import { verifyJwtToken } from '../middleware/authorize';

router.use(verifyJwtToken);

router.get('/', (request, response) => {
    return response.render('adminPanel');

});

export default router;
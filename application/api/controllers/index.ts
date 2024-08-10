import { Router } from 'express';
const router = Router();
import { isUserLoggedIn } from '../services/userService.ts';

router.get('/', (_, response) => {
    return response.redirect('react-ui/');
});

export default router;
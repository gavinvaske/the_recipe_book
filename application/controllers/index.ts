import { Router } from 'express';
const router = Router();
import { isUserLoggedIn } from '../services/userService';

router.get('/', (request, response) => {
    if (isUserLoggedIn(request.cookies.jwtToken, process.env.JWT_SECRET)) {
        return response.redirect('/users/profile');
    }

    return response.render('login');
});

export default router;
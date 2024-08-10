import { Router } from 'express';
const router = Router();

router.get('/', (_, response) => {
    return response.redirect('react-ui/');
});

export default router;
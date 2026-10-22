import { Router } from 'express';
import { authController, registerSchema, loginSchema } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validation.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.get('/me', requireAuth, authController.getMe);
router.post('/logout', authController.logout);

export default router;

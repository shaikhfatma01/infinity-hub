import { Router } from 'express';
import { authController, registerSchema, loginSchema } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validation.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), asyncHandler(authController.register));
router.post('/login', validateRequest(loginSchema), asyncHandler(authController.login));
router.get('/me', asyncHandler(requireAuth), asyncHandler(authController.getMe));
router.post('/logout', asyncHandler(authController.logout));

export default router;

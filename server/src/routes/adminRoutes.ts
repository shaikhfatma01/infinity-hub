import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(asyncHandler(requireAuth), requireAdmin);
router.get('/users', asyncHandler(adminController.listUsers));

export default router;

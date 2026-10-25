import { Router } from 'express';
import { alertController } from '../controllers/alertController.js';
import { optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(asyncHandler(optionalAuth));

router.get('/', asyncHandler(alertController.getAlerts));
router.post('/', asyncHandler(alertController.createAlert));
router.post('/check', asyncHandler(alertController.checkAlerts));
router.delete('/:id', asyncHandler(alertController.deleteAlert));

export default router;

import { Router } from 'express';
import { cartController } from '../controllers/cartController.js';
import { optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(asyncHandler(optionalAuth));

router.get('/', asyncHandler(cartController.getCart));
router.post('/items', asyncHandler(cartController.addItem));
router.put('/items/:id', asyncHandler(cartController.updateQuantity));
router.delete('/items/:id', asyncHandler(cartController.removeItem));
router.get('/optimize', asyncHandler(cartController.optimizeCart));
router.post('/apply-optimizations', asyncHandler(cartController.applyOptimizations));

export default router;

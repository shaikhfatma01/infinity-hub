import { Router } from 'express';
import { cartController } from '../controllers/cartController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.use(optionalAuth);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:id', cartController.updateQuantity);
router.delete('/items/:id', cartController.removeItem);
router.get('/optimize', cartController.optimizeCart);
router.post('/apply-optimizations', cartController.applyOptimizations);

export default router;

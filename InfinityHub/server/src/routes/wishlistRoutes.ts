import { Router } from 'express';
import { wishlistController } from '../controllers/wishlistController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.use(optionalAuth);

router.get('/', wishlistController.getWishlist);
router.post('/toggle', wishlistController.toggleWishlist);
router.delete('/:productId', wishlistController.removeItem);

export default router;

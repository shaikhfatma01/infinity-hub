import { Router } from 'express';
import { wishlistController } from '../controllers/wishlistController.js';
import { optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(asyncHandler(optionalAuth));

router.get('/', asyncHandler(wishlistController.getWishlist));
router.post('/toggle', asyncHandler(wishlistController.toggleWishlist));
router.delete('/:productId', asyncHandler(wishlistController.removeItem));

export default router;

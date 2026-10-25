import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(productController.getProducts));
router.get('/categories', asyncHandler(productController.getCategories));
router.get('/stores', asyncHandler(productController.getStores));
router.get('/:id', asyncHandler(productController.getProductById));
router.get('/:id/twins', asyncHandler(productController.getProductTwins));

export default router;

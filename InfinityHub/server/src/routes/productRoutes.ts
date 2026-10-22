import { Router } from 'express';
import { productController } from '../controllers/productController.js';

const router = Router();

router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/stores', productController.getStores);
router.get('/:id', productController.getProductById);
router.get('/:id/twins', productController.getProductTwins);

export default router;

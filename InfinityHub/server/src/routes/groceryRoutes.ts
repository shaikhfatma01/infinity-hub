import { Router } from 'express';
import { groceryController } from '../controllers/groceryController.js';

const router = Router();

router.get('/compare', groceryController.getGroceryComparisons);

export default router;

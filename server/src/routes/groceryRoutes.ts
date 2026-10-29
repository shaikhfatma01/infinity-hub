import { Router } from 'express';
import { groceryController } from '../controllers/groceryController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/compare', asyncHandler(groceryController.getGroceryComparisons));

export default router;

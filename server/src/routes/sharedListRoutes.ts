import { Router } from 'express';
import { sharedListController } from '../controllers/sharedListController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(sharedListController.getSharedLists));
router.post('/items', asyncHandler(sharedListController.addItem));
router.patch('/items/:id/toggle', asyncHandler(sharedListController.togglePurchased));
router.delete('/items/:id', asyncHandler(sharedListController.removeItem));

export default router;

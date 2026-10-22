import { Router } from 'express';
import { sharedListController } from '../controllers/sharedListController.js';

const router = Router();

router.get('/', sharedListController.getSharedLists);
router.post('/items', sharedListController.addItem);
router.patch('/items/:id/toggle', sharedListController.togglePurchased);
router.delete('/items/:id', sharedListController.removeItem);

export default router;

import { Router } from 'express';
import { missionController } from '../controllers/missionController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(missionController.getMissions));
router.get('/:id', asyncHandler(missionController.getMissionById));

export default router;

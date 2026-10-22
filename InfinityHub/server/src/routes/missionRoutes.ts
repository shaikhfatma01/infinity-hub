import { Router } from 'express';
import { missionController } from '../controllers/missionController.js';

const router = Router();

router.get('/', missionController.getMissions);
router.get('/:id', missionController.getMissionById);

export default router;

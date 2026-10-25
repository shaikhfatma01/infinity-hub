import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/chat', asyncHandler(aiController.chat));

export default router;

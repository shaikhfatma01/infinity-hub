import { Router } from 'express';
import multer from 'multer';
import { visualSearchController } from '../controllers/visualSearchController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const router = Router();

router.get('/preset', asyncHandler(visualSearchController.searchByPreset));
router.post('/preset', asyncHandler(visualSearchController.searchByPreset));
router.post('/upload', upload.single('image'), asyncHandler(visualSearchController.searchByUpload));

export default router;

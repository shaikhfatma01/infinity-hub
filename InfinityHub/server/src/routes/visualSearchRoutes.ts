import { Router } from 'express';
import multer from 'multer';
import { visualSearchController } from '../controllers/visualSearchController.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const router = Router();

router.get('/preset', visualSearchController.searchByPreset);
router.post('/preset', visualSearchController.searchByPreset);
router.post('/upload', upload.single('image'), visualSearchController.searchByUpload);

export default router;

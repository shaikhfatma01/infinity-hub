import { Router } from 'express';
import { alertController } from '../controllers/alertController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.use(optionalAuth);

router.get('/', alertController.getAlerts);
router.post('/', alertController.createAlert);
router.delete('/:id', alertController.deleteAlert);
router.post('/check', alertController.checkAlerts);

export default router;

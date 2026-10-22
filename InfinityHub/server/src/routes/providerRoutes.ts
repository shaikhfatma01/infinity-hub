import { Router } from 'express';
import { providerController } from '../controllers/providerController.js';

const router = Router();

router.get('/', providerController.getProviders);
router.get('/:storeName', providerController.getProviderByName);

export default router;

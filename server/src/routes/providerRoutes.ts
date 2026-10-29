import { Router } from 'express';
import { providerController } from '../controllers/providerController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(providerController.getProviders));
router.get('/:storeName', asyncHandler(providerController.getProviderByName));

export default router;

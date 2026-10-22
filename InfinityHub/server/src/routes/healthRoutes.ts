import { Router, Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { config } from '../config/index.js';
import { storeAdapterManager } from '../providers/storeAdapters.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  let dbStatus = 'connected';
  let productCount = 0;

  try {
    productCount = await prisma.product.count();
  } catch (err: any) {
    dbStatus = `error: ${err.message}`;
  }

  const integrationSummary = storeAdapterManager.getIntegrationSummary();

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: config.nodeEnv,
    database: {
      provider: 'MySQL (Prisma ORM)',
      status: dbStatus,
      productsIndexed: productCount,
    },
    aiEngine: {
      provider: config.geminiApiKey ? 'Google Gemini 2.0 Flash' : 'Infinity Rule-Based Local Shopping Engine',
      hasApiKeyConfigured: Boolean(config.geminiApiKey),
    },
    storeIntegrations: {
      totalMonitoredStores: integrationSummary.totalMonitoredStores,
      activeLiveIntegrations: integrationSummary.activeLiveIntegrations,
      demoModeIntegrations: integrationSummary.demoModeIntegrations,
    },
    version: '1.0.0',
  });
});

export default router;

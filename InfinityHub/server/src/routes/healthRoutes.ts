import { Router, Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { config } from '../config/index.js';
import { storeAdapterManager } from '../providers/storeAdapters.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    let dbStatus = 'connected';
    let productCount = 0;

    try {
      productCount = await prisma.product.count();
    } catch (err: any) {
      dbStatus = 'error: database unreachable';
      if (!config.isProduction) {
        dbStatus = `error: ${err?.message || 'database unreachable'}`;
      }
    }

    const integrationSummary = storeAdapterManager.getIntegrationSummary();
    const dbHealthy = dbStatus === 'connected';

    // Return 503 when the database is down so Docker/load-balancer health checks notice.
    res.status(dbHealthy ? 200 : 503).json({
      status: dbHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: config.nodeEnv,
      database: {
        provider: 'Supabase Postgres (Prisma ORM)',
        status: dbStatus,
        productsIndexed: productCount,
      },
      aiEngine: {
        provider: config.geminiApiKey
          ? `Google Gemini (${config.geminiModel})`
          : 'Infinity Rule-Based Local Shopping Engine',
        hasApiKeyConfigured: Boolean(config.geminiApiKey),
      },
      storeIntegrations: {
        totalMonitoredStores: integrationSummary.totalMonitoredStores,
        activeLiveIntegrations: integrationSummary.activeLiveIntegrations,
        demoModeIntegrations: integrationSummary.demoModeIntegrations,
      },
      version: '1.0.0',
    });
  })
);

export default router;

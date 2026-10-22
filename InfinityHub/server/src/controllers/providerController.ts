import { Request, Response } from 'express';
import { storeAdapterManager } from '../providers/storeAdapters.js';
import { StoreName } from '../types/index.js';

export class ProviderController {
  public async getProviders(req: Request, res: Response) {
    const summary = storeAdapterManager.getIntegrationSummary();
    res.json({
      success: true,
      data: summary,
    });
  }

  public async getProviderByName(req: Request, res: Response) {
    const storeName = req.params.storeName as StoreName;
    const provider = storeAdapterManager.getProvider(storeName);

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: `Store provider "${storeName}" is not registered in InfinityHub.`,
      });
    }

    res.json({
      success: true,
      data: provider,
    });
  }
}

export const providerController = new ProviderController();

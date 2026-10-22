import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { deserializeProduct } from '../services/productService.js';

export class MissionController {
  public async getMissions(req: Request, res: Response) {
    const missions = await prisma.shoppingMission.findMany({
      orderBy: { targetBudget: 'asc' },
    });

    // Populate products inside each mission
    const rawProducts = await prisma.product.findMany();
    const productMap = new Map(rawProducts.map(p => [p.id, deserializeProduct(p)]));

    const enrichedMissions = missions.map(m => {
      const itemsRaw = JSON.parse(m.itemsJson || '[]');
      const items = itemsRaw.map((it: any) => ({
        ...it,
        selectedProduct: productMap.get(it.selectedProduct?.id) || it.selectedProduct,
      }));

      return {
        id: m.id,
        title: m.title,
        icon: m.icon,
        tagline: m.tagline,
        targetBudget: m.targetBudget,
        description: m.description,
        category: m.category,
        items,
        tips: JSON.parse(m.tipsJson || '[]'),
      };
    });

    res.json({
      success: true,
      data: enrichedMissions,
    });
  }

  public async getMissionById(req: Request, res: Response) {
    const id = req.params.id as string;
    const m = await prisma.shoppingMission.findUnique({ where: { id } });

    if (!m) {
      return res.status(404).json({ success: false, error: 'Shopping Mission not found.' });
    }

    const rawProducts = await prisma.product.findMany();
    const productMap = new Map(rawProducts.map(p => [p.id, deserializeProduct(p)]));

    const itemsRaw = JSON.parse(m.itemsJson || '[]');
    const items = itemsRaw.map((it: any) => ({
      ...it,
      selectedProduct: productMap.get(it.selectedProduct?.id) || it.selectedProduct,
    }));

    res.json({
      success: true,
      data: {
        id: m.id,
        title: m.title,
        icon: m.icon,
        tagline: m.tagline,
        targetBudget: m.targetBudget,
        description: m.description,
        category: m.category,
        items,
        tips: JSON.parse(m.tipsJson || '[]'),
      },
    });
  }
}

export const missionController = new MissionController();

import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class AlertController {
  public async getAlerts(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const guestId = req.guestId || (req.headers['x-guest-id'] as string);

    if (!userId && !guestId) {
      return res.json({ success: true, data: [] });
    }

    const whereClause = userId ? { userId } : { guestId };
    const alerts = await prisma.priceAlert.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: alerts.map(a => ({
        id: a.id,
        productId: a.productId,
        productName: a.productName,
        productImage: a.productImage,
        currentPrice: a.currentPrice,
        targetPrice: a.targetPrice,
        store: a.store,
        createdAt: a.createdAt.toLocaleDateString(),
        status: a.status,
      })),
    });
  }

  public async createAlert(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const guestId = req.guestId || (req.headers['x-guest-id'] as string);
    const { productId, targetPrice } = req.body;

    if (!productId || targetPrice === undefined) {
      return res.status(400).json({
        success: false,
        error: 'productId and targetPrice are required.',
      });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    const alert = await prisma.priceAlert.create({
      data: {
        userId,
        guestId,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        currentPrice: product.currentPrice,
        targetPrice: parseFloat(targetPrice),
        store: product.store,
        status: product.currentPrice <= parseFloat(targetPrice) ? 'TRIGGERED' : 'ACTIVE',
      },
    });

    res.status(201).json({
      success: true,
      message: `24/7 Price Alert activated for ₹${targetPrice}!`,
      data: alert,
    });
  }

  public async deleteAlert(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const guestId = req.guestId || (req.headers['x-guest-id'] as string);
    const id = req.params.id as string;

    const alert = await prisma.priceAlert.findUnique({ where: { id } });
    if (!alert) {
      return res.json({ success: true, message: 'Alert removed.' });
    }

    if (userId && alert.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized.' });
    }
    if (!userId && guestId && alert.guestId !== guestId) {
      return res.status(403).json({ success: false, error: 'Unauthorized.' });
    }

    await prisma.priceAlert.delete({ where: { id } });
    res.json({
      success: true,
      message: 'Price Alert removed.',
    });
  }

  public async checkAlerts(req: AuthenticatedRequest, res: Response) {
    // Check all alerts against latest product prices
    const alerts = await prisma.priceAlert.findMany({
      where: { status: 'ACTIVE' },
      include: { product: true },
    });

    let triggeredCount = 0;
    for (const alert of alerts) {
      if (alert.product && alert.product.currentPrice <= alert.targetPrice) {
        await prisma.priceAlert.update({
          where: { id: alert.id },
          data: { status: 'TRIGGERED', currentPrice: alert.product.currentPrice },
        });
        triggeredCount++;
      }
    }

    res.json({
      success: true,
      message: `Price drop scan completed. Checked ${alerts.length} active alerts, ${triggeredCount} price targets triggered.`,
      triggeredCount,
    });
  }
}

export const alertController = new AlertController();

import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest, getIdentity } from '../middleware/auth.js';
import { badRequest, forbidden, notFound } from '../utils/httpError.js';
import { toFiniteNumber } from '../utils/parse.js';
import { ownsRow } from '../services/cartService.js';

function serializeAlert(a: any) {
  return {
    id: a.id,
    productId: a.productId,
    productName: a.productName,
    productImage: a.productImage,
    currentPrice: a.currentPrice,
    targetPrice: a.targetPrice,
    store: a.store,
    createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
    status: a.status,
  };
}

export class AlertController {
  public async getAlerts(req: AuthenticatedRequest, res: Response) {
    const { userId, guestId } = getIdentity(req);

    if (!userId && !guestId) {
      return res.json({ success: true, data: [] });
    }

    const whereClause = userId ? { userId } : { guestId, userId: null };
    const alerts = await prisma.priceAlert.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: alerts.map(serializeAlert),
    });
  }

  public async createAlert(req: AuthenticatedRequest, res: Response) {
    const { userId, guestId } = getIdentity(req);
    const productId = req.body?.productId;
    const targetPrice = toFiniteNumber(req.body?.targetPrice);

    if (!productId || typeof productId !== 'string' || targetPrice === undefined) {
      throw badRequest('productId and a numeric targetPrice are required.');
    }
    if (targetPrice <= 0) {
      throw badRequest('targetPrice must be greater than zero.');
    }
    if (!userId && !guestId) {
      throw badRequest('A signed-in session or x-guest-id header is required to create alerts.');
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw notFound('Product not found.');
    }

    const status = product.currentPrice <= targetPrice ? 'TRIGGERED' : 'ACTIVE';
    const owner = userId ? { userId } : { guestId, userId: null };

    // One tracker per product per owner: re-submitting just moves the target.
    const existing = await prisma.priceAlert.findFirst({
      where: { ...owner, productId, status: { not: 'CANCELLED' } },
    });

    const alert = existing
      ? await prisma.priceAlert.update({
          where: { id: existing.id },
          data: { targetPrice, currentPrice: product.currentPrice, status },
        })
      : await prisma.priceAlert.create({
          data: {
            userId: userId ?? null,
            guestId: userId ? null : guestId,
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            currentPrice: product.currentPrice,
            targetPrice,
            store: product.store,
            status,
          },
        });

    res.status(201).json({
      success: true,
      message: `24/7 Price Alert activated for ₹${targetPrice}!`,
      data: serializeAlert(alert),
    });
  }

  public async deleteAlert(req: AuthenticatedRequest, res: Response) {
    const { userId, guestId } = getIdentity(req);
    const id = req.params.id as string;

    const alert = await prisma.priceAlert.findUnique({ where: { id } });
    if (!alert) {
      return res.json({ success: true, message: 'Alert removed.' });
    }

    if (!ownsRow(alert, userId, guestId)) {
      throw forbidden('You are not allowed to remove this alert.');
    }

    await prisma.priceAlert.delete({ where: { id } });
    res.json({
      success: true,
      message: 'Price Alert removed.',
    });
  }

  /**
   * Re-evaluates the caller's active alerts against current catalogue prices.
   * Scoped to the caller so one visitor cannot trigger/scan everyone else's alerts.
   */
  public async checkAlerts(req: AuthenticatedRequest, res: Response) {
    const { userId, guestId } = getIdentity(req);

    if (!userId && !guestId) {
      return res.json({
        success: true,
        message: 'Price drop scan completed. Checked 0 active alerts, 0 price targets triggered.',
        triggeredCount: 0,
      });
    }

    const alerts = await prisma.priceAlert.findMany({
      where: { ...(userId ? { userId } : { guestId, userId: null }), status: 'ACTIVE' },
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

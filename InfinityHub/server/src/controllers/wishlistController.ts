import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest, getIdentity } from '../middleware/auth.js';
import { deserializeProduct } from '../services/productService.js';
import { badRequest, notFound } from '../utils/httpError.js';

export class WishlistController {
  public async getWishlist(req: AuthenticatedRequest, res: Response) {
    const { userId, guestId } = getIdentity(req);

    if (!userId && !guestId) {
      return res.json({ success: true, data: [] });
    }

    const whereClause = userId ? { userId } : { guestId, userId: null };
    const items = await prisma.wishlistItem.findMany({
      where: whereClause,
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    const products = items.map(item => deserializeProduct(item.product));
    res.json({
      success: true,
      data: products,
    });
  }

  public async toggleWishlist(req: AuthenticatedRequest, res: Response) {
    const { userId, guestId } = getIdentity(req);
    const productId = req.body?.productId;

    if (!productId || typeof productId !== 'string') {
      throw badRequest('productId is required.');
    }
    if (!userId && !guestId) {
      throw badRequest('A signed-in session or x-guest-id header is required to use the wishlist.');
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw notFound('Product not found.');
    }

    const existing = await prisma.wishlistItem.findFirst({
      where: userId ? { userId, productId } : { guestId, userId: null, productId },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return res.json({
        success: true,
        isSaved: false,
        message: 'Product removed from wishlist.',
      });
    }

    await prisma.wishlistItem.create({
      data: {
        userId: userId ?? null,
        guestId: userId ? null : guestId,
        productId,
      },
    });

    return res.json({
      success: true,
      isSaved: true,
      message: 'Product saved to wishlist.',
    });
  }

  public async removeItem(req: AuthenticatedRequest, res: Response) {
    const { userId, guestId } = getIdentity(req);
    const productId = req.params.productId as string;

    if (userId) {
      await prisma.wishlistItem.deleteMany({ where: { userId, productId } });
    } else if (guestId) {
      await prisma.wishlistItem.deleteMany({ where: { guestId, userId: null, productId } });
    }

    res.json({
      success: true,
      message: 'Removed from wishlist.',
    });
  }
}

export const wishlistController = new WishlistController();

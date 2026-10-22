import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { deserializeProduct } from '../services/productService.js';

export class WishlistController {
  public async getWishlist(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const guestId = req.guestId || (req.headers['x-guest-id'] as string);

    if (!userId && !guestId) {
      return res.json({ success: true, data: [] });
    }

    const whereClause = userId ? { userId } : { guestId };
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
    const userId = req.user?.id;
    const guestId = req.guestId || (req.headers['x-guest-id'] as string);
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, error: 'productId is required.' });
    }

    let existing = null;
    if (userId) {
      existing = await prisma.wishlistItem.findUnique({
        where: { userId_productId: { userId, productId } },
      });
    } else if (guestId) {
      existing = await prisma.wishlistItem.findFirst({ where: { guestId, productId } });
    }

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
        userId,
        guestId,
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
    const userId = req.user?.id;
    const guestId = req.guestId || (req.headers['x-guest-id'] as string);
    const productId = req.params.productId as string;

    if (userId) {
      await prisma.wishlistItem.deleteMany({ where: { userId, productId } });
    } else if (guestId) {
      await prisma.wishlistItem.deleteMany({ where: { guestId, productId } });
    }

    res.json({
      success: true,
      message: 'Removed from wishlist.',
    });
  }
}

export const wishlistController = new WishlistController();

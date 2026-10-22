import { Response } from 'express';
import { cartService } from '../services/cartService.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { StoreName } from '../types/index.js';

export class CartController {
  public async getCart(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const guestId = req.guestId || (req.headers['x-guest-id'] as string);

    const cart = await cartService.getCart(userId, guestId);
    res.json({
      success: true,
      data: cart,
    });
  }

  public async addItem(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const guestId = req.guestId || (req.headers['x-guest-id'] as string);
    const { productId, store, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'productId is required.',
      });
    }

    const item = await cartService.addToCart({
      userId,
      guestId,
      productId,
      store: store as StoreName,
      quantity: quantity ? parseInt(quantity, 10) : 1,
    });

    res.status(201).json({
      success: true,
      message: 'Item added to Infinity Cart.',
      data: item,
    });
  }

  public async updateQuantity(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const guestId = req.guestId || (req.headers['x-guest-id'] as string);
    const id = req.params.id as string;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'quantity is required.',
      });
    }

    const updated = await cartService.updateQuantity(id, parseInt(quantity, 10), userId, guestId);
    res.json({
      success: true,
      message: 'Cart quantity updated.',
      data: updated,
    });
  }

  public async removeItem(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const guestId = req.guestId || (req.headers['x-guest-id'] as string);
    const id = req.params.id as string;

    await cartService.removeItem(id, userId, guestId);
    res.json({
      success: true,
      message: 'Item removed from Infinity Cart.',
    });
  }

  public async optimizeCart(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const guestId = req.guestId || (req.headers['x-guest-id'] as string);

    const { items } = await cartService.getCart(userId, guestId);
    const report = cartService.calculateOptimizations(items);

    res.json({
      success: true,
      data: report,
    });
  }

  public async applyOptimizations(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const guestId = req.guestId || (req.headers['x-guest-id'] as string);

    const result = await cartService.applyOptimizations(userId, guestId);
    res.json({
      success: true,
      message: result.message,
      totalSavings: result.totalSavings,
    });
  }
}

export const cartController = new CartController();

import { Response } from 'express';
import { cartService } from '../services/cartService.js';
import { AuthenticatedRequest, getIdentity } from '../middleware/auth.js';
import { StoreName } from '../types/index.js';
import { badRequest } from '../utils/httpError.js';
import { toInt } from '../utils/parse.js';

export class CartController {
  public async getCart(req: AuthenticatedRequest, res: Response) {
    const { userId, guestId } = getIdentity(req);

    const cart = await cartService.getCart(userId, guestId);
    res.json({
      success: true,
      data: cart,
    });
  }

  public async addItem(req: AuthenticatedRequest, res: Response) {
    const { userId, guestId } = getIdentity(req);
    // `store` is the canonical field; `selectedStore` is accepted as an alias.
    const { productId, quantity } = req.body ?? {};
    const store = req.body?.store ?? req.body?.selectedStore;

    if (!productId || typeof productId !== 'string') {
      throw badRequest('productId is required.');
    }

    const parsedQty = quantity === undefined ? 1 : toInt(quantity);
    if (parsedQty === undefined) {
      throw badRequest('quantity must be a whole number.');
    }

    const item = await cartService.addToCart({
      userId,
      guestId,
      productId,
      store: store as StoreName | undefined,
      quantity: parsedQty,
    });

    res.status(201).json({
      success: true,
      message: 'Item added to Infinity Cart.',
      data: item,
    });
  }

  public async updateQuantity(req: AuthenticatedRequest, res: Response) {
    const { userId, guestId } = getIdentity(req);
    const id = req.params.id as string;
    const quantity = toInt(req.body?.quantity);

    if (quantity === undefined) {
      throw badRequest('quantity is required and must be a whole number.');
    }

    const updated = await cartService.updateQuantity(id, quantity, userId, guestId);
    res.json({
      success: true,
      message: updated ? 'Cart quantity updated.' : 'Item removed from Infinity Cart.',
      data: updated,
    });
  }

  public async removeItem(req: AuthenticatedRequest, res: Response) {
    const { userId, guestId } = getIdentity(req);
    const id = req.params.id as string;

    await cartService.removeItem(id, userId, guestId);
    res.json({
      success: true,
      message: 'Item removed from Infinity Cart.',
    });
  }

  public async optimizeCart(req: AuthenticatedRequest, res: Response) {
    const { userId, guestId } = getIdentity(req);

    const { items } = await cartService.getCart(userId, guestId);
    const report = await cartService.calculateOptimizations(items);

    res.json({
      success: true,
      data: report,
    });
  }

  public async applyOptimizations(req: AuthenticatedRequest, res: Response) {
    const { userId, guestId } = getIdentity(req);

    const result = await cartService.applyOptimizations(userId, guestId);
    res.json({
      success: true,
      message: result.message,
      totalSavings: result.totalSavings,
    });
  }
}

export const cartController = new CartController();

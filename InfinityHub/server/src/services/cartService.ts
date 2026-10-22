import { prisma } from '../config/db.js';
import { deserializeProduct } from './productService.js';
import { StoreName } from '../types/index.js';

export interface CartOptimizationResult {
  originalTotal: number;
  optimizedTotal: number;
  totalSavings: number;
  savingsPercentage: number;
  optimizations: {
    cartItemId: string;
    productName: string;
    currentStore: string;
    currentPrice: number;
    recommendedStore: string;
    recommendedPrice: number;
    savings: number;
    reason: string;
  }[];
}

export class CartService {
  public async getCart(userId?: string, guestId?: string) {
    if (!userId && !guestId) {
      return { items: [], total: 0, storeCount: 0, potentialSavings: 0 };
    }

    const whereClause = userId ? { userId } : { guestId };
    const items = await prisma.cartItem.findMany({
      where: whereClause,
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    const deserializedItems = items.map(item => ({
      id: item.id,
      productId: item.productId,
      product: deserializeProduct(item.product),
      selectedStore: item.selectedStore as StoreName,
      selectedPrice: item.selectedPrice,
      selectedShipping: item.selectedShipping,
      quantity: item.quantity,
    }));

    const total = deserializedItems.reduce(
      (sum, item) => sum + (item.selectedPrice + item.selectedShipping) * item.quantity,
      0
    );

    const storeCount = new Set(deserializedItems.map(item => item.selectedStore)).size;
    const optimization = this.calculateOptimizations(deserializedItems);

    return {
      items: deserializedItems,
      total,
      storeCount,
      potentialSavings: optimization.totalSavings,
    };
  }

  public async addToCart(data: {
    userId?: string;
    guestId?: string;
    productId: string;
    store?: StoreName;
    quantity?: number;
  }) {
    const { userId, guestId, productId, quantity = 1 } = data;
    if (!userId && !guestId) {
      throw new Error('Either userId or guestId must be provided.');
    }

    const productRecord = await prisma.product.findUnique({ where: { id: productId } });
    if (!productRecord) {
      throw new Error('Product not found.');
    }

    const product = deserializeProduct(productRecord);
    const selectedStore = data.store || product.store;

    // Check if the product has twin offers for selected store price
    let selectedPrice = product.currentPrice;
    let selectedShipping = product.shippingFee;

    if (product.twinOffers) {
      const match = product.twinOffers.find(o => o.store === selectedStore);
      if (match) {
        selectedPrice = match.price;
        selectedShipping = match.shippingFee;
      }
    }

    // Check if item already exists in cart for this user/guest with same store
    const existing = await prisma.cartItem.findFirst({
      where: {
        ...(userId ? { userId } : { guestId }),
        productId,
        selectedStore,
      },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
      return {
        id: updated.id,
        productId: updated.productId,
        product: deserializeProduct(updated.product),
        selectedStore: updated.selectedStore as StoreName,
        selectedPrice: updated.selectedPrice,
        selectedShipping: updated.selectedShipping,
        quantity: updated.quantity,
      };
    }

    const created = await prisma.cartItem.create({
      data: {
        userId,
        guestId,
        productId,
        selectedStore,
        selectedPrice,
        selectedShipping,
        quantity,
      },
      include: { product: true },
    });

    return {
      id: created.id,
      productId: created.productId,
      product: deserializeProduct(created.product),
      selectedStore: created.selectedStore as StoreName,
      selectedPrice: created.selectedPrice,
      selectedShipping: created.selectedShipping,
      quantity: created.quantity,
    };
  }

  public async updateQuantity(cartItemId: string, quantity: number, userId?: string, guestId?: string) {
    if (quantity <= 0) {
      return this.removeItem(cartItemId, userId, guestId);
    }

    const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!item) {
      throw new Error('Cart item not found.');
    }

    if (userId && item.userId !== userId) {
      throw new Error('Unauthorized to modify this cart item.');
    }
    if (!userId && guestId && item.guestId !== guestId) {
      throw new Error('Unauthorized to modify this cart item.');
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    });

    return {
      id: updated.id,
      productId: updated.productId,
      product: deserializeProduct(updated.product),
      selectedStore: updated.selectedStore as StoreName,
      selectedPrice: updated.selectedPrice,
      selectedShipping: updated.selectedShipping,
      quantity: updated.quantity,
    };
  }

  public async removeItem(cartItemId: string, userId?: string, guestId?: string) {
    const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!item) {
      return { success: true };
    }

    if (userId && item.userId !== userId) {
      throw new Error('Unauthorized to delete this cart item.');
    }
    if (!userId && guestId && item.guestId !== guestId) {
      throw new Error('Unauthorized to delete this cart item.');
    }

    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return { success: true };
  }

  public calculateOptimizations(items: any[]): CartOptimizationResult {
    let originalTotal = 0;
    let optimizedTotal = 0;
    const optimizations: CartOptimizationResult['optimizations'] = [];

    for (const item of items) {
      const currentCost = (item.selectedPrice + item.selectedShipping) * item.quantity;
      originalTotal += currentCost;

      const product = item.product;
      if (product.twinOffers && product.twinOffers.length > 0) {
        const bestOffer = product.twinOffers.reduce((best: any, cur: any) => {
          return cur.finalPrice < best.finalPrice ? cur : best;
        }, product.twinOffers[0]);

        const currentFinalPrice = item.selectedPrice + item.selectedShipping;
        if (bestOffer && bestOffer.finalPrice < currentFinalPrice) {
          const itemSavings = (currentFinalPrice - bestOffer.finalPrice) * item.quantity;
          optimizations.push({
            cartItemId: item.id,
            productName: product.name,
            currentStore: item.selectedStore,
            currentPrice: currentFinalPrice,
            recommendedStore: bestOffer.store,
            recommendedPrice: bestOffer.finalPrice,
            savings: itemSavings,
            reason: `Found on ${bestOffer.store} for ₹${bestOffer.finalPrice.toLocaleString('en-IN')} (${bestOffer.deliveryText})`,
          });
          optimizedTotal += bestOffer.finalPrice * item.quantity;
          continue;
        }
      }

      optimizedTotal += currentCost;
    }

    const totalSavings = originalTotal - optimizedTotal;
    const savingsPercentage = originalTotal > 0 ? Math.round((totalSavings / originalTotal) * 100) : 0;

    return {
      originalTotal,
      optimizedTotal,
      totalSavings,
      savingsPercentage,
      optimizations,
    };
  }

  public async applyOptimizations(userId?: string, guestId?: string) {
    const { items } = await this.getCart(userId, guestId);
    const report = this.calculateOptimizations(items);

    if (report.optimizations.length === 0) {
      return { success: true, message: 'Cart already at optimal pricing.', totalSavings: 0 };
    }

    for (const opt of report.optimizations) {
      await prisma.cartItem.update({
        where: { id: opt.cartItemId },
        data: {
          selectedStore: opt.recommendedStore,
          selectedPrice: opt.recommendedPrice,
          selectedShipping: 0,
        },
      });
    }

    return {
      success: true,
      message: `Successfully applied optimizations saving ₹${report.totalSavings.toLocaleString('en-IN')}!`,
      totalSavings: report.totalSavings,
    };
  }

  public async migrateGuestCartToUser(guestId: string, userId: string) {
    if (!guestId || !userId) return;

    const guestItems = await prisma.cartItem.findMany({ where: { guestId } });
    for (const item of guestItems) {
      const existingUserItem = await prisma.cartItem.findFirst({
        where: { userId, productId: item.productId, selectedStore: item.selectedStore },
      });

      if (existingUserItem) {
        await prisma.cartItem.update({
          where: { id: existingUserItem.id },
          data: { quantity: existingUserItem.quantity + item.quantity },
        });
        await prisma.cartItem.delete({ where: { id: item.id } });
      } else {
        await prisma.cartItem.update({
          where: { id: item.id },
          data: { userId, guestId: null },
        });
      }
    }
  }
}

export const cartService = new CartService();

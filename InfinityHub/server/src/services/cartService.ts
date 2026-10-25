import { prisma } from '../config/db.js';
import { deserializeProduct } from './productService.js';
import { StoreName, StoreOffer } from '../types/index.js';
import { badRequest, forbidden, notFound } from '../utils/httpError.js';

const MAX_LINE_QUANTITY = 99;

/**
 * Merges a product's own twin offers with the offers carried by the other listings of the same
 * product group, so "the same item on another store" is found regardless of which listing the
 * shopper added. Own offers win on conflicts.
 */
function mergeGroupOffers(product: any, siblings: any[]): StoreOffer[] {
  const merged: StoreOffer[] = [...(product.twinOffers ?? [])];
  for (const sibling of siblings) {
    for (const offer of sibling.twinOffers ?? []) {
      if (!merged.some(m => m.store === offer.store)) merged.push(offer);
    }
  }
  return merged;
}

type CartRow = { userId: string | null; guestId: string | null };

/** True when the cart/wishlist/alert row belongs to the caller (user, or guest when signed out). */
function ownsRow(row: CartRow, userId?: string, guestId?: string): boolean {
  if (userId) return row.userId === userId;
  if (guestId) return !row.userId && row.guestId === guestId;
  return false;
}

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
    /** All-in price (item price + shipping) at the recommended store. */
    recommendedPrice: number;
    /** Item price at the recommended store, excluding shipping. */
    recommendedBasePrice: number;
    /** Shipping fee at the recommended store. */
    recommendedShipping: number;
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
    const optimization = await this.calculateOptimizations(deserializedItems);

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
    const { userId, guestId, productId } = data;
    const quantity = data.quantity ?? 1;
    if (!userId && !guestId) {
      throw badRequest('A signed-in session or x-guest-id header is required to use the cart.');
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_LINE_QUANTITY) {
      throw badRequest(`quantity must be a whole number between 1 and ${MAX_LINE_QUANTITY}.`);
    }

    const productRecord = await prisma.product.findUnique({ where: { id: productId } });
    if (!productRecord) {
      throw notFound('Product not found.');
    }

    const product = deserializeProduct(productRecord);
    const selectedStore = data.store || product.store;

    // Check if the product has twin offers for selected store price
    let selectedPrice = product.currentPrice;
    let selectedShipping = product.shippingFee;

    const groupSiblings = product.productGroupId
      ? (await prisma.product.findMany({
          where: { productGroupId: product.productGroupId, id: { not: product.id } },
        })).map(deserializeProduct)
      : [];
    const offers = mergeGroupOffers(product, groupSiblings);

    if (selectedStore !== product.store) {
      // A different store may only be chosen if it is one of this product's verified twin offers.
      const match = offers.find(o => o.store === selectedStore);
      if (!match) {
        throw badRequest(`"${product.name}" is not available at ${selectedStore}.`);
      }
      selectedPrice = match.price;
      selectedShipping = match.shippingFee;
    } else {
      const match = offers.find(o => o.store === selectedStore);
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
        data: { quantity: Math.min(existing.quantity + quantity, MAX_LINE_QUANTITY) },
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
    if (!Number.isInteger(quantity)) {
      throw badRequest('quantity must be a whole number.');
    }
    if (quantity <= 0) {
      await this.removeItem(cartItemId, userId, guestId);
      return null;
    }
    if (quantity > MAX_LINE_QUANTITY) {
      throw badRequest(`quantity cannot exceed ${MAX_LINE_QUANTITY}.`);
    }

    const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!item) {
      throw notFound('Cart item not found.');
    }

    if (!ownsRow(item, userId, guestId)) {
      throw forbidden('You are not allowed to modify this cart item.');
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

    if (!ownsRow(item, userId, guestId)) {
      throw forbidden('You are not allowed to delete this cart item.');
    }

    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return { success: true };
  }

  public async calculateOptimizations(items: any[]): Promise<CartOptimizationResult> {
    // One query for every sibling listing of the products in this cart.
    const groupIds = [...new Set(items.map(i => i.product?.productGroupId).filter(Boolean))] as string[];
    const siblingRows = groupIds.length
      ? (await prisma.product.findMany({ where: { productGroupId: { in: groupIds } } })).map(deserializeProduct)
      : [];

    let originalTotal = 0;
    let optimizedTotal = 0;
    const optimizations: CartOptimizationResult['optimizations'] = [];

    for (const item of items) {
      const currentCost = (item.selectedPrice + item.selectedShipping) * item.quantity;
      originalTotal += currentCost;

      const product = item.product;
      const siblings = siblingRows.filter(r => r.productGroupId === product.productGroupId && r.id !== product.id);
      const offers = mergeGroupOffers(product, siblings);
      if (offers.length > 0) {
        const bestOffer = offers.reduce((best: any, cur: any) => {
          return cur.finalPrice < best.finalPrice ? cur : best;
        }, offers[0]);

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
            recommendedBasePrice: bestOffer.price,
            recommendedShipping: bestOffer.shippingFee,
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
    const report = await this.calculateOptimizations(items);

    if (report.optimizations.length === 0) {
      return { success: true, message: 'Cart already at optimal pricing.', totalSavings: 0 };
    }

    for (const opt of report.optimizations) {
      await prisma.cartItem.update({
        where: { id: opt.cartItemId },
        data: {
          selectedStore: opt.recommendedStore,
          selectedPrice: opt.recommendedBasePrice,
          selectedShipping: opt.recommendedShipping,
        },
      });
    }

    return {
      success: true,
      message: `Successfully applied optimizations saving ₹${report.totalSavings.toLocaleString('en-IN')}!`,
      totalSavings: report.totalSavings,
    };
  }

  /**
   * Moves everything a guest created before signing in (cart, wishlist, price alerts)
   * onto the user's account, merging duplicates.
   */
  public async migrateGuestDataToUser(guestId: string | undefined, userId: string) {
    if (!guestId || !userId) return;

    // Cart
    const guestItems = await prisma.cartItem.findMany({ where: { guestId, userId: null } });
    for (const item of guestItems) {
      const existingUserItem = await prisma.cartItem.findFirst({
        where: { userId, productId: item.productId, selectedStore: item.selectedStore },
      });

      if (existingUserItem) {
        await prisma.cartItem.update({
          where: { id: existingUserItem.id },
          data: { quantity: Math.min(existingUserItem.quantity + item.quantity, MAX_LINE_QUANTITY) },
        });
        await prisma.cartItem.delete({ where: { id: item.id } });
      } else {
        await prisma.cartItem.update({
          where: { id: item.id },
          data: { userId, guestId: null },
        });
      }
    }

    // Wishlist (unique per user + product)
    const guestWishes = await prisma.wishlistItem.findMany({ where: { guestId, userId: null } });
    for (const wish of guestWishes) {
      const already = await prisma.wishlistItem.findFirst({ where: { userId, productId: wish.productId } });
      if (already) {
        await prisma.wishlistItem.delete({ where: { id: wish.id } });
      } else {
        await prisma.wishlistItem.update({ where: { id: wish.id }, data: { userId, guestId: null } });
      }
    }

    // Price alerts
    const guestAlerts = await prisma.priceAlert.findMany({ where: { guestId, userId: null } });
    for (const alert of guestAlerts) {
      await prisma.priceAlert.update({ where: { id: alert.id }, data: { userId, guestId: null } });
    }
  }
}

export { ownsRow };

export const cartService = new CartService();

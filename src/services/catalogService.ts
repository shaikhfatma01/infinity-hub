/**
 * InfinityHub Catalog & Data Service
 *
 * Thin, typed wrappers over the backend REST API. Every method returns already-normalised data
 * (plain arrays/objects) so UI code never has to know the wire format. The shapes here mirror
 * what server/src/controllers/* actually send.
 */
import { api } from './apiClient';
import { Product, CartItem, ShoppingMission, PriceAlert, SharedListItem, StoreName } from '../types';

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CartSummary {
  total: number;
  storeCount: number;
  potentialSavings: number;
}

export interface CartOptimizationItem {
  cartItemId: string;
  productName: string;
  currentStore: StoreName;
  currentPrice: number;
  recommendedStore: StoreName;
  recommendedPrice: number;
  recommendedBasePrice: number;
  recommendedShipping: number;
  savings: number;
  reason: string;
}

export interface CartOptimizationResult {
  originalTotal: number;
  optimizedTotal: number;
  totalSavings: number;
  savingsPercentage: number;
  optimizations: CartOptimizationItem[];
}

export interface VisualMatch {
  product: Product;
  similarityScore: number;
  matchedVisualFeature: string;
}

export interface GroceryShowcase {
  title: string;
  standardPack: { name: string; packSize: string; price: number; unitRate: string; store: string };
  valuePack: {
    name: string;
    packSize: string;
    price: number;
    unitRate: string;
    savingsPerUnit: string;
    store: string;
    isBestValue?: boolean;
  };
}

export interface AiChatReply {
  text: string;
  recommendedProducts?: Product[];
  actionSuggestion?: { label: string; actionType: 'open-cart' | 'open-missions' | 'open-deals' };
  isLiveAi: boolean;
  provider: string;
}

export interface ProviderSummary {
  totalMonitoredStores: number;
  activeLiveIntegrations: number;
  demoModeIntegrations: number;
  notice: string;
  providers: any[];
}

/** Server stores timestamps as ISO strings; show them as a readable local date. */
function mapAlert(a: any): PriceAlert {
  const created = a?.createdAt ? new Date(a.createdAt) : null;
  return {
    id: a.id,
    productId: a.productId,
    productName: a.productName,
    productImage: a.productImage,
    currentPrice: a.currentPrice,
    targetPrice: a.targetPrice,
    store: a.store,
    createdAt: created && !isNaN(created.getTime()) ? created.toLocaleDateString('en-IN') : String(a?.createdAt ?? ''),
    status: a.status === 'TRIGGERED' ? 'TRIGGERED' : 'ACTIVE',
  };
}

export const catalogService = {
  // ── Products ───────────────────────────────────────────────────────────────
  async getProducts(params?: Record<string, any>): Promise<ProductsResponse> {
    return api.get<ProductsResponse>('/products', params);
  },

  /** Loads the entire catalogue (the API caps a page at 200 items). */
  async getAllProducts(): Promise<Product[]> {
    const first = await api.get<ProductsResponse>('/products', { limit: 200, page: 1 });
    const all = [...first.products];
    for (let page = 2; page <= first.totalPages; page++) {
      const next = await api.get<ProductsResponse>('/products', { limit: 200, page });
      all.push(...next.products);
    }
    return all;
  },

  async getProductById(id: string): Promise<{ product: Product; twins: Product[] }> {
    return api.get<{ product: Product; twins: Product[] }>(`/products/${encodeURIComponent(id)}`);
  },

  async getProductTwins(id: string): Promise<{ product: Product | null; twins: Product[]; bestDeal: Product | null }> {
    return api.get(`/products/${encodeURIComponent(id)}/twins`);
  },

  // ── Cart ───────────────────────────────────────────────────────────────────
  async getCart(): Promise<{ items: CartItem[]; summary: CartSummary }> {
    const res = await api.get<{ data: { items: CartItem[]; total: number; storeCount: number; potentialSavings: number } }>('/cart');
    const { items, total, storeCount, potentialSavings } = res.data;
    return { items, summary: { total, storeCount, potentialSavings } };
  },

  async addToCart(data: { productId: string; store?: StoreName; quantity?: number }): Promise<CartItem> {
    const res = await api.post<{ data: CartItem }>('/cart/items', data);
    return res.data;
  },

  /** Returns the updated line, or null when the quantity dropped to zero and the line was removed. */
  async updateCartItem(itemId: string, quantity: number): Promise<CartItem | null> {
    const res = await api.put<{ data: CartItem | null }>(`/cart/items/${encodeURIComponent(itemId)}`, { quantity });
    return res.data ?? null;
  },

  async removeCartItem(itemId: string): Promise<void> {
    await api.delete(`/cart/items/${encodeURIComponent(itemId)}`);
  },

  async optimizeCart(): Promise<CartOptimizationResult> {
    const res = await api.get<{ data: CartOptimizationResult }>('/cart/optimize');
    return res.data;
  },

  async applyOptimizations(): Promise<{ message: string; totalSavings: number }> {
    const res = await api.post<{ message: string; totalSavings: number }>('/cart/apply-optimizations');
    return { message: res.message, totalSavings: res.totalSavings };
  },

  // ── Wishlist ───────────────────────────────────────────────────────────────
  async getWishlist(): Promise<Product[]> {
    const res = await api.get<{ data: Product[] }>('/wishlist');
    return res.data;
  },

  /** Returns true when the product is now saved, false when it was removed. */
  async toggleWishlist(productId: string): Promise<boolean> {
    const res = await api.post<{ isSaved: boolean }>('/wishlist/toggle', { productId });
    return res.isSaved;
  },

  // ── Price Alerts ───────────────────────────────────────────────────────────
  async getPriceAlerts(): Promise<PriceAlert[]> {
    const res = await api.get<{ data: any[] }>('/alerts');
    return res.data.map(mapAlert);
  },

  async createPriceAlert(productId: string, targetPrice: number): Promise<PriceAlert> {
    const res = await api.post<{ data: any }>('/alerts', { productId, targetPrice });
    return mapAlert(res.data);
  },

  async deletePriceAlert(alertId: string): Promise<void> {
    await api.delete(`/alerts/${encodeURIComponent(alertId)}`);
  },

  // ── Shopping Missions ──────────────────────────────────────────────────────
  async getMissions(): Promise<ShoppingMission[]> {
    const res = await api.get<{ data: ShoppingMission[] }>('/missions');
    return res.data;
  },

  async getMissionById(id: string): Promise<ShoppingMission> {
    const res = await api.get<{ data: ShoppingMission }>(`/missions/${encodeURIComponent(id)}`);
    return res.data;
  },

  // ── Grocery Engine ─────────────────────────────────────────────────────────
  async compareGrocery(): Promise<{
    products: Product[];
    showcases: GroceryShowcase[];
    isDemoComparison: boolean;
    notice: string;
  }> {
    const res = await api.get<{ data: any }>('/grocery/compare');
    return res.data;
  },

  // ── Shared Lists ───────────────────────────────────────────────────────────
  async getSharedList(): Promise<{ list: { id: string; name: string; createdBy: string }; items: SharedListItem[] }> {
    const res = await api.get<{ data: { id: string; name: string; createdBy: string; items: SharedListItem[] } }>('/shared-lists');
    const { items, ...list } = res.data;
    return { list, items };
  },

  async addSharedItem(data: {
    name: string;
    addedBy: string;
    category?: string;
    productId?: string;
    quantity?: number;
  }): Promise<SharedListItem> {
    const res = await api.post<{ data: SharedListItem }>('/shared-lists/items', data);
    return res.data;
  },

  /** Flips the purchased flag on the server and returns the new state. */
  async toggleSharedItem(itemId: string): Promise<boolean> {
    const res = await api.patch<{ data: { isPurchased: boolean } }>(`/shared-lists/items/${encodeURIComponent(itemId)}/toggle`);
    return res.data.isPurchased;
  },

  // ── Store provider status ──────────────────────────────────────────────────
  async getProviders(): Promise<ProviderSummary> {
    const res = await api.get<{ data: ProviderSummary }>('/providers');
    return res.data;
  },

  // ── AI chat ────────────────────────────────────────────────────────────────
  async sendAiChat(message: string, history?: { role: 'user' | 'ai'; text: string }[]): Promise<AiChatReply> {
    const res = await api.post<{ data: AiChatReply }>('/ai/chat', { message, history });
    return res.data;
  },

  // ── Visual search ──────────────────────────────────────────────────────────
  async searchByVisualPreset(query: string): Promise<VisualMatch[]> {
    const res = await api.get<{ data: VisualMatch[] }>('/search/visual/preset', { query });
    return res.data;
  },

  async uploadVisualSearch(file: File): Promise<VisualMatch[]> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.upload<{ data: VisualMatch[] }>('/search/visual/upload', formData);
    return res.data;
  },
};

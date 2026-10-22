/**
 * InfinityHub Catalog & Data Service
 * Interacts with product, cart, wishlist, alert, mission, grocery, and shared list endpoints
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

export const catalogService = {
  // Products
  async getProducts(params?: Record<string, any>): Promise<ProductsResponse> {
    return api.get<ProductsResponse>('/products', params);
  },

  async getProductById(id: string): Promise<{ product: Product; twins: any[] }> {
    return api.get<{ product: Product; twins: any[] }>(`/products/${id}`);
  },

  async getProductTwins(id: string): Promise<{ product: Product; twins: any[]; bestDeal: any }> {
    return api.get<{ product: Product; twins: any[]; bestDeal: any }>(`/products/${id}/twins`);
  },

  // Cart
  async getCart(): Promise<{ items: CartItem[]; summary: any }> {
    return api.get<{ items: CartItem[]; summary: any }>('/cart');
  },

  async addToCart(data: {
    productId: string;
    selectedStore?: StoreName;
    selectedPrice?: number;
    selectedShipping?: number;
    quantity?: number;
  }): Promise<{ message: string; item: CartItem }> {
    return api.post<{ message: string; item: CartItem }>('/cart/items', data);
  },

  async updateCartItem(itemId: string, quantity: number): Promise<{ message: string; item: CartItem }> {
    return api.put<{ message: string; item: CartItem }>(`/cart/items/${itemId}`, { quantity });
  },

  async removeCartItem(itemId: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/cart/items/${itemId}`);
  },

  async optimizeCart(): Promise<any> {
    return api.post<any>('/cart/optimize');
  },

  async applyOptimizations(optimizations: any[]): Promise<any> {
    return api.post<any>('/cart/apply-optimizations', { optimizations });
  },

  // Wishlist
  async getWishlist(): Promise<{ wishlist: { id: string; product: Product }[] }> {
    return api.get<{ wishlist: { id: string; product: Product }[] }>('/wishlist');
  },

  async toggleWishlist(productId: string): Promise<{ message: string; inWishlist: boolean }> {
    return api.post<{ message: string; inWishlist: boolean }>('/wishlist/toggle', { productId });
  },

  // Price Alerts
  async getPriceAlerts(): Promise<{ alerts: PriceAlert[] }> {
    return api.get<{ alerts: PriceAlert[] }>('/alerts');
  },

  async createPriceAlert(data: {
    productId: string;
    productName: string;
    productImage: string;
    currentPrice: number;
    targetPrice: number;
    store: StoreName;
  }): Promise<{ message: string; alert: PriceAlert }> {
    return api.post<{ message: string; alert: PriceAlert }>('/alerts', data);
  },

  async deletePriceAlert(alertId: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/alerts/${alertId}`);
  },

  // Shopping Missions
  async getMissions(): Promise<{ missions: ShoppingMission[] }> {
    return api.get<{ missions: ShoppingMission[] }>('/missions');
  },

  async getMissionById(id: string): Promise<{ mission: ShoppingMission }> {
    return api.get<{ mission: ShoppingMission }>(`/missions/${id}`);
  },

  // Grocery Engine
  async compareGrocery(productIds?: string[]): Promise<any> {
    return api.post<any>('/grocery/compare', { productIds });
  },

  // Shared Lists
  async getSharedList(): Promise<{ list: any; items: SharedListItem[] }> {
    return api.get<{ list: any; items: SharedListItem[] }>('/shared-lists');
  },

  async addSharedItem(data: {
    name: string;
    addedBy: string;
    category?: string;
    productId?: string;
    quantity?: number;
  }): Promise<{ message: string; item: SharedListItem }> {
    return api.post<{ message: string; item: SharedListItem }>('/shared-lists/items', data);
  },

  async toggleSharedItem(itemId: string, isPurchased: boolean): Promise<{ message: string; item: SharedListItem }> {
    return api.put<{ message: string; item: SharedListItem }>(`/shared-lists/items/${itemId}`, { isPurchased });
  },

  // Store Providers Status
  async getProviders(): Promise<{ stores: any[]; totalStores: number; liveIntegrations: number; demoModeCount: number }> {
    return api.get<{ stores: any[]; totalStores: number; liveIntegrations: number; demoModeCount: number }>('/providers');
  },

  // AI Chat
  async sendAiChat(message: string, history?: any[]): Promise<any> {
    return api.post<any>('/ai/chat', { message, history });
  },

  // Visual Search
  async searchByVisualPreset(preset: string): Promise<any> {
    return api.get<any>('/search/visual/preset', { preset });
  },

  async uploadVisualSearch(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('image', file);
    return api.upload<any>('/search/visual/upload', formData);
  },
};

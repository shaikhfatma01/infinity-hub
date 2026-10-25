import { prisma } from '../config/db.js';
import { deserializeProduct } from './productService.js';
import { Product } from '../types/index.js';
import { badRequest } from '../utils/httpError.js';

export interface VisualSearchResultItem {
  product: Product;
  similarityScore: number;
  matchedVisualFeature: string;
}

export class VisualSearchService {
  public async searchByPresetOrKeyword(keyword: string): Promise<VisualSearchResultItem[]> {
    const rawProducts = await prisma.product.findMany();
    const products = rawProducts.map(deserializeProduct);
    if (products.length === 0) return [];

    const byId = (id: string) => products.find(p => p.id === id);
    const best = [...products].sort((a, b) => b.infinityScore - a.infinityScore);
    const lower = (keyword || '').toLowerCase();

    if (lower.includes('purse') || lower.includes('bag') || lower.includes('handbag') || lower.includes('leather')) {
      const items: VisualSearchResultItem[] = [];
      const p1 = byId('prod-purse-myntra');
      const p2 = byId('prod-purse-amazon');
      if (p1) items.push({ product: p1, similarityScore: 98, matchedVisualFeature: 'Black pebbled vegan leather texture, satchel silhouette & gold metal accents' });
      if (p2) items.push({ product: p2, similarityScore: 94, matchedVisualFeature: 'Dual top handle geometry & structured tote dimensions' });
      if (items.length > 0) return items;
    }

    if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('nike') || lower.includes('runner')) {
      const p = byId('prod-shoes-myntra');
      if (p) return [{ product: p, similarityScore: 97, matchedVisualFeature: 'Visible Air Max heel bubble, low-top silhouette & athletic contrast detailing' }];
    }

    if (lower.includes('laptop') || lower.includes('screen') || lower.includes('computer') || lower.includes('asus')) {
      const p = byId('prod-laptop-croma');
      if (p) return [{ product: p, similarityScore: 95, matchedVisualFeature: '15.6-inch narrow bezel display, metallic grey lid & slim form-factor' }];
    }

    if (lower.includes('lamp') || lower.includes('light') || lower.includes('decor') || lower.includes('ikea')) {
      const p = byId('prod-lamp-ikea');
      if (p) return [{ product: p, similarityScore: 96, matchedVisualFeature: 'Vintage glass kerosene lantern aesthetic, steel base & rotary dimmer dial' }];
    }

    // Default fallback visual match: the two strongest catalogue items
    const fallback: VisualSearchResultItem[] = [
      { product: best[0], similarityScore: 92, matchedVisualFeature: 'Primary palette and material texture correlation' },
    ];
    if (best[1]) {
      fallback.push({ product: best[1], similarityScore: 88, matchedVisualFeature: 'Form factor and dimensional proportions' });
    }
    return fallback;
  }

  public async searchByUploadedFile(file: Express.Multer.File): Promise<{
    results: VisualSearchResultItem[];
    filename: string;
    fileSizeKb: number;
    detectionMethod: string;
  }> {
    if (!file) {
      throw badRequest('No image file received.');
    }

    // Demo engine: infers visual tags from the original file name (no real computer-vision model is wired up).
    const originalName = file.originalname || '';
    const results = await this.searchByPresetOrKeyword(originalName);

    return {
      results,
      filename: file.originalname,
      fileSizeKb: Math.round(file.size / 1024),
      detectionMethod: 'Filename-based Visual Descriptor Matching (Demo Mode Engine)',
    };
  }
}

export const visualSearchService = new VisualSearchService();

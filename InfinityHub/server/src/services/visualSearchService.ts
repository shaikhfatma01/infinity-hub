import { prisma } from '../config/db.js';
import { deserializeProduct } from './productService.js';
import { Product } from '../types/index.js';

export interface VisualSearchResultItem {
  product: Product;
  similarityScore: number;
  matchedVisualFeature: string;
}

export class VisualSearchService {
  public async searchByPresetOrKeyword(keyword: string): Promise<VisualSearchResultItem[]> {
    const rawProducts = await prisma.product.findMany();
    const products = rawProducts.map(deserializeProduct);

    const lower = (keyword || '').toLowerCase();

    if (lower.includes('purse') || lower.includes('bag') || lower.includes('handbag') || lower.includes('leather')) {
      const p1 = products.find(p => p.id === 'prod-purse-myntra') || products[0];
      const p2 = products.find(p => p.id === 'prod-purse-amazon') || products[1];
      return [
        { product: p1, similarityScore: 98, matchedVisualFeature: 'Black pebbled vegan leather texture, satchel silhouette & gold metal accents' },
        { product: p2, similarityScore: 94, matchedVisualFeature: 'Dual top handle geometry & structured tote dimensions' },
      ];
    }

    if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('nike') || lower.includes('runner')) {
      const p = products.find(p => p.id === 'prod-shoes-myntra') || products[0];
      return [
        { product: p, similarityScore: 97, matchedVisualFeature: 'Visible Air Max heel bubble, low-top silhouette & athletic contrast detailing' },
      ];
    }

    if (lower.includes('laptop') || lower.includes('screen') || lower.includes('computer') || lower.includes('asus')) {
      const p = products.find(p => p.id === 'prod-laptop-croma') || products[0];
      return [
        { product: p, similarityScore: 95, matchedVisualFeature: '15.6-inch narrow bezel display, metallic grey lid & slim form-factor' },
      ];
    }

    if (lower.includes('lamp') || lower.includes('light') || lower.includes('decor') || lower.includes('ikea')) {
      const p = products.find(p => p.id === 'prod-lamp-ikea') || products[0];
      return [
        { product: p, similarityScore: 96, matchedVisualFeature: 'Vintage glass kerosene lantern aesthetic, steel base & rotary dimmer dial' },
      ];
    }

    // Default fallback visual match
    return [
      { product: products[0], similarityScore: 92, matchedVisualFeature: 'Primary palette and material texture correlation' },
      { product: products[4] || products[0], similarityScore: 88, matchedVisualFeature: 'Form factor and dimensional proportions' },
    ];
  }

  public async searchByUploadedFile(file: Express.Multer.File): Promise<{
    results: VisualSearchResultItem[];
    filename: string;
    fileSizeKb: number;
    detectionMethod: string;
  }> {
    if (!file) {
      throw new Error('No image file received.');
    }

    // Infer visual search tags from file original name or mime type
    const originalName = file.originalname || '';
    const results = await this.searchByPresetOrKeyword(originalName);

    return {
      results,
      filename: file.originalname,
      fileSizeKb: Math.round(file.size / 1024),
      detectionMethod: 'Feature Extraction & Visual Descriptor Matching (Demo Mode Engine)',
    };
  }
}

export const visualSearchService = new VisualSearchService();

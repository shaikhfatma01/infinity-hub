import { prisma } from '../config/db.js';
import { Product, StoreName, ProductCategory, SortOption } from '../types/index.js';

export interface ProductQueryFilters {
  search?: string;
  category?: string;
  store?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minDiscount?: number;
  onlyInStock?: boolean;
  onlyTwins?: boolean;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}

export function deserializeProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    productGroupId: dbProduct.productGroupId,
    name: dbProduct.name,
    brand: dbProduct.brand,
    category: dbProduct.category as ProductCategory,
    subCategory: dbProduct.subCategory,
    description: dbProduct.description,
    image: dbProduct.image,
    galleryImages: JSON.parse(dbProduct.galleryImagesJson || '[]'),
    currentPrice: dbProduct.currentPrice,
    originalPrice: dbProduct.originalPrice,
    discountPercent: dbProduct.discountPercent,
    shippingFee: dbProduct.shippingFee,
    finalEstimatedPrice: dbProduct.finalEstimatedPrice,
    rating: dbProduct.rating,
    reviewCount: dbProduct.reviewCount,
    deliveryEstimate: dbProduct.deliveryEstimate,
    deliveryDays: dbProduct.deliveryDays,
    store: dbProduct.store as StoreName,
    inStock: dbProduct.inStock,
    seller: dbProduct.seller,
    sellerTrust: dbProduct.sellerTrust as any,
    sellerTrustScore: dbProduct.sellerTrustScore,
    returnPolicy: dbProduct.returnPolicy,
    warranty: dbProduct.warranty,
    infinityScore: dbProduct.infinityScore,
    infinityScoreBreakdown: JSON.parse(dbProduct.infinityScoreBreakdown || '{}'),
    dealStatus: dbProduct.dealStatus as any,
    dealAnalysisText: dbProduct.dealAnalysisText,
    recentAveragePrice: dbProduct.recentAveragePrice,
    lowestRecordedPrice: dbProduct.lowestRecordedPrice,
    highestRecordedPrice: dbProduct.highestRecordedPrice,
    priceHistory: JSON.parse(dbProduct.priceHistory || '[]'),
    buyRecommendation: dbProduct.buyRecommendation as any,
    buyRecommendationReason: dbProduct.buyRecommendationReason,
    aiReviewSummary: JSON.parse(dbProduct.aiReviewSummary || '{}'),
    ecoScore: dbProduct.ecoScore,
    ecoFactors: JSON.parse(dbProduct.ecoFactors || '{}'),
    specs: JSON.parse(dbProduct.specs || '{}'),
    tags: JSON.parse(dbProduct.tags || '[]'),
    unitPriceText: dbProduct.unitPriceText || undefined,
    unitPriceValue: dbProduct.unitPriceValue || undefined,
    unitType: dbProduct.unitType as any,
    twinOffers: dbProduct.twinOffers ? JSON.parse(dbProduct.twinOffers) : undefined,
    compatibleItems: dbProduct.compatibleItems ? JSON.parse(dbProduct.compatibleItems) : undefined,
    cheaperAlternativeId: dbProduct.cheaperAlternativeId || undefined,
    betterRatedAlternativeId: dbProduct.betterRatedAlternativeId || undefined,
    premiumAlternativeId: dbProduct.premiumAlternativeId || undefined,
  };
}

const BUDGET_PATTERN = /(?:under|below|less than|within|max|budget of)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*)/i;
const RATING_PATTERN = /(\d(?:\.\d)?)\s*(?:star|stars|\+|★)/i;
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'for', 'with', 'and', 'in', 'on', 'of', 'to', 'me', 'my', 'find', 'show', 'get',
  'best', 'good', 'rating', 'rated', 'star', 'stars', 'under', 'below', 'within', 'max', 'budget',
  'less', 'than', 'rs', 'inr', '₹',
]);

/**
 * Splits a natural-language query such as "black purse under ₹1000 with 4+ rating"
 * into structured constraints (budget, rating) and the remaining keywords.
 */
export function parseSearchQuery(query: string) {
  let rest = query.toLowerCase().trim();

  let maxBudget: number | undefined;
  const budgetMatch = rest.match(BUDGET_PATTERN);
  if (budgetMatch) {
    maxBudget = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
    rest = rest.replace(budgetMatch[0], ' ');
  }

  let minRating: number | undefined;
  const ratingMatch = rest.match(RATING_PATTERN);
  if (ratingMatch) {
    minRating = parseFloat(ratingMatch[1]);
    rest = rest.replace(ratingMatch[0], ' ');
  }

  const tokens = rest
    .split(/[^a-z0-9₹]+/i)
    .map(t => t.trim())
    .filter(t => t.length > 0 && !STOP_WORDS.has(t));

  return { maxBudget, minRating, tokens };
}

export class ProductService {
  public async getProducts(filters: ProductQueryFilters) {
    const rawProducts = await prisma.product.findMany();
    let products = rawProducts.map(deserializeProduct);

    // 1. Natural Language or Keyword Search
    if (filters.search && filters.search.trim()) {
      const parsed = parseSearchQuery(filters.search);

      products = products.filter(p => {
        if (parsed.maxBudget !== undefined && p.currentPrice > parsed.maxBudget) return false;
        if (parsed.minRating !== undefined && p.rating < parsed.minRating) return false;
        if (parsed.tokens.length === 0) return true;

        const haystack = [p.name, p.brand, p.category, p.subCategory, p.description, ...p.tags]
          .join(' ')
          .toLowerCase();
        // Every meaningful word of the query must appear somewhere on the product.
        return parsed.tokens.every(token => haystack.includes(token));
      });
    }

    // 2. Category Filter
    if (filters.category && filters.category.trim()) {
      const cats = filters.category.split(',').map(c => c.trim().toLowerCase());
      products = products.filter(p => cats.includes(p.category.toLowerCase()));
    }

    // 3. Store Filter
    if (filters.store && filters.store.trim()) {
      const stores = filters.store.split(',').map(s => s.trim().toLowerCase());
      products = products.filter(p => stores.includes(p.store.toLowerCase()));
    }

    // 4. Price Range
    if (filters.minPrice !== undefined) {
      products = products.filter(p => p.currentPrice >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      products = products.filter(p => p.currentPrice <= filters.maxPrice!);
    }

    // 5. Rating & Discount Filters
    if (filters.minRating !== undefined && filters.minRating > 0) {
      products = products.filter(p => p.rating >= filters.minRating!);
    }
    if (filters.minDiscount !== undefined && filters.minDiscount > 0) {
      products = products.filter(p => p.discountPercent >= filters.minDiscount!);
    }

    // 6. In Stock
    if (filters.onlyInStock) {
      products = products.filter(p => p.inStock);
    }

    // 7. Product Twin Only
    if (filters.onlyTwins) {
      products = products.filter(p => p.twinOffers && p.twinOffers.length > 1);
    }

    // 8. Sorting
    switch (filters.sortBy) {
      case 'lowest-price':
        products.sort((a, b) => a.finalEstimatedPrice - b.finalEstimatedPrice);
        break;
      case 'highest-rating':
        products.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'biggest-discount':
        products.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'fastest-delivery':
        products.sort((a, b) => a.deliveryDays - b.deliveryDays);
        break;
      case 'highest-infinity-score':
      case 'best-value':
      case 'best-match':
      default:
        products.sort((a, b) => b.infinityScore - a.infinityScore);
        break;
    }

    const total = products.length;
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = Math.min(filters.limit && filters.limit > 0 ? filters.limit : 50, 200);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);

    return {
      products: paginatedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  public async getProductById(id: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({ where: { id } });
    if (!p) return null;
    return deserializeProduct(p);
  }

  public async getProductTwins(idOrGroupId: string): Promise<{ productGroupId: string; products: Product[] }> {
    const p = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrGroupId }, { productGroupId: idOrGroupId }],
      },
    });

    if (!p) {
      return { productGroupId: idOrGroupId, products: [] };
    }

    const twinRecords = await prisma.product.findMany({
      where: { productGroupId: p.productGroupId },
    });

    return {
      productGroupId: p.productGroupId,
      products: twinRecords.map(deserializeProduct),
    };
  }

  public async getCategories(): Promise<string[]> {
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return products.map(p => p.category);
  }

  public async getStores(): Promise<string[]> {
    const products = await prisma.product.findMany({
      select: { store: true },
      distinct: ['store'],
    });
    return products.map(p => p.store);
  }
}

export const productService = new ProductService();

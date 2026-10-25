import { Product, FilterState, CartItem, StoreName, StoreOffer } from '../types';
import { getMockProduct } from '../data/mockLookup';

export interface ParsedSearchQuery {
  rawQuery: string;
  category?: string;
  maxBudget?: number;
  minRating?: number;
  color?: string;
  specs?: string[];
  purpose?: string;
  storePreference?: StoreName;
  suggestedTags: string[];
}

/**
 * Natural Language Query Parser for Infinity AI
 */
export function parseNaturalLanguageQuery(query: string): ParsedSearchQuery {
  const lower = query.toLowerCase().trim();
  const parsed: ParsedSearchQuery = {
    rawQuery: query,
    suggestedTags: []
  };

  // 1. Budget extraction (under 1000, under ₹1500, below 60000, max 5000)
  const budgetMatch = lower.match(/(?:under|below|less than|within|max|budget of)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*)/i);
  if (budgetMatch) {
    const cleanNum = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(cleanNum)) {
      parsed.maxBudget = cleanNum;
      parsed.suggestedTags.push(`Max Budget: ₹${cleanNum.toLocaleString('en-IN')}`);
    }
  }

  // 2. Rating extraction (4 star, 4+, 4.5 star)
  const ratingMatch = lower.match(/(\d(?:\.\d)?)\s*(?:star|\+|★)/i);
  if (ratingMatch) {
    const r = parseFloat(ratingMatch[1]);
    if (!isNaN(r)) {
      parsed.minRating = r;
      parsed.suggestedTags.push(`${r}+ Star Rating`);
    }
  }

  // 3. Category & Keyword detection
  if (lower.includes('purse') || lower.includes('handbag') || lower.includes('bag') || lower.includes('satchel')) {
    parsed.category = 'Bags & Purses';
  } else if (lower.includes('laptop') || lower.includes('notebook') || lower.includes('computer')) {
    parsed.category = 'Laptops';
  } else if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('running')) {
    parsed.category = 'Sports & Fitness';
  } else if (lower.includes('blanket') || lower.includes('comforter') || lower.includes('quilt') || lower.includes('bed')) {
    parsed.category = 'Bedding & Blankets';
  } else if (lower.includes('sunscreen') || lower.includes('skincare') || lower.includes('serum') || lower.includes('beauty') || lower.includes('cream')) {
    parsed.category = 'Skincare & Beauty';
  } else if (lower.includes('rice') || lower.includes('oil') || lower.includes('grocery') || lower.includes('food')) {
    parsed.category = 'Grocery';
  } else if (lower.includes('headphone') || lower.includes('earphone') || lower.includes('audio') || lower.includes('watch') || lower.includes('smartwatch')) {
    parsed.category = 'Electronics';
  }

  // 4. Color detection
  const colors = ['black', 'white', 'pink', 'brown', 'blue', 'red', 'green', 'gold', 'beige'];
  for (const c of colors) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(lower)) {
      parsed.color = c;
      parsed.suggestedTags.push(`Color: ${c.charAt(0).toUpperCase() + c.slice(1)}`);
      break;
    }
  }

  // 5. Purpose & Specs
  if (lower.includes('coding') || lower.includes('programming') || lower.includes('developer')) {
    parsed.purpose = 'Programming & Tech';
    parsed.suggestedTags.push('For Coding');
  } else if (lower.includes('college') || lower.includes('study') || lower.includes('student')) {
    parsed.purpose = 'College & Study';
    parsed.suggestedTags.push('College Setup');
  } else if (lower.includes('16gb')) {
    parsed.specs = parsed.specs || [];
    parsed.specs.push('16GB RAM');
    parsed.suggestedTags.push('16GB RAM');
  } else if (lower.includes('anc') || lower.includes('noise cancell')) {
    parsed.specs = parsed.specs || [];
    parsed.specs.push('Active Noise Cancellation');
    parsed.suggestedTags.push('ANC Audio');
  }

  return parsed;
}

/**
 * Filter and Search Products with AI Engine
 */
export function filterProducts(products: Product[], filters: FilterState): Product[] {
  const { searchQuery, selectedStores, selectedCategories, priceRange, minRating, minDiscount, onlyInStock, onlyProductTwins, sortBy } = filters;
  const parsed = searchQuery.trim() ? parseNaturalLanguageQuery(searchQuery) : null;
  const queryLower = searchQuery.toLowerCase().trim();

  let results = products.filter(product => {
    // Search query matching
    if (queryLower) {
      const nameMatch = product.name.toLowerCase().includes(queryLower);
      const brandMatch = product.brand.toLowerCase().includes(queryLower);
      const categoryMatch = product.category.toLowerCase().includes(queryLower);
      const subCatMatch = product.subCategory.toLowerCase().includes(queryLower);
      const tagMatch = product.tags.some(t => t.toLowerCase().includes(queryLower));
      const descMatch = product.description.toLowerCase().includes(queryLower);
      
      // Check natural language parsed tags
      let nlMatch = false;
      if (parsed) {
        if (parsed.category && product.category === parsed.category) nlMatch = true;
        if (parsed.color && product.tags.includes(parsed.color)) nlMatch = true;
        if (parsed.purpose && (product.tags.includes(parsed.purpose.toLowerCase()) || product.description.toLowerCase().includes(parsed.purpose.toLowerCase()))) nlMatch = true;
      }

      if (!nameMatch && !brandMatch && !categoryMatch && !subCatMatch && !tagMatch && !descMatch && !nlMatch) {
        return false;
      }
    }

    // Natural Language Budget override
    if (parsed?.maxBudget && product.currentPrice > parsed.maxBudget) {
      return false;
    }

    // Natural Language Rating override
    if (parsed?.minRating && product.rating < parsed.minRating) {
      return false;
    }

    // Store filter
    if (selectedStores.length > 0 && !selectedStores.includes(product.store)) {
      return false;
    }

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }

    // Price range slider filter
    if (product.currentPrice < priceRange[0] || product.currentPrice > priceRange[1]) {
      return false;
    }

    // Minimum rating filter
    if (product.rating < minRating) {
      return false;
    }

    // Minimum discount filter
    if (product.discountPercent < minDiscount) {
      return false;
    }

    // In Stock filter
    if (onlyInStock && !product.inStock) {
      return false;
    }

    // Only Product Twins filter
    if (onlyProductTwins && (!product.twinOffers || product.twinOffers.length <= 1)) {
      return false;
    }

    return true;
  });

  // Sorting
  switch (sortBy) {
    case 'lowest-price':
      results.sort((a, b) => a.finalEstimatedPrice - b.finalEstimatedPrice);
      break;
    case 'highest-rating':
      results.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case 'biggest-discount':
      results.sort((a, b) => b.discountPercent - a.discountPercent);
      break;
    case 'best-value':
    case 'highest-infinity-score':
      results.sort((a, b) => b.infinityScore - a.infinityScore);
      break;
    case 'fastest-delivery':
      results.sort((a, b) => a.deliveryDays - b.deliveryDays);
      break;
    case 'best-match':
    default:
      results.sort((a, b) => b.infinityScore - a.infinityScore);
      break;
  }

  return results;
}

/**
 * Smart Cart Optimizer Algorithm
 */
export interface CartOptimizationReport {
  originalTotal: number;
  optimizedTotal: number;
  totalSavings: number;
  savingsPercentage: number;
  optimizations: {
    cartItemId: string;
    productName: string;
    currentStore: StoreName;
    currentPrice: number;
    recommendedStore: StoreName;
    /** All-in price (item + shipping) at the recommended store. */
    recommendedPrice: number;
    /** Item price at the recommended store, excluding shipping. */
    recommendedBasePrice: number;
    recommendedShipping: number;
    savings: number;
    reason: string;
  }[];
}

/** Merges a product's own twin offers with those of other listings in its product group. */
function offersForProduct(product: Product, catalogue: Product[]): StoreOffer[] {
  const merged: StoreOffer[] = [...(product.twinOffers ?? [])];
  for (const sibling of catalogue) {
    if (sibling.id === product.id || sibling.productGroupId !== product.productGroupId) continue;
    for (const offer of sibling.twinOffers ?? []) {
      if (!merged.some(m => m.store === offer.store)) merged.push(offer);
    }
  }
  return merged;
}

export function optimizeCart(items: CartItem[], catalogue: Product[] = []): CartOptimizationReport {
  let originalTotal = 0;
  let optimizedTotal = 0;
  const optimizations: CartOptimizationReport['optimizations'] = [];

  for (const item of items) {
    const currentCost = (item.selectedPrice + item.selectedShipping) * item.quantity;
    originalTotal += currentCost;

    // Check if the product has twin offers on other stores
    const product = item.product;
    const offers = offersForProduct(product, catalogue);
    if (offers.length > 0) {
      const bestOffer = offers.reduce((best, cur) => {
        return cur.finalPrice < best.finalPrice ? cur : best;
      }, offers[0]);

      if (bestOffer && bestOffer.finalPrice < item.selectedPrice + item.selectedShipping) {
        const itemSavings = (item.selectedPrice + item.selectedShipping - bestOffer.finalPrice) * item.quantity;
        optimizations.push({
          cartItemId: item.id,
          productName: product.name,
          currentStore: item.selectedStore,
          currentPrice: item.selectedPrice + item.selectedShipping,
          recommendedStore: bestOffer.store,
          recommendedPrice: bestOffer.finalPrice,
          recommendedBasePrice: bestOffer.price,
          recommendedShipping: bestOffer.shippingFee,
          savings: itemSavings,
          reason: `Found on ${bestOffer.store} for ₹${bestOffer.finalPrice.toLocaleString('en-IN')} (${bestOffer.deliveryText})`
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
    optimizations
  };
}

/**
 * Visual Search / Snap & Shop Simulator
 */
export interface VisualMatchResult {
  product: Product;
  similarityScore: number; // e.g. 98%
  matchedVisualFeature: string;
}

export function simulateVisualSearch(imageQueryName: string): VisualMatchResult[] {
  const lower = imageQueryName.toLowerCase();

  if (lower.includes('purse') || lower.includes('bag') || lower.includes('handbag')) {
    return [
      { product: getMockProduct('prod-purse-myntra'), similarityScore: 98, matchedVisualFeature: 'Black pebbled leather structure & gold buckle' },
      { product: getMockProduct('prod-purse-amazon'), similarityScore: 94, matchedVisualFeature: 'Dual handle satchel silhouette' }
    ];
  }

  if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('nike')) {
    return [
      { product: getMockProduct('prod-shoes-myntra'), similarityScore: 97, matchedVisualFeature: 'Visible Air heel cushion & red athletic accents' }
    ];
  }

  if (lower.includes('laptop') || lower.includes('screen') || lower.includes('asus')) {
    return [
      { product: getMockProduct('prod-laptop-croma'), similarityScore: 95, matchedVisualFeature: '15.6-inch thin bezel OLED chassis' }
    ];
  }

  if (lower.includes('lamp') || lower.includes('decor') || lower.includes('light')) {
    return [
      { product: getMockProduct('prod-lamp-ikea'), similarityScore: 96, matchedVisualFeature: 'Vintage glass lantern with rotary brass dimmer' }
    ];
  }

  // Default fallback match
  return [
    { product: getMockProduct('prod-purse-myntra'), similarityScore: 92, matchedVisualFeature: 'Color palette & texture match' },
    { product: getMockProduct('prod-blanket-flipkart'), similarityScore: 89, matchedVisualFeature: 'Form factor and material geometry' }
  ];
}

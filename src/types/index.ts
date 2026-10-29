export type StoreName =
  | 'Amazon'
  | 'Flipkart'
  | 'Myntra'
  | 'Meesho'
  | 'Nykaa'
  | 'Purplle'
  | 'Ajio'
  | 'Tata CLiQ'
  | 'Croma'
  | 'Reliance Digital'
  | 'BigBasket'
  | 'Blinkit'
  | 'Zepto'
  | 'FirstCry'
  | 'Decathlon'
  | 'IKEA';

export type ProductCategory =
  | 'Fashion'
  | 'Bags & Purses'
  | 'Electronics'
  | 'Laptops'
  | 'Skincare & Beauty'
  | 'Home & Living'
  | 'Bedding & Blankets'
  | 'Grocery'
  | 'Sports & Fitness'
  | 'College & Study Setup';

export interface PricePoint {
  date: string;
  price: number;
}

export interface StoreOffer {
  store: StoreName;
  price: number;
  mrp: number;
  discountPercent: number;
  shippingFee: number;
  finalPrice: number;
  rating: number;
  reviewCount: number;
  deliveryDays: number;
  deliveryText: string;
  inStock: boolean;
  seller: string;
  sellerRating: number;
  returnPolicy: string;
  warranty: string;
  url: string;
  isBestDeal?: boolean;
}

export interface Product {
  id: string;
  productGroupId: string; // Used for Product Twin cross-store grouping
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory: string;
  description: string;
  image: string;
  galleryImages: string[];
  currentPrice: number;
  originalPrice: number;
  discountPercent: number;
  shippingFee: number;
  finalEstimatedPrice: number;
  rating: number;
  reviewCount: number;
  deliveryEstimate: string;
  deliveryDays: number;
  store: StoreName;
  inStock: boolean;
  seller: string;
  sellerTrust: 'High' | 'Moderate' | 'Review Needed';
  sellerTrustScore: number;
  returnPolicy: string;
  warranty: string;
  
  // Infinity Intelligence Metrics
  infinityScore: number; // 0 - 100
  infinityScoreBreakdown: {
    priceValue: number;
    userRating: number;
    discountAuthenticity: number;
    deliverySpeed: number;
    sellerTrust: number;
    returnFlexibility: number;
  };
  
  // Deal Analyzer & Price History
  dealStatus: 'REAL DEAL' | 'DISCOUNT ALERT' | 'FAIR PRICE';
  dealAnalysisText: string;
  recentAveragePrice: number;
  lowestRecordedPrice: number;
  highestRecordedPrice: number;
  priceHistory: PricePoint[];
  
  // Should I Buy This Now (Wait or Buy AI)
  buyRecommendation: 'BUY NOW' | 'CONSIDER WAITING' | 'GOOD VALUE';
  buyRecommendationReason: string;
  
  // AI Review Summary
  aiReviewSummary: {
    pros: string[];
    cons: string[];
    positiveSentimentPercent: number;
    summaryParagraph: string;
  };
  
  // Eco Shopping Score
  ecoScore: number; // 0 - 100
  ecoFactors: {
    material: string;
    reusability: string;
    packaging: string;
    lifespan: string;
  };
  
  // Specs & Attributes
  specs: Record<string, string>;
  tags: string[];
  
  // Unit Value for Groceries
  unitPriceText?: string;
  unitPriceValue?: number; // per kg or per 100g
  unitType?: 'kg' | '100g' | 'litre' | 'unit';
  
  // Product Twin offers across other stores
  twinOffers?: StoreOffer[];
  
  // Compatibility items (e.g. for laptops/electronics)
  compatibleItems?: {
    category: string;
    name: string;
    price: number;
    store: StoreName;
    image: string;
  }[];
  
  // Alternative IDs
  cheaperAlternativeId?: string;
  betterRatedAlternativeId?: string;
  premiumAlternativeId?: string;
}

export interface CartItem {
  id: string; // Unique cart line item ID
  productId: string;
  product: Product;
  selectedStore: StoreName;
  selectedPrice: number;
  selectedShipping: number;
  quantity: number;
  hasBetterAlternative?: boolean;
  suggestedTwinStore?: StoreName;
  suggestedSavings?: number;
  suggestedTwinPrice?: number;
}

export interface ShoppingMissionItem {
  id: string;
  category: string;
  name: string;
  allocatedBudget: number;
  selectedProduct: Product;
  alternatives: Product[];
  isRequired: boolean;
}

export interface ShoppingMission {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  targetBudget: number;
  description: string;
  category: string;
  items: ShoppingMissionItem[];
  tips: string[];
}

export interface LookItem {
  type: 'Top' | 'Jeans' | 'Shoes' | 'Bag' | 'Accessories';
  product: Product;
}

export interface SharedListItem {
  id: string;
  name: string;
  addedBy: string;
  category: string;
  matchedProduct?: Product;
  quantity: number;
  isPurchased: boolean;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  currentPrice: number;
  targetPrice: number;
  store: StoreName;
  createdAt: string;
  status: 'ACTIVE' | 'TRIGGERED';
}

export type SortOption =
  | 'best-match'
  | 'lowest-price'
  | 'highest-rating'
  | 'biggest-discount'
  | 'best-value'
  | 'fastest-delivery'
  | 'highest-infinity-score';

export interface FilterState {
  searchQuery: string;
  selectedStores: StoreName[];
  selectedCategories: ProductCategory[];
  priceRange: [number, number];
  minRating: number;
  minDiscount: number;
  onlyInStock: boolean;
  onlyProductTwins: boolean;
  sortBy: SortOption;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  isDemo?: boolean;
  createdAt: string;
}


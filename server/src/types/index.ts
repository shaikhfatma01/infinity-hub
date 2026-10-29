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
  productGroupId: string;
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
  infinityScore: number;
  infinityScoreBreakdown: {
    priceValue: number;
    userRating: number;
    discountAuthenticity: number;
    deliverySpeed: number;
    sellerTrust: number;
    returnFlexibility: number;
  };
  dealStatus: 'REAL DEAL' | 'DISCOUNT ALERT' | 'FAIR PRICE';
  dealAnalysisText: string;
  recentAveragePrice: number;
  lowestRecordedPrice: number;
  highestRecordedPrice: number;
  priceHistory: PricePoint[];
  buyRecommendation: 'BUY NOW' | 'CONSIDER WAITING' | 'GOOD VALUE';
  buyRecommendationReason: string;
  aiReviewSummary: {
    pros: string[];
    cons: string[];
    positiveSentimentPercent: number;
    summaryParagraph: string;
  };
  ecoScore: number;
  ecoFactors: {
    material: string;
    reusability: string;
    packaging: string;
    lifespan: string;
  };
  specs: Record<string, string>;
  tags: string[];
  unitPriceText?: string;
  unitPriceValue?: number;
  unitType?: 'kg' | '100g' | 'litre' | 'unit';
  twinOffers?: StoreOffer[];
  compatibleItems?: {
    category: string;
    name: string;
    price: number;
    store: StoreName;
    image: string;
  }[];
  cheaperAlternativeId?: string;
  betterRatedAlternativeId?: string;
  premiumAlternativeId?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedStore: StoreName;
  selectedPrice: number;
  selectedShipping: number;
  quantity: number;
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

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export type SortOption =
  | 'best-match'
  | 'lowest-price'
  | 'highest-rating'
  | 'biggest-discount'
  | 'best-value'
  | 'fastest-delivery'
  | 'highest-infinity-score';

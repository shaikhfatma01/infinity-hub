import { StoreName, StoreOffer } from '../types/index.js';

export interface StoreProviderMetadata {
  storeName: StoreName;
  displayName: string;
  categorySpecialty: string[];
  integrationType: 'Product Advertising API' | 'Affiliate Feed API' | 'Merchant Feed API' | 'Aggregator Partner API';
  authType: 'API Key & Secret' | 'OAuth 2.0' | 'Affiliate Tracking ID' | 'Partner Token';
  isConfigured: boolean;
  status: 'active' | 'demo_mode' | 'pending_credentials';
  documentation: {
    description: string;
    requiredCredentials: string[];
    apiEndpoint: string;
    rateLimits: string;
    dataFreshness: string;
    setupInstructions: string;
  };
}

export interface StoreProviderAdapter extends StoreProviderMetadata {
  searchOffers: (query: string) => Promise<StoreOffer[]>;
  getOfferByGroupId: (productGroupId: string) => Promise<StoreOffer | null>;
}

/**
 * An env var counts as a credential only when it holds a real value. Blank values and obvious
 * template placeholders ("placeholder", "changeme", "your-key-here") must not flip a store to "live".
 */
export function hasCredential(name: string): boolean {
  const value = (process.env[name] || '').trim();
  if (!value) return false;
  return !/^(placeholder|changeme|change-me|your[-_ ]|replace[-_ ]|xxx|todo)/i.test(value);
}

export const STORE_PROVIDERS_METADATA: Record<StoreName, StoreProviderMetadata> = {
  Amazon: {
    storeName: 'Amazon',
    displayName: 'Amazon India (Amazon.in)',
    categorySpecialty: ['Electronics', 'Laptops', 'Books', 'Home', 'Fashion'],
    integrationType: 'Product Advertising API',
    authType: 'API Key & Secret',
    isConfigured: hasCredential('AMAZON_PAAPI_KEY') && hasCredential('AMAZON_AFFILIATE_TAG'),
    status: (hasCredential('AMAZON_PAAPI_KEY') && hasCredential('AMAZON_AFFILIATE_TAG')) ? 'active' : 'demo_mode',
    documentation: {
      description: 'Amazon Product Advertising API (PA-API v5.0) provides programmatic search, item lookup, and price tracking.',
      requiredCredentials: ['AMAZON_PAAPI_KEY', 'AMAZON_PAAPI_SECRET', 'AMAZON_AFFILIATE_TAG'],
      apiEndpoint: 'https://webservices.amazon.in/paapi5/searchitems',
      rateLimits: '1 request/sec default, scales with qualifying shipped sales revenue.',
      dataFreshness: 'Real-time cache updated every 60 minutes per PA-API policy.',
      setupInstructions: 'Register at Amazon Associates India (affiliate-program.amazon.in), generate PA-API credentials in Tools > Product Advertising API, and add them to server/.env.',
    },
  },
  Flipkart: {
    storeName: 'Flipkart',
    displayName: 'Flipkart Commerce',
    categorySpecialty: ['Electronics', 'Appliances', 'Mobiles', 'Bedding & Blankets', 'Fashion'],
    integrationType: 'Affiliate Feed API',
    authType: 'Affiliate Tracking ID',
    isConfigured: hasCredential('FLIPKART_AFFILIATE_ID') && hasCredential('FLIPKART_AFFILIATE_TOKEN'),
    status: (hasCredential('FLIPKART_AFFILIATE_ID') && hasCredential('FLIPKART_AFFILIATE_TOKEN')) ? 'active' : 'demo_mode',
    documentation: {
      description: 'Flipkart Affiliate API provides delta product feeds, category listings, and price points.',
      requiredCredentials: ['FLIPKART_AFFILIATE_ID', 'FLIPKART_AFFILIATE_TOKEN'],
      apiEndpoint: 'https://affiliate-api.flipkart.net/affiliate/api',
      rateLimits: 'Varies by partner tier; batch XML/JSON feeds downloaded daily/hourly.',
      dataFreshness: 'Hourly delta feeds.',
      setupInstructions: 'Enroll in Flipkart Affiliate Program, generate API token, and set FLIPKART_AFFILIATE_ID in server/.env.',
    },
  },
  Myntra: {
    storeName: 'Myntra',
    displayName: 'Myntra Fashion',
    categorySpecialty: ['Fashion', 'Footwear', 'Bags & Purses', 'Beauty & Lifestyle'],
    integrationType: 'Affiliate Feed API',
    authType: 'Partner Token',
    isConfigured: hasCredential('MYNTRA_PARTNER_API_KEY'),
    status: hasCredential('MYNTRA_PARTNER_API_KEY') ? 'active' : 'demo_mode',
    documentation: {
      description: 'Myntra Partner Network feed distribution for catalog discovery and promotional campaigns.',
      requiredCredentials: ['MYNTRA_PARTNER_API_KEY', 'MYNTRA_AFFILIATE_ID'],
      apiEndpoint: 'https://partner.myntra.com/api/v1/catalog',
      rateLimits: 'Rate-limited per partner SLA.',
      dataFreshness: 'Updated every 4 hours.',
      setupInstructions: 'Apply via Myntra / Cuelinks / EarnKaro affiliate network, obtain publisher feed key, and set MYNTRA_PARTNER_API_KEY.',
    },
  },
  Nykaa: {
    storeName: 'Nykaa',
    displayName: 'Nykaa Beauty & Cosmetics',
    categorySpecialty: ['Skincare & Beauty', 'Cosmetics', 'Fragrance', 'Haircare'],
    integrationType: 'Affiliate Feed API',
    authType: 'Partner Token',
    isConfigured: hasCredential('NYKAA_API_KEY'),
    status: hasCredential('NYKAA_API_KEY') ? 'active' : 'demo_mode',
    documentation: {
      description: 'Nykaa Affiliate Partner feed offering authentic beauty product catalogs and stock status.',
      requiredCredentials: ['NYKAA_API_KEY', 'NYKAA_AFFILIATE_ID'],
      apiEndpoint: 'https://affiliates.nykaa.com/api/feeds',
      rateLimits: '500 requests per day for product queries.',
      dataFreshness: 'Daily product updates.',
      setupInstructions: 'Register on Nykaa Affiliate Hub, acquire feed access API key, and configure NYKAA_API_KEY.',
    },
  },
  Purplle: {
    storeName: 'Purplle',
    displayName: 'Purplle Cosmetics',
    categorySpecialty: ['Skincare & Beauty', 'Makeup', 'Personal Care'],
    integrationType: 'Affiliate Feed API',
    authType: 'Partner Token',
    isConfigured: false,
    status: 'demo_mode',
    documentation: {
      description: 'Purplle affiliate integrations via sub-networks (vCommission/Admitad).',
      requiredCredentials: ['PURPLLE_CAMPAIGN_ID', 'AFFILIATE_NETWORK_TOKEN'],
      apiEndpoint: 'https://api.purplle.com/affiliate/v2',
      rateLimits: 'Feed-based snapshot download.',
      dataFreshness: 'Daily sync.',
      setupInstructions: 'Register through Indian affiliate networks (vCommission/Admitad) for Purplle publisher campaign.',
    },
  },
  Ajio: {
    storeName: 'Ajio',
    displayName: 'Ajio Trends (Reliance)',
    categorySpecialty: ['Fashion', 'Footwear', 'Streetwear', 'Accessories'],
    integrationType: 'Affiliate Feed API',
    authType: 'OAuth 2.0',
    isConfigured: false,
    status: 'demo_mode',
    documentation: {
      description: 'Reliance Retail Ajio Affiliate Partner program.',
      requiredCredentials: ['AJIO_CLIENT_ID', 'AJIO_CLIENT_SECRET'],
      apiEndpoint: 'https://affiliate.ajio.com/api/v1',
      rateLimits: 'Restricted to accredited affiliate networks.',
      dataFreshness: 'Hourly.',
      setupInstructions: 'Sign up with Reliance Retail Affiliate Network or aggregator network to obtain client credentials.',
    },
  },
  'Tata CLiQ': {
    storeName: 'Tata CLiQ',
    displayName: 'Tata CLiQ & Luxury',
    categorySpecialty: ['Fashion', 'Luxury', 'Electronics', 'Footwear'],
    integrationType: 'Merchant Feed API',
    authType: 'API Key & Secret',
    isConfigured: false,
    status: 'demo_mode',
    documentation: {
      description: 'Tata Digital affiliate and catalog syndication interface.',
      requiredCredentials: ['TATACLIQ_PARTNER_KEY'],
      apiEndpoint: 'https://api.tatacliq.com/catalog/v1',
      rateLimits: 'Authorized enterprise partners only.',
      dataFreshness: 'Twice daily.',
      setupInstructions: 'Obtain partner access from Tata Digital Partner Program.',
    },
  },
  Croma: {
    storeName: 'Croma',
    displayName: 'Croma Electronics (Infiniti Retail)',
    categorySpecialty: ['Laptops', 'Audio & Headphones', 'Smartphones', 'Appliances'],
    integrationType: 'Merchant Feed API',
    authType: 'API Key & Secret',
    isConfigured: hasCredential('CROMA_API_KEY'),
    status: hasCredential('CROMA_API_KEY') ? 'active' : 'demo_mode',
    documentation: {
      description: 'Croma (Tata Group) electronics inventory feed for omnichannel pricing and store pickup.',
      requiredCredentials: ['CROMA_API_KEY'],
      apiEndpoint: 'https://api.croma.com/omni/v1/inventory',
      rateLimits: '10 requests/sec for authorized partners.',
      dataFreshness: 'Real-time inventory lookup.',
      setupInstructions: 'Register for Croma Enterprise API access and set CROMA_API_KEY in server/.env.',
    },
  },
  'Reliance Digital': {
    storeName: 'Reliance Digital',
    displayName: 'Reliance Digital Store',
    categorySpecialty: ['Electronics', 'Laptops', 'Wearables', 'Home Audio'],
    integrationType: 'Merchant Feed API',
    authType: 'Partner Token',
    isConfigured: false,
    status: 'demo_mode',
    documentation: {
      description: 'Reliance Retail digital electronics catalog.',
      requiredCredentials: ['RELIANCE_DIGITAL_KEY'],
      apiEndpoint: 'https://www.reliancedigital.in/rcommerce/v1',
      rateLimits: 'Enterprise partner SLA.',
      dataFreshness: 'Hourly.',
      setupInstructions: 'Requires enterprise retailer onboarding with Reliance Retail Ltd.',
    },
  },
  BigBasket: {
    storeName: 'BigBasket',
    displayName: 'BigBasket (Tata Enterprise)',
    categorySpecialty: ['Grocery', 'Staples', 'Fresh Food', 'Household'],
    integrationType: 'Merchant Feed API',
    authType: 'OAuth 2.0',
    isConfigured: false,
    status: 'demo_mode',
    documentation: {
      description: 'BigBasket B2B and Quick grocery catalog feeds with pincode-based inventory.',
      requiredCredentials: ['BIGBASKET_CLIENT_ID', 'BIGBASKET_SECRET'],
      apiEndpoint: 'https://api.bigbasket.com/b2b/v1/catalog',
      rateLimits: 'Restricted per delivery hub.',
      dataFreshness: 'Near real-time based on local hub availability.',
      setupInstructions: 'Apply for BigBasket Enterprise Partner access.',
    },
  },
  Blinkit: {
    storeName: 'Blinkit',
    displayName: 'Blinkit Quick Commerce (Zomato)',
    categorySpecialty: ['Grocery', 'Instant 10-Min Delivery', 'Daily Essentials'],
    integrationType: 'Merchant Feed API',
    authType: 'Partner Token',
    isConfigured: false,
    status: 'demo_mode',
    documentation: {
      description: 'Blinkit Quick-Commerce dark store inventory feeds.',
      requiredCredentials: ['BLINKIT_MERCHANT_KEY'],
      apiEndpoint: 'https://api.blinkit.com/merchant/v1',
      rateLimits: 'Dark store location-specific rates.',
      dataFreshness: 'Dynamic dark store inventory (5-10 min sync).',
      setupInstructions: 'Contact Zomato / Blinkit business development for merchant aggregator access.',
    },
  },
  Zepto: {
    storeName: 'Zepto',
    displayName: 'Zepto 10-Minute Grocery',
    categorySpecialty: ['Grocery', 'Quick Snacks', 'Beverages', 'Personal Care'],
    integrationType: 'Merchant Feed API',
    authType: 'Partner Token',
    isConfigured: false,
    status: 'demo_mode',
    documentation: {
      description: 'Zepto Quick-Commerce API.',
      requiredCredentials: ['ZEPTO_PARTNER_KEY'],
      apiEndpoint: 'https://api.zepto.co/partner/v1',
      rateLimits: 'Dark-store hyperlocal.',
      dataFreshness: 'Real-time dark store stock.',
      setupInstructions: 'Apply via Zepto Business Partner Portal.',
    },
  },
  Meesho: {
    storeName: 'Meesho',
    displayName: 'Meesho Marketplace',
    categorySpecialty: ['Value Fashion', 'Home Decor', 'Affordable Essentials'],
    integrationType: 'Affiliate Feed API',
    authType: 'Affiliate Tracking ID',
    isConfigured: false,
    status: 'demo_mode',
    documentation: {
      description: 'Meesho Reseller / Affiliate catalog feeds for budget-friendly goods.',
      requiredCredentials: ['MEESHO_AFFILIATE_ID'],
      apiEndpoint: 'https://affiliate.meesho.com/api/v1',
      rateLimits: 'Daily product catalog downloads.',
      dataFreshness: 'Daily.',
      setupInstructions: 'Join Meesho Affiliate Program through authorized affiliate networks.',
    },
  },
  FirstCry: {
    storeName: 'FirstCry',
    displayName: 'FirstCry Baby & Kids',
    categorySpecialty: ['Baby & Kids', 'Toys', 'Diapers & Essentials'],
    integrationType: 'Affiliate Feed API',
    authType: 'Partner Token',
    isConfigured: false,
    status: 'demo_mode',
    documentation: {
      description: 'FirstCry affiliate program for baby care and parenting essentials.',
      requiredCredentials: ['FIRSTCRY_AFFILIATE_KEY'],
      apiEndpoint: 'https://affiliate.firstcry.com/api',
      rateLimits: 'Batch daily sync.',
      dataFreshness: 'Daily.',
      setupInstructions: 'Register on FirstCry Affiliate Portal.',
    },
  },
  Decathlon: {
    storeName: 'Decathlon',
    displayName: 'Decathlon Sports India',
    categorySpecialty: ['Sports & Fitness', 'Running', 'Gym Equipment', 'Outdoor'],
    integrationType: 'Merchant Feed API',
    authType: 'API Key & Secret',
    isConfigured: false,
    status: 'demo_mode',
    documentation: {
      description: 'Decathlon developer portal offering sports gear specifications and stock availability.',
      requiredCredentials: ['DECATHLON_DEV_API_KEY'],
      apiEndpoint: 'https://api.decathlon.net/v1',
      rateLimits: '100 requests/minute for approved developers.',
      dataFreshness: 'Hourly.',
      setupInstructions: 'Sign up at developer.decathlon.com and register your application.',
    },
  },
  IKEA: {
    storeName: 'IKEA',
    displayName: 'IKEA India (Furniture & Living)',
    categorySpecialty: ['Home & Living', 'Furniture', 'Lighting & Decor', 'Bedding'],
    integrationType: 'Merchant Feed API',
    authType: 'API Key & Secret',
    isConfigured: false,
    status: 'demo_mode',
    documentation: {
      description: 'IKEA Global Developer Platform API for product catalog, stock check, and store availability.',
      requiredCredentials: ['IKEA_DEVELOPER_KEY'],
      apiEndpoint: 'https://api.ikea.com/products/v1',
      rateLimits: 'Standard API portal quota (60 req/min).',
      dataFreshness: 'Real-time stock query per city/warehouse.',
      setupInstructions: 'Register at developer.ikea.com to create application credentials.',
    },
  },
};

/**
 * Adapter Manager that dynamically routes queries to live or demo provider implementations
 */
export class StoreAdapterManager {
  private providers: Record<StoreName, StoreProviderMetadata> = STORE_PROVIDERS_METADATA;

  public getAllProviders(): StoreProviderMetadata[] {
    return Object.values(this.providers);
  }

  public getProvider(storeName: StoreName): StoreProviderMetadata | undefined {
    return this.providers[storeName];
  }

  public getIntegrationSummary() {
    const list = Object.values(this.providers);
    const total = list.length;
    const active = list.filter(p => p.status === 'active').length;
    const demoMode = list.filter(p => p.status === 'demo_mode').length;

    return {
      totalMonitoredStores: total,
      activeLiveIntegrations: active,
      demoModeIntegrations: demoMode,
      notice: 'In compliance with platform rules, only stores with configured API/affiliate credentials operate in live mode. All other stores operate in honest, transparent demo mode with realistic market datasets.',
      providers: list,
    };
  }
}

export const storeAdapterManager = new StoreAdapterManager();

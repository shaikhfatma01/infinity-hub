import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Layers, 
  TrendingDown, 
  SearchCheck, 
  Camera, 
  Target, 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Check
} from 'lucide-react';

export const TheInfinityDifference: React.FC = () => {
  const { 
    setIsAskAiOpen, 
    setIsMissionsModalOpen, 
    setIsSnapShopModalOpen, 
    setIsCartOpen,
    setActiveTab,
    setFilters
  } = useApp();

  const features = [
    {
      id: 'ai-agent',
      icon: Bot,
      title: 'Infinity AI Shopping Agent',
      subtitle: 'Natural Language Intelligence',
      badge: 'Core Intelligence',
      description: 'Describe what you need in plain English: "Black purse under ₹1000 with 4+ rating" or "Laptop under ₹60000 for coding". The AI extracts constraints, filters stores, and explains the best choice.',
      cta: 'Chat with AI Agent',
      action: () => setIsAskAiOpen(true),
      gradient: 'from-pink-100 to-cream-50'
    },
    {
      id: 'product-twin',
      icon: Layers,
      title: 'Product Twin™ Detection',
      subtitle: 'Cross-Store Duplicate Matching',
      badge: 'Signature Tech',
      description: 'When the same sneaker, laptop, or blanket is listed on Amazon, Flipkart, Myntra, and Croma, InfinityHub links them into one Product Twin card showing all prices, shipping fees, and true savings.',
      cta: 'Explore Product Twins',
      action: () => {
        setFilters(prev => ({ ...prev, onlyProductTwins: true }));
        setActiveTab('shop');
      },
      gradient: 'from-cream-50 to-pink-100/60'
    },
    {
      id: 'cart-optimizer',
      icon: TrendingDown,
      title: 'Smart Cart Optimizer',
      subtitle: 'Multi-Store Basket Reduction',
      badge: 'Cost Savings',
      description: 'Combine items from 5 different stores into one workspace. Click "Optimize My Cart" to detect identical cheaper listings or better-rated alternatives and save thousands in one click.',
      cta: 'View Multi-Store Cart',
      action: () => setIsCartOpen(true),
      gradient: 'from-pink-100/80 to-cream-100'
    },
    {
      id: 'deal-analyzer',
      icon: SearchCheck,
      title: 'Infinity Deal Analyzer',
      subtitle: 'Truth in Advertised Discounts',
      badge: 'Anti-Fake Sale',
      description: 'Ever seen "70% OFF" that is actually more expensive than last week? Our Deal Analyzer scans 30-day price curves and flags Real Deals 🟢 vs Discount Alerts ⚠️.',
      cta: 'Browse Real Deals',
      action: () => setActiveTab('deals'),
      gradient: 'from-cream-100 to-pink-50'
    },
    {
      id: 'snap-shop',
      icon: Camera,
      title: 'Snap & Shop Visual Search',
      subtitle: 'Image-Based Product Finder',
      badge: 'Computer Vision',
      description: 'Upload a photo or screenshot of any handbag, dress, shoe, or home decor item. InfinityHub finds matching aesthetic items across 15+ retailers with similarity percentages.',
      cta: 'Try Image Search',
      action: () => setIsSnapShopModalOpen(true),
      gradient: 'from-pink-50 to-cream-50'
    },
    {
      id: 'infinity-score',
      icon: Target,
      title: 'Infinity Score (0-100)',
      subtitle: 'Holistic Quality & Value Metric',
      badge: 'Proprietary Index',
      description: 'We calculate a composite score using 6 weighted dimensions: Price Value, Verified User Rating, Discount Authenticity, Delivery Speed, Seller Trust, and Return Flexibility.',
      cta: 'View Top Rated Items',
      action: () => {
        setFilters(prev => ({ ...prev, sortBy: 'highest-infinity-score' }));
        setActiveTab('shop');
      },
      gradient: 'from-cream-50 to-pink-100'
    },
    {
      id: 'shopping-missions',
      icon: GraduationCap,
      title: 'Shopping Missions',
      subtitle: 'Goal & Budget-Driven Shopping',
      badge: 'Flagship Feature',
      description: 'Instead of searching 10 separate items, tell InfinityHub: "I have ₹15,000 for my college setup". The AI builds a complete balanced basket across stores and optimizes the total.',
      cta: 'Launch ₹15k College Demo',
      action: () => setIsMissionsModalOpen(true),
      gradient: 'from-pink-200/60 to-cream-50',
      isHero: true
    }
  ];

  return (
    <section className="py-20 bg-cream-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            The Infinity Difference
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950 tracking-tight">
            Seven Pillars of AI-Powered Universal Commerce
          </h2>
          <p className="mt-4 text-sm sm:text-base text-chocolate-700 font-light leading-relaxed">
            InfinityHub transforms fragmented, chaotic online shopping into one unified, intelligent, and transparent experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className={`group relative rounded-3xl p-7 transition-all duration-300 border border-pink-200/80 shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 flex flex-col justify-between ${
                  feat.isHero 
                    ? 'md:col-span-2 lg:col-span-3 bg-gradient-to-r from-pink-100 via-pink-50 to-cream-100 border-pink-300' 
                    : `bg-gradient-to-br ${feat.gradient}`
                }`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-pink-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-chocolate-900" />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/90 text-chocolate-800 px-3 py-1 rounded-full border border-pink-200 shadow-xs">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="text-xs font-semibold text-pink-600 uppercase tracking-wider mb-1">
                    {feat.subtitle}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-chocolate-950 mb-3">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-chocolate-800/90 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Bottom Interactive CTA Button */}
                <div className="mt-6 pt-4 border-t border-pink-200/50">
                  <button
                    onClick={feat.action}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-chocolate-950 group-hover:text-pink-600 transition-colors cursor-pointer"
                  >
                    <span>{feat.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

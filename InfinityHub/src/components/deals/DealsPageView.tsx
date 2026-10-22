import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../catalog/ProductCard';
import { Flame, Sparkles, Tag, ShieldCheck, Clock, Zap, ArrowRight } from 'lucide-react';

export const DealsPageView: React.FC = () => {
  const { products, setActiveTab } = useApp();
  const [selectedSection, setSelectedSection] = useState<'all' | 'under1000' | 'under5000' | 'biggest' | 'buynow'>('all');

  const filteredDeals = products.filter(product => {
    if (selectedSection === 'under1000') return product.currentPrice <= 1000;
    if (selectedSection === 'under5000') return product.currentPrice <= 5000;
    if (selectedSection === 'biggest') return product.discountPercent >= 40;
    if (selectedSection === 'buynow') return product.buyRecommendation === 'BUY NOW';
    return true;
  });

  return (
    <div className="py-10 bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 fill-rose-500" />
            Feature 34 • Today's Verified Deals
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950">
            Real Deals & Price Drops
          </h1>
          <p className="mt-3 text-sm sm:text-base text-chocolate-700 font-light leading-relaxed">
            Every listing on this page has passed our 30-day historical discount analyzer to weed out artificially inflated sales.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {[
            { id: 'all', label: '🔥 All Real Deals' },
            { id: 'buynow', label: '🟢 Buy Now Signals' },
            { id: 'biggest', label: '⚡ 40%+ Discounts' },
            { id: 'under1000', label: '🏷️ Under ₹1,000' },
            { id: 'under5000', label: '💎 Under ₹5,000' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedSection(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedSection === tab.id
                  ? 'bg-chocolate-900 text-cream-50 shadow-sm'
                  : 'bg-white text-chocolate-700 hover:bg-pink-100 border border-pink-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDeals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
};

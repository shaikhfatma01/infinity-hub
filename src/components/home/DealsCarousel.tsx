import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../catalog/ProductCard';
import { Flame, Sparkles, ArrowRight, Tag, Clock, ShieldCheck } from 'lucide-react';

export const DealsCarousel: React.FC = () => {
  const { products, setActiveTab, setFilters } = useApp();
  const [activeDealFilter, setActiveDealFilter] = useState<'all' | 'under1000' | 'under5000' | 'biggest-discount'>('all');

  const dealTabs = [
    { id: 'all', label: '🔥 All Real Deals' },
    { id: 'biggest-discount', label: '⚡ Biggest Discounts' },
    { id: 'under1000', label: '🏷️ Under ₹1,000' },
    { id: 'under5000', label: '💎 Under ₹5,000' },
  ];

  const verifiedDeals = products.filter(product => product.dealStatus === 'REAL DEAL');

  const filteredDeals = verifiedDeals.filter(product => {
    if (activeDealFilter === 'under1000') return product.currentPrice <= 1000;
    if (activeDealFilter === 'under5000') return product.currentPrice <= 5000;
    if (activeDealFilter === 'biggest-discount') return product.discountPercent >= 40;
    return true;
  });

  return (
    <section className="py-16 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 fill-rose-500" />
              Verified Deal Intelligence
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
              Today's Best Verified Deals
            </h2>
            <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
              Every deal below is verified against 30-day price trends. Zero deceptive markups.
            </p>
          </div>

          {/* Deal Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {dealTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveDealFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeDealFilter === tab.id
                    ? 'bg-chocolate-900 text-cream-50 shadow-sm'
                    : 'bg-white text-chocolate-700 hover:bg-pink-100 border border-pink-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDeals.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Deals Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => setActiveTab('deals')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white hover:bg-pink-100 text-chocolate-900 border border-pink-300 font-bold text-xs sm:text-sm shadow-soft transition-all cursor-pointer"
          >
            <span>Explore All {verifiedDeals.length} Verified Deals</span>
            <ArrowRight className="w-4 h-4 text-pink-600" />
          </button>
        </div>

      </div>
    </section>
  );
};

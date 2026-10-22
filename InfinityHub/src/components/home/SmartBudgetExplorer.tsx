import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../catalog/ProductCard';
import { Wallet, Sparkles, SlidersHorizontal, ShieldCheck, ArrowRight } from 'lucide-react';

export const SmartBudgetExplorer: React.FC = () => {
  const { products, setActiveTab, setFilters } = useApp();
  const [targetBudget, setTargetBudget] = useState<number>(5000);
  const [budgetMode, setBudgetMode] = useState<'overall' | 'cheapest' | 'best-value' | 'fastest'>('overall');

  const budgetModes = [
    { id: 'overall', label: '🏆 Best Overall' },
    { id: 'cheapest', label: '💰 Lowest Price' },
    { id: 'best-value', label: '⭐ Highest Rated' },
    { id: 'fastest', label: '⚡ Fastest 1-Day Delivery' }
  ];

  const budgetFilteredProducts = products.filter(p => p.currentPrice <= targetBudget).sort((a, b) => {
    if (budgetMode === 'cheapest') return a.currentPrice - b.currentPrice;
    if (budgetMode === 'best-value') return b.rating - a.rating;
    if (budgetMode === 'fastest') return a.deliveryDays - b.deliveryDays;
    return b.infinityScore - a.infinityScore;
  });

  return (
    <section className="py-16 bg-gradient-to-b from-cream-50 to-pink-50/40 border-t border-pink-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Slider */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-soft mb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Wallet className="w-3.5 h-3.5" />
                Feature 32 • Smart Budget Mode
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
                Shop Within Your Exact Budget
              </h2>
              <p className="text-xs sm:text-sm text-chocolate-700 mt-1">
                Infinity AI curates highest-rated gear and wardrobe essentials without exceeding your limit.
              </p>
            </div>

            {/* Budget Controls */}
            <div className="w-full lg:w-96 bg-cream-100/80 p-4 rounded-2xl border border-pink-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-chocolate-800 uppercase tracking-wide">Target Budget:</span>
                <span className="font-serif text-xl font-bold text-chocolate-950 bg-white px-3 py-0.5 rounded-lg border border-pink-200 shadow-xs">
                  ₹{targetBudget.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="60000"
                step="500"
                value={targetBudget}
                onChange={(e) => setTargetBudget(Number(e.target.value))}
                className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-chocolate-900"
              />
              <div className="flex justify-between text-[10px] text-chocolate-500 font-semibold mt-1">
                <span>₹500</span>
                <span>₹15,000</span>
                <span>₹60,000</span>
              </div>
            </div>

          </div>

          {/* Budget Optimization Modes */}
          <div className="mt-6 pt-4 border-t border-pink-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-chocolate-600 mr-2 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Optimization Mode:
              </span>
              {budgetModes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setBudgetMode(mode.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    budgetMode === mode.id
                      ? 'bg-chocolate-900 text-cream-50 shadow-sm'
                      : 'bg-white text-chocolate-700 hover:bg-pink-100 border border-pink-200'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-chocolate-600 font-medium">
              Showing <span className="font-bold text-chocolate-950">{budgetFilteredProducts.length} items</span> under ₹{targetBudget.toLocaleString('en-IN')}
            </div>
          </div>

        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {budgetFilteredProducts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

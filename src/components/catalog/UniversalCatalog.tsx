import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { StoreName, ProductCategory, SortOption } from '../../types';
import { 
  Filter, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  SlidersHorizontal, 
  Search, 
  X, 
  Check, 
  ChevronDown,
  ArrowUpDown,
  ShoppingBag
} from 'lucide-react';

export const UniversalCatalog: React.FC = () => {
  const { 
    filteredProducts, 
    filters, 
    updateFilter, 
    resetFilters, 
    searchQuery, 
    setSearchQuery,
    handleSearchSubmit,
    isSearching,
    maxCatalogPrice
  } = useApp();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const allStores: StoreName[] = [
    'Amazon', 'Flipkart', 'Myntra', 'Nykaa', 'Croma', 'Ajio', 'BigBasket', 'Blinkit', 'Zepto', 'Tata CLiQ', 'Meesho', 'IKEA', 'Decathlon'
  ];

  const allCategories: ProductCategory[] = [
    'Bags & Purses', 'Laptops', 'Sports & Fitness', 'Skincare & Beauty', 'Bedding & Blankets', 'Grocery', 'Electronics', 'Home & Living'
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'best-match', label: '✨ Best Match (Infinity Score)' },
    { value: 'lowest-price', label: '💰 Lowest Final Cost' },
    { value: 'highest-rating', label: '⭐ Highest Rating' },
    { value: 'biggest-discount', label: '⚡ Biggest Discount' },
    { value: 'fastest-delivery', label: '🚀 Fastest Delivery' },
    { value: 'highest-infinity-score', label: '🏆 Highest Infinity Score' }
  ];

  const toggleStore = (store: StoreName) => {
    const exists = filters.selectedStores.includes(store);
    const updated = exists 
      ? filters.selectedStores.filter(s => s !== store)
      : [...filters.selectedStores, store];
    updateFilter('selectedStores', updated);
  };

  const toggleCategory = (cat: ProductCategory) => {
    const exists = filters.selectedCategories.includes(cat);
    const updated = exists 
      ? filters.selectedCategories.filter(c => c !== cat)
      : [...filters.selectedCategories, cat];
    updateFilter('selectedCategories', updated);
  };

  return (
    <div className="py-8 bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="mb-6 pb-4 border-b border-pink-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
                Universal Multi-Store Catalog
              </h1>
              <span className="bg-pink-100 text-chocolate-900 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-pink-300">
                {filteredProducts.length} Items Found
              </span>
            </div>
            <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
              {searchQuery ? `Infinity AI matched offers for "${searchQuery}" across multiple stores.` : 'Aggregated live feeds from 15+ leading stores.'}
            </p>
          </div>

          {/* Right Controls: Sort & Mobile Filter Trigger */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white px-3 py-1.5 rounded-2xl border border-pink-200 shadow-xs">
              <ArrowUpDown className="w-4 h-4 text-chocolate-500 mr-2" />
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as SortOption)}
                className="bg-transparent text-xs font-bold text-chocolate-900 focus:outline-none cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-3.5 py-1.5 rounded-2xl bg-white border border-pink-300 text-chocolate-900 text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Filter className="w-4 h-4 text-pink-600" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Store Filter Chips Ribbon (Feature 7) */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-xs font-bold text-chocolate-600 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-pink-500" /> Stores:
            </span>
            {allStores.map(store => {
              const isSelected = filters.selectedStores.includes(store);
              return (
                <button
                  key={store}
                  onClick={() => toggleStore(store)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-chocolate-900 text-cream-50 shadow-sm border border-chocolate-950'
                      : 'bg-white text-chocolate-800 hover:bg-pink-100 border border-pink-200'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-pink-300" />}
                  <span>{store}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} lg:col-span-1 space-y-6`}>
            <div className="bg-white rounded-3xl p-6 border border-pink-200 shadow-soft sticky top-24">
              
              <div className="flex items-center justify-between pb-4 border-b border-pink-100 mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-pink-600" />
                  <h3 className="font-serif text-base font-bold text-chocolate-950">Refine Search</h3>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-bold text-chocolate-500 hover:text-pink-600 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Product Twin Toggle Filter (Feature 8) */}
              <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-pink-100 to-cream-100 border border-pink-300">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-chocolate-950 block">Only Product Twins™</span>
                    <span className="text-[10px] text-chocolate-600">Available across multiple stores</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.onlyProductTwins}
                    onChange={(e) => updateFilter('onlyProductTwins', e.target.checked)}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-400 accent-pink-600"
                  />
                </label>
              </div>

              {/* Category Filter Tree */}
              <div className="mb-6">
                <h4 className="text-xs font-extrabold text-chocolate-900 uppercase tracking-wider mb-3">
                  Categories
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {allCategories.map(cat => {
                    const isCatSelected = filters.selectedCategories.includes(cat);
                    return (
                      <label 
                        key={cat}
                        className="flex items-center gap-2 text-xs text-chocolate-800 hover:text-chocolate-950 cursor-pointer p-1 rounded-lg hover:bg-pink-50"
                      >
                        <input
                          type="checkbox"
                          checked={isCatSelected}
                          onChange={() => toggleCategory(cat)}
                          className="w-3.5 h-3.5 text-pink-600 rounded accent-pink-600"
                        />
                        <span>{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-extrabold text-chocolate-900 uppercase tracking-wider mb-2">
                  <span>Price Range</span>
                  <span className="text-pink-600 font-bold font-sans">
                    ₹{filters.priceRange[0]} - ₹{filters.priceRange[1].toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxCatalogPrice}
                  step="500"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                  className="w-full h-1.5 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-chocolate-900"
                />
              </div>

              {/* Minimum Rating */}
              <div className="mb-6">
                <h4 className="text-xs font-extrabold text-chocolate-900 uppercase tracking-wider mb-2">
                  Customer Rating
                </h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {[0, 4.0, 4.5].map(r => (
                    <button
                      key={r}
                      onClick={() => updateFilter('minRating', r)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filters.minRating === r
                          ? 'bg-chocolate-900 text-cream-50'
                          : 'bg-cream-100 text-chocolate-800 hover:bg-pink-100 border border-pink-200'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}★+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Discount */}
              <div className="mb-5">
                <h4 className="text-xs font-extrabold text-chocolate-900 uppercase tracking-wider mb-2">
                  Minimum Discount
                </h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {[0, 20, 50].map(d => (
                    <button
                      key={d}
                      onClick={() => updateFilter('minDiscount', d)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filters.minDiscount === d
                          ? 'bg-chocolate-900 text-cream-50'
                          : 'bg-cream-100 text-chocolate-800 hover:bg-pink-100 border border-pink-200'
                      }`}
                    >
                      {d === 0 ? 'All' : `${d}%+`}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            
            {/* Loading Skeleton */}
            {isSearching ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="bg-white rounded-3xl p-5 border border-pink-200 h-96 flex flex-col justify-between">
                    <div className="w-full h-48 bg-pink-100 rounded-2xl mb-4"></div>
                    <div className="space-y-2">
                      <div className="w-3/4 h-4 bg-pink-100 rounded"></div>
                      <div className="w-1/2 h-3 bg-pink-50 rounded"></div>
                    </div>
                    <div className="w-full h-10 bg-cream-200 rounded-xl mt-4"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State (Feature 42) */
              <div className="bg-white rounded-3xl p-12 text-center border border-pink-200 shadow-soft max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-4 font-serif text-2xl">
                  🔍
                </div>
                <h3 className="font-serif text-xl font-bold text-chocolate-950 mb-2">
                  No matching products found
                </h3>
                <p className="text-xs text-chocolate-700 leading-relaxed mb-6">
                  Infinity AI scanned 15+ stores but couldn't find items with your current filter criteria.
                </p>

                <div className="bg-cream-100 p-4 rounded-2xl border border-pink-200 text-left text-xs space-y-2 mb-6">
                  <span className="font-bold text-chocolate-900 block">AI Suggestions:</span>
                  <div className="text-chocolate-700 flex items-center gap-1.5">
                    • Try increasing your budget slider
                  </div>
                  <div className="text-chocolate-700 flex items-center gap-1.5">
                    • Remove store or rating constraints
                  </div>
                  <div className="text-chocolate-700 flex items-center gap-1.5">
                    • Search for general keywords like "purse", "shoes", "laptop"
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-2xl bg-chocolate-900 text-cream-50 text-xs font-bold hover:bg-chocolate-800 shadow-sm transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};

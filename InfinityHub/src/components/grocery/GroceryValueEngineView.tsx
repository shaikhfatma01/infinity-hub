import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBasket, Sparkles, Store, CheckCircle2, TrendingDown, ArrowRight, ShoppingBag } from 'lucide-react';

export const GroceryValueEngineView: React.FC = () => {
  const { products, addToCart, setSelectedProduct } = useApp();

  const groceryProducts = products.filter(p => p.category === 'Grocery');

  return (
    <div className="py-10 bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ShoppingBasket className="w-3.5 h-3.5" />
            Feature 21 • Unit Rate Intelligence
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950">
            Grocery Value Engine™
          </h1>
          <p className="mt-3 text-sm sm:text-base text-chocolate-700 font-light leading-relaxed">
            Never be misled by different pack sizes again. InfinityHub computes real unit pricing (₹/kg, ₹/litre) across BigBasket, Zepto, Blinkit & Amazon Fresh.
          </p>
        </div>

        {/* Value Comparison Showcase (Feature 21 Example) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-300 shadow-soft-lg mb-12">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-pink-200">
            <Sparkles className="w-5 h-5 text-pink-600" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-chocolate-950">
              Live Unit Pricing Engine Demonstration
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Item A */}
            <div className="p-5 rounded-2xl bg-cream-50 border border-pink-200 relative flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-chocolate-500 block">Option A (Standard Pack)</span>
                <h4 className="font-serif text-base font-bold text-chocolate-950 mt-1">
                  Premium Basmati Rice (1 kg Pouch)
                </h4>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-serif text-2xl font-bold text-chocolate-900">₹110</span>
                  <span className="text-xs text-chocolate-500">/ 1 kg</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs font-bold text-chocolate-700">
                <span>Calculated Rate:</span>
                <span className="text-chocolate-900">₹110 / kg</span>
              </div>
            </div>

            {/* Item B (Winner) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-cream-50 border-2 border-emerald-400 shadow-soft relative flex flex-col justify-between">
              <div className="absolute top-3 right-3 bg-emerald-700 text-white text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                🏆 BEST VALUE PACK
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Option B (Bulk 5kg Value Sack)</span>
                <h4 className="font-serif text-base font-bold text-chocolate-950 mt-1">
                  Daawat Rozana Gold Aged Basmati Rice (5 kg)
                </h4>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-serif text-2xl font-bold text-chocolate-900">₹425</span>
                  <span className="text-xs text-chocolate-500">/ 5 kg sack</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Calculated Rate:</span>
                <span className="text-emerald-700 font-serif text-base">₹85 / kg (Save ₹25/kg!)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Grocery Catalog Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groceryProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-3xl p-5 border border-pink-200 shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all"
            >
              <div>
                <div className="aspect-video bg-cream-50 rounded-2xl p-3 mb-4 flex items-center justify-center relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  <span className="absolute top-2 left-2 bg-chocolate-900 text-cream-50 text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                    {product.store}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-pink-600 font-extrabold uppercase text-[10px]">{product.brand}</span>
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded">
                    {product.unitPriceText}
                  </span>
                </div>

                <h3 
                  onClick={() => setSelectedProduct(product)}
                  className="font-serif text-sm font-bold text-chocolate-950 cursor-pointer hover:text-pink-600"
                >
                  {product.name}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between">
                <div>
                  <span className="font-serif text-lg font-bold text-chocolate-950">
                    ₹{product.finalEstimatedPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    {product.deliveryEstimate}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="px-3 py-2 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-pink-300" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

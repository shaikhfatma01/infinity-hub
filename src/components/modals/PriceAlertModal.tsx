import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, Sparkles, CheckCircle2, TrendingDown } from 'lucide-react';

export const PriceAlertModal: React.FC = () => {
  const { 
    isPriceAlertModalOpen, 
    setIsPriceAlertModalOpen, 
    priceAlertTargetProduct, 
    addPriceAlert 
  } = useApp();

  const [targetPrice, setTargetPrice] = useState<number>(0);

  useEffect(() => {
    if (priceAlertTargetProduct) {
      // Default recommended target: 15% below current price
      setTargetPrice(Math.round(priceAlertTargetProduct.currentPrice * 0.85));
    }
  }, [priceAlertTargetProduct]);

  if (!isPriceAlertModalOpen || !priceAlertTargetProduct) return null;

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPrice > 0) {
      addPriceAlert(priceAlertTargetProduct, targetPrice);
      setIsPriceAlertModalOpen(false);
    }
  };

  const discountFromCurrent = Math.round(((priceAlertTargetProduct.currentPrice - targetPrice) / priceAlertTargetProduct.currentPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-chocolate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-soft-lg border border-pink-300 text-left animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-base font-bold text-chocolate-950">
              Set Price Drop Alert
            </h3>
          </div>

          <button
            onClick={() => setIsPriceAlertModalOpen(false)}
            className="p-1.5 rounded-xl text-chocolate-400 hover:text-chocolate-950 hover:bg-pink-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snippet */}
        <div className="flex items-center gap-3 bg-cream-50 p-3 rounded-2xl border border-pink-100 mb-5">
          <img 
            src={priceAlertTargetProduct.image} 
            alt={priceAlertTargetProduct.name} 
            className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-pink-100 shrink-0 mix-blend-multiply" 
          />
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase text-pink-600 block">{priceAlertTargetProduct.store}</span>
            <h4 className="font-serif text-xs font-bold text-chocolate-950 truncate max-w-[200px]">{priceAlertTargetProduct.name}</h4>
            <span className="font-serif text-xs font-bold text-chocolate-900">Current: ₹{priceAlertTargetProduct.currentPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSetAlert} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-chocolate-900 block mb-1">
              Notify me when price drops to or below:
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-serif font-bold text-chocolate-500">₹</span>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                min="10"
                max={priceAlertTargetProduct.currentPrice}
                required
                className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-cream-100 border border-pink-200 text-sm font-bold text-chocolate-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            {discountFromCurrent > 0 && (
              <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                📉 That's {discountFromCurrent}% cheaper than today's listed price!
              </span>
            )}
          </div>

          <div className="p-3 bg-pink-50 rounded-2xl border border-pink-200/80 text-[11px] text-chocolate-700 leading-relaxed">
            ✨ Infinity AI monitors price changes across Amazon, Flipkart, Myntra, and Nykaa every 30 minutes.
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bell className="w-4 h-4 text-pink-300" />
            <span>Activate 24/7 Price Alert</span>
          </button>
        </form>

      </div>
    </div>
  );
};

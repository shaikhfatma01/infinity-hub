import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingMission, ShoppingMissionItem } from '../../types';
import { 
  X, 
  Sparkles, 
  GraduationCap, 
  Home, 
  Laptop, 
  Sparkle, 
  Dumbbell, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight, 
  TrendingDown, 
  Store, 
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ShoppingMissionsModal: React.FC = () => {
  const { 
    isMissionsModalOpen, 
    setIsMissionsModalOpen, 
    missions, 
    activeMission, 
    setActiveMission,
    addToCart,
    showToast,
    setIsCartOpen
  } = useApp();

  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({
    'item-backpack': true,
    'item-headphones': true,
    'item-shoes': true,
    'item-skincare': true,
    'item-lamp': true,
    'item-blanket': true,
    'item-laptop': true,
    'item-audio': true,
    'item-sunscreen': true,
    'item-purse': true,
    'item-gym-shoes': true,
    'item-gym-watch': true
  });

  if (!isMissionsModalOpen || !activeMission) return null;

  // Compute live budget metrics
  const activeMissionItems = activeMission.items.filter(item => selectedItems[item.id] !== false);
  const selectedTotal = activeMissionItems.reduce((sum, item) => sum + item.selectedProduct.finalEstimatedPrice, 0);
  const remainingBudget = activeMission.targetBudget - selectedTotal;
  const storesInvolved = new Set(activeMissionItems.map(i => i.selectedProduct.store)).size;
  const potentialSavings = Math.round(selectedTotal * 0.12);

  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleOptimizeMission = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F78FB9', '#3D2314', '#D4AF37', '#10B981']
    });

    // Add all mission items to Infinity Cart
    activeMissionItems.forEach(item => {
      addToCart(item.selectedProduct);
    });

    showToast(
      '🎉 Mission Optimized & Added to Cart!', 
      `All ${activeMissionItems.length} items from ${storesInvolved} stores added to your Infinity Cart. Saved ₹${potentialSavings.toLocaleString('en-IN')}!`,
      'success'
    );

    setIsMissionsModalOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-chocolate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-soft-lg border border-pink-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-pink-100 text-chocolate-900 text-xs font-extrabold px-3 py-1 rounded-full border border-pink-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              Goal-Driven Shopping Engine
            </span>
            <span className="text-xs text-chocolate-500 font-medium hidden sm:inline">
              Feature 18 & 47 • Shopping Missions
            </span>
          </div>

          <button
            onClick={() => setIsMissionsModalOpen(false)}
            className="p-2 rounded-xl text-chocolate-400 hover:text-chocolate-950 hover:bg-pink-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mission Picker Tabs */}
        <div className="px-6 pt-6 pb-2 overflow-x-auto border-b border-pink-100 bg-cream-50/70">
          <div className="flex items-center gap-2 min-w-max pb-2">
            {missions.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveMission(m)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeMission.id === m.id
                    ? 'bg-chocolate-900 text-cream-50 shadow-sm'
                    : 'bg-white text-chocolate-700 hover:bg-pink-100 border border-pink-200'
                }`}
              >
                <span>{m.title}</span>
                <span className="text-[10px] opacity-80 font-sans">
                  (₹{m.targetBudget.toLocaleString('en-IN')})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Mission Hero Banner & Budget Tracker */}
          <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-cream-100 rounded-3xl p-6 border-2 border-pink-300 shadow-soft">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-pink-600 mb-1">
                  {activeMission.category}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
                  {activeMission.title}
                </h2>
                <p className="text-xs sm:text-sm text-chocolate-700 mt-1 max-w-xl font-light">
                  {activeMission.description}
                </p>
              </div>

              {/* Live Budget Meter Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-2xl border border-pink-200 shadow-xs text-center">
                  <span className="text-[10px] text-chocolate-500 font-bold uppercase block">Budget</span>
                  <span className="font-serif text-base font-bold text-chocolate-950">
                    ₹{activeMission.targetBudget.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-pink-200 shadow-xs text-center">
                  <span className="text-[10px] text-chocolate-500 font-bold uppercase block">Selected</span>
                  <span className="font-serif text-base font-bold text-chocolate-950">
                    ₹{selectedTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-pink-200 shadow-xs text-center">
                  <span className="text-[10px] text-chocolate-500 font-bold uppercase block">Remaining</span>
                  <span className={`font-serif text-base font-bold ${remainingBudget >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    ₹{remainingBudget.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-pink-200 shadow-xs text-center">
                  <span className="text-[10px] text-chocolate-500 font-bold uppercase block">Stores</span>
                  <span className="font-serif text-base font-bold text-pink-600">
                    {storesInvolved} Stores
                  </span>
                </div>
              </div>

            </div>

            {/* AI Optimization Tips */}
            <div className="mt-4 pt-4 border-t border-pink-200/80 flex items-center gap-2 text-xs text-chocolate-800 font-medium">
              <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
              <span>{activeMission.tips[0]}</span>
            </div>
          </div>

          {/* Mission Items List */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-chocolate-950">
              Curated Basket Items for this Mission
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMission.items.map((item) => {
                const isSelected = selectedItems[item.id] !== false;
                const prod = item.selectedProduct;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-3xl border transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-white border-pink-300 shadow-soft'
                        : 'bg-cream-100/50 border-pink-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleItem(item.id)}
                        className="w-4 h-4 text-pink-600 rounded focus:ring-pink-400 accent-pink-600 cursor-pointer"
                      />

                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-16 object-contain rounded-2xl bg-cream-50 p-1 border border-pink-100 shrink-0 mix-blend-multiply"
                      />

                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-pink-600 block">
                          {item.category} • {prod.store}
                        </span>
                        <h4 className="font-serif text-xs font-bold text-chocolate-950 truncate max-w-[200px]">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-serif text-xs font-bold text-chocolate-900">
                            ₹{prod.finalEstimatedPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                            ★ {prod.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-chocolate-500 font-medium block">
                        Allocated: ₹{item.allocatedBudget.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Section: 1-Click Optimize My Mission */}
          <div className="pt-4 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs text-chocolate-600 block">
                Total Multi-Store Cost: <strong className="text-chocolate-950 font-serif text-sm">₹{selectedTotal.toLocaleString('en-IN')}</strong>
              </span>
              <span className="text-xs text-emerald-700 font-bold">
                🎉 Includes ~₹{potentialSavings.toLocaleString('en-IN')} bundle savings!
              </span>
            </div>

            <button
              onClick={handleOptimizeMission}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-sm font-bold shadow-md hover:shadow-choc-glow transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-pink-300 group-hover:rotate-12 transition-transform" />
              <span>✨ Optimize My Mission & Add to Cart</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

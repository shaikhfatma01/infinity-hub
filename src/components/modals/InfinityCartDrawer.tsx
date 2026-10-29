import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CartItem, StoreName } from '../../types';
import { 
  X, 
  ShoppingBag, 
  Sparkles, 
  Trash2, 
  Plus, 
  Minus, 
  TrendingDown, 
  Store, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { CartOptimizationReport } from '../../services/aiEngine';

export const InfinityCartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    removeFromCart, 
    updateCartQuantity, 
    cartStoreCount,
    cartTotal,
    cartPotentialSavings,
    runCartOptimizer,
    applyCartOptimizations,
    setSelectedProduct,
    showToast
  } = useApp();

  const [optimizationReport, setOptimizationReport] = useState<CartOptimizationReport | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  if (!isCartOpen) return null;

  // Group items by store
  const storeGroups = cartItems.reduce<Record<StoreName, CartItem[]>>((acc, item) => {
    if (!acc[item.selectedStore]) {
      acc[item.selectedStore] = [];
    }
    acc[item.selectedStore].push(item);
    return acc;
  }, {} as Record<StoreName, CartItem[]>);

  const handleRunOptimizer = async () => {
    setIsOptimizing(true);
    try {
      const [report] = await Promise.all([
        runCartOptimizer(),
        new Promise(resolve => setTimeout(resolve, 500)) // brief "analysing" state so the UI feels deliberate
      ]);
      setOptimizationReport(report);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyOptimizer = async () => {
    if (optimizationReport) {
      await applyCartOptimizations(optimizationReport);
      setOptimizationReport(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-chocolate-950/60 backdrop-blur-sm flex justify-end">
      <div className="relative bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left border-l border-pink-200">
        
        {/* Cart Header */}
        <div className="bg-gradient-to-r from-chocolate-950 via-chocolate-900 to-chocolate-950 text-cream-100 px-6 py-5 flex items-center justify-between border-b border-chocolate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-300 text-chocolate-950 flex items-center justify-center font-bold shadow-md">
              <ShoppingBag className="w-5 h-5 text-chocolate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-cream-50">🛒 Infinity Cart</h3>
                <span className="bg-pink-500/20 text-pink-300 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border border-pink-400/30">
                  Universal Workspace
                </span>
              </div>
              <p className="text-xs text-cream-300">
                {cartItems.length} Products across {cartStoreCount} {cartStoreCount === 1 ? 'Store' : 'Stores'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl text-cream-300 hover:text-white hover:bg-chocolate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Cart Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-cream-50/50">
          
          {/* Smart Cart Optimizer Banner (Feature 14) */}
          <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-cream-100 rounded-3xl p-5 border-2 border-pink-300 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-pink-600 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Cart Intelligence
                </div>
                <h4 className="font-serif text-base font-bold text-chocolate-950">
                  Smart Cart Optimizer™
                </h4>
                <p className="text-xs text-chocolate-700 mt-1 font-light leading-relaxed">
                  Infinity AI scans cross-store twins to eliminate duplicate shipping and switch to lower prices.
                </p>
              </div>

              <button
                onClick={handleRunOptimizer}
                disabled={isOptimizing || cartItems.length === 0}
                className="px-4 py-2.5 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs font-bold shadow-md hover:shadow-choc-glow transition-all shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                <span>{isOptimizing ? 'Analyzing...' : '✨ Optimize Cart'}</span>
              </button>
            </div>

            {/* Optimization Report Panel (Feature 14 Before vs After) */}
            {optimizationReport && (
              <div className="mt-4 pt-4 border-t border-pink-200 space-y-3 animate-fade-in">
                {optimizationReport.totalSavings > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-2xl border border-pink-200 text-center text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-chocolate-500 block uppercase">Before</span>
                        <span className="font-serif font-bold text-chocolate-400 line-through">
                          ₹{optimizationReport.originalTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-chocolate-500 block uppercase">After</span>
                        <span className="font-serif font-bold text-chocolate-950">
                          ₹{optimizationReport.optimizedTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-1 border border-emerald-200">
                        <span className="text-[10px] font-extrabold text-emerald-800 block uppercase">You Save</span>
                        <span className="font-serif font-extrabold text-emerald-700">
                          ₹{optimizationReport.totalSavings.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-chocolate-800">
                      {optimizationReport.optimizations.map((opt, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                          <span className="font-medium truncate max-w-[240px]">• {opt.reason}</span>
                          <span className="font-bold text-emerald-800 shrink-0">Save ₹{opt.savings}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleApplyOptimizer}
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Apply All Savings to Cart</span>
                    </button>
                  </>
                ) : (
                  <div className="p-3 bg-white rounded-2xl text-xs text-chocolate-800 text-center font-medium border border-pink-200">
                    🎉 Excellent! Your cart is already optimized for the lowest possible prices and shipping costs.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Items Grouped by Store */}
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(storeGroups).map(([storeName, items]) => {
                const storeSubtotal = items.reduce((sum, i) => sum + (i.selectedPrice + i.selectedShipping) * i.quantity, 0);

                return (
                  <div key={storeName} className="bg-white rounded-3xl p-5 border border-pink-200 shadow-soft space-y-4">
                    
                    {/* Store Group Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-pink-100">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-pink-600" />
                        <h4 className="font-serif text-sm font-bold text-chocolate-950">
                          {storeName} Package ({items.length} {items.length === 1 ? 'item' : 'items'})
                        </h4>
                      </div>
                      <span className="text-xs font-extrabold text-chocolate-900 font-serif">
                        Subtotal: ₹{storeSubtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Store Line Items */}
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-cream-50/70 border border-pink-100 hover:bg-pink-50/50 transition-colors"
                        >
                          <div 
                            className="flex items-center gap-3 min-w-0 cursor-pointer"
                            onClick={() => {
                              setSelectedProduct(item.product);
                              setIsCartOpen(false);
                            }}
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-pink-100 shrink-0 mix-blend-multiply"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] uppercase font-bold text-pink-600 block">
                                {item.product.brand}
                              </span>
                              <h5 className="font-serif text-xs font-bold text-chocolate-950 truncate max-w-[190px]">
                                {item.product.name}
                              </h5>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-serif text-xs font-bold text-chocolate-900">
                                  ₹{item.selectedPrice.toLocaleString('en-IN')}
                                </span>
                                {item.selectedShipping > 0 && (
                                  <span className="text-[10px] text-chocolate-500">
                                    (+₹{item.selectedShipping} ship)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quantity & Delete Controls */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center bg-white rounded-xl border border-pink-200 p-0.5">
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                className="p-1 text-chocolate-600 hover:text-chocolate-950 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-chocolate-950">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                className="p-1 text-chocolate-600 hover:text-chocolate-950 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 rounded-xl text-chocolate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto text-2xl font-serif">
                🛒
              </div>
              <h4 className="font-serif text-lg font-bold text-chocolate-950">
                Your Infinity Cart is Empty
              </h4>
              <p className="text-xs text-chocolate-600 max-w-xs mx-auto">
                Explore universal search, shopping missions, or ask Infinity AI to build your basket.
              </p>
            </div>
          )}

        </div>

        {/* Cart Bottom Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="bg-white border-t border-pink-200 p-6 space-y-4 shrink-0 shadow-lg">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-chocolate-600">
                <span>Total Items across {cartStoreCount} Stores:</span>
                <span className="font-bold text-chocolate-950">{cartItems.length} Products</span>
              </div>

              <div className="flex justify-between text-chocolate-600">
                <span>Estimated Shipping & Fees:</span>
                <span className="font-bold text-emerald-700">Optimized Minimum</span>
              </div>

              <div className="pt-2 border-t border-pink-100 flex justify-between items-baseline">
                <div>
                  <span className="text-[11px] font-bold text-chocolate-500 uppercase tracking-wider block">Estimated Total Cost</span>
                  <span className="font-serif text-2xl font-bold text-chocolate-950">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  🎉 Verified Lowest Multi-Store Price
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('🚀 Proceeding to Multi-Store Checkout', 'Connecting securely with original retailer authorized portals...', 'success');
              }}
              className="w-full py-3.5 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs sm:text-sm font-bold shadow-md hover:shadow-choc-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Retailer Checkout ({cartStoreCount} Stores)</span>
              <ExternalLink className="w-4 h-4 text-pink-300" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
